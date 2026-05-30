import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { pool, query } from "./pool";
import { createCommunitySchema } from "./community_schema";

// Helper to hash passwords securely
async function hashPassword(pwd: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
}

export async function initDB() {
  const client = await pool.connect();
  try {
    console.log("[Database] Initializing relational tables...");
    
    // Read schema.sql file
    const schemaPath = path.join(__dirname, "schema.sql");
    let schemaSQL = "";
    if (fs.existsSync(schemaPath)) {
      schemaSQL = fs.readFileSync(schemaPath, "utf-8");
    } else {
      // Inline fallback definitions for safety
      schemaSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'aluno',
          status TEXT DEFAULT 'ativo',
          strikes INT DEFAULT 0,
          plan TEXT NOT NULL DEFAULT 'free',
          plan_expires_at TIMESTAMPTZ,
          is_paid BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        -- Add plan columns to existing tables if upgrading
        ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS strikes INT DEFAULT 0;
        
        CREATE TABLE IF NOT EXISTS profiles (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          avatar TEXT,
          xp INT DEFAULT 100,
          nickname TEXT DEFAULT '',
          phone TEXT DEFAULT '',
          zip_code TEXT DEFAULT '',
          address TEXT DEFAULT '',
          description TEXT DEFAULT '',
          portfolio TEXT DEFAULT '',
          website TEXT DEFAULT '',
          whatsapp TEXT DEFAULT '',
          telegram TEXT DEFAULT '',
          facebook TEXT DEFAULT '',
          instagram TEXT DEFAULT '',
          x_twitter TEXT DEFAULT '',
          other_net TEXT DEFAULT '',
          show_phone BOOLEAN DEFAULT FALSE,
          show_address BOOLEAN DEFAULT FALSE,
          author_title TEXT DEFAULT 'Busca-Caminhos',
          grau TEXT DEFAULT 'Grau I - Iniciado',
          location TEXT DEFAULT 'Santuário Sagrado'
        );
        CREATE TABLE IF NOT EXISTS settings (
          user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          theme_preference TEXT DEFAULT 'auto',
          color_theme TEXT DEFAULT 'oracle'
        );
        CREATE TABLE IF NOT EXISTS challenges (
          user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          completed_quiz BOOLEAN DEFAULT FALSE,
          flashcard_count INT DEFAULT 0,
          flashcard_completed BOOLEAN DEFAULT FALSE,
          completed_journal BOOLEAN DEFAULT FALSE,
          lenormand_completed BOOLEAN DEFAULT FALSE,
          lenormand_early BOOLEAN DEFAULT FALSE
        );
        CREATE TABLE IF NOT EXISTS grimoire_entries (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          date TIMESTAMPTZ DEFAULT NOW(),
          question TEXT NOT NULL,
          spread_type TEXT NOT NULL,
          cards JSONB NOT NULL,
          interpretation TEXT NOT NULL,
          attachments JSONB DEFAULT '[]'
        );
        CREATE TABLE IF NOT EXISTS community_news (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          date TEXT DEFAULT 'Hoje',
          read_time TEXT DEFAULT '5 min',
          image TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS community_posts (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          author_name TEXT NOT NULL,
          author_title TEXT DEFAULT 'Busca-Caminhos',
          avatar TEXT,
          coven TEXT DEFAULT 'Eter',
          content TEXT NOT NULL,
          images TEXT DEFAULT '[]',
          likes INT DEFAULT 0,
          comments INT DEFAULT 0,
          date TIMESTAMPTZ DEFAULT NOW(),
          tags TEXT DEFAULT '[]',
          status TEXT DEFAULT 'aprovado'
        );
        ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aprovado';
        
        CREATE TABLE IF NOT EXISTS post_comments (
          id SERIAL PRIMARY KEY,
          post_id INT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          author_name TEXT NOT NULL,
          avatar TEXT,
          content TEXT NOT NULL,
          date TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS badges (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          date TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS birth_charts (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          full_name TEXT NOT NULL,
          birth_date TEXT NOT NULL,
          birth_time TEXT NOT NULL,
          birth_location TEXT NOT NULL,
          chart_data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS study_plans (
          user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          plan JSONB NOT NULL
        );
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          text TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          type TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS user_course_progress (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          course_id INT NOT NULL,
          completed_lessons JSONB DEFAULT '[]',
          score INT DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, course_id)
        );
        CREATE TABLE IF NOT EXISTS marketplace_items (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          author_name TEXT NOT NULL,
          title TEXT NOT NULL,
          subtitle TEXT,
          description TEXT NOT NULL,
          price NUMERIC(10,2) DEFAULT 0.00,
          category TEXT NOT NULL,
          cover_image TEXT,
          hashtags TEXT DEFAULT '[]',
          file_url TEXT DEFAULT '',
          status TEXT DEFAULT 'aprovado',
          date TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE marketplace_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aprovado';
        
        CREATE TABLE IF NOT EXISTS product_reviews (
          id SERIAL PRIMARY KEY,
          item_id INT NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          comment TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(item_id, user_id)
        );
        CREATE TABLE IF NOT EXISTS sellers (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          balance NUMERIC(10,2) DEFAULT 0.00,
          commission_rate NUMERIC(5,2) DEFAULT 15.00
        );
        CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          amount NUMERIC(10,2) NOT NULL,
          commission_platform NUMERIC(10,2) DEFAULT 0.00,
          amount_seller NUMERIC(10,2) DEFAULT 0.00,
          title TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pendente',
          pix_key TEXT,
          date TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS purchases (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          item_id INT REFERENCES marketplace_items(id) ON DELETE SET NULL,
          course_id INT,
          amount NUMERIC(10,2) NOT NULL,
          transaction_id INT REFERENCES transactions(id) ON DELETE SET NULL,
          status TEXT NOT NULL DEFAULT 'pendente',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          plan TEXT NOT NULL,
          cycle TEXT NOT NULL DEFAULT 'mensal',
          status TEXT NOT NULL DEFAULT 'active',
          payment_id TEXT,
          amount NUMERIC(10,2),
          started_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS global_settings (
          id INT PRIMARY KEY DEFAULT 1,
          site_name TEXT DEFAULT 'The Oracle Academy',
          system_name TEXT DEFAULT 'Oracle System',
          cnpj TEXT DEFAULT '',
          company_info TEXT DEFAULT '',
          favicon_url TEXT DEFAULT '/favicon.svg',
          logo_url TEXT DEFAULT '/logo.svg',
          sublogo_url TEXT DEFAULT '',
          partners JSONB DEFAULT '[]',
          ad_companies JSONB DEFAULT '[]',
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS ai_prompts (
          id SERIAL PRIMARY KEY,
          feature TEXT UNIQUE NOT NULL,
          prompt_text TEXT NOT NULL,
          description TEXT,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS moderation_logs (
          id SERIAL PRIMARY KEY,
          admin_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          target_user_id INT REFERENCES users(id) ON DELETE SET NULL,
          action TEXT NOT NULL,
          reason TEXT,
          details JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS ads_campaigns (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          image_url TEXT NOT NULL,
          link_url TEXT NOT NULL,
          placement TEXT NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
    }

    // Split SQL by semicolon (naively, but works for clean schemas) and execute
    const statements = schemaSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.query(statement);
    }
    console.log("[Database] Relational tables loaded successfully!");

    // Execute separate community advanced schema
    await createCommunitySchema(client);

    // --- SEED SECTIONS ---
    
    // 0. Seed Global Settings & Prompts
    const settingsCount = await client.query("SELECT COUNT(*) FROM global_settings");
    if (parseInt(settingsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO global_settings (id, site_name, system_name, cnpj, company_info, favicon_url, logo_url, sublogo_url, partners, ad_companies)
        VALUES (1, 'The Oracle Academy', 'Sistema Oráculo', '00.000.000/0001-00', 'The Oracle Academy LLC.', '/favicon.svg', '/logo.svg', '', '[]', '[]')
      `);
    }

    const promptsCount = await client.query("SELECT COUNT(*) FROM ai_prompts");
    if (parseInt(promptsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO ai_prompts (feature, prompt_text, description) VALUES
        ('oracle_reading', 'Você é o Oráculo, um mestre tarólogo. Responda com sabedoria...', 'Prompt principal de leitura de cartas do oráculo.'),
        ('grimoire_assistant', 'Ajude o usuário a aprofundar suas anotações místicas.', 'Assistente do grimório para estudantes.')
      `);
    }

    // 1. Seed Admin User
    const adminCheck = await client.query("SELECT * FROM users WHERE email = 'admin@admin.com'");
    let adminUserId = null;
    if (adminCheck.rows.length === 0) {
      const hashedAdminPassword = await hashPassword("123456");
      const res = await client.query(
        "INSERT INTO users (email, password, role, plan, is_paid) VALUES ('admin@admin.com', $1, 'admin', 'master', true) RETURNING id",
        [hashedAdminPassword]
      );
      adminUserId = res.rows[0].id;
      await client.query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, description, author_title, grau, location
        ) VALUES ($1, 'Admin Master', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150', 5000, 
        'admin', 'Magus Supremo e decodificador das estrelas.', 'Magus Supremo', 'Grau VIII - Grão-Mestre', 'Santuário Urânia')`,
        [adminUserId]
      );
      await client.query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [adminUserId]
      );
      await client.query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [adminUserId]
      );
      await client.query(
        "INSERT INTO sellers (user_id, balance, commission_rate) VALUES ($1, 0.00, 15.00)",
        [adminUserId]
      );
    } else {
      adminUserId = adminCheck.rows[0].id;
    }

    // 2. Seed Student User
    const userCheck = await client.query("SELECT * FROM users WHERE email = 'user@user.com'");
    let studentUserId = null;
    if (userCheck.rows.length === 0) {
      const hashedUserPassword = await hashPassword("123456");
      const res = await client.query(
        "INSERT INTO users (email, password, role, plan, is_paid) VALUES ('user@user.com', $1, 'aluno', 'free', false) RETURNING id",
        [hashedUserPassword]
      );
      studentUserId = res.rows[0].id;
      await client.query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, description, author_title, grau, location
        ) VALUES ($1, 'Usuário Comum', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150', 120, 
        'comum', 'Buscador de verdades e mistérios celestiais.', 'Busca-Caminhos', 'Grau I - Iniciado', 'Estrela de Entrada')`,
        [studentUserId]
      );
      await client.query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [studentUserId]
      );
      await client.query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [studentUserId]
      );
    } else {
      studentUserId = userCheck.rows[0].id;
    }

    // 3. Seed Seller User
    const sellerCheck = await client.query("SELECT * FROM users WHERE email = 'seller@seller.com'");
    let sellerUserId = null;
    if (sellerCheck.rows.length === 0) {
      const hashedSellerPassword = await hashPassword("123456");
      const res = await client.query(
        "INSERT INTO users (email, password, role, plan, is_paid) VALUES ('seller@seller.com', $1, 'vendedor', 'medium', true) RETURNING id",
        [hashedSellerPassword]
      );
      sellerUserId = res.rows[0].id;
      await client.query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, description, author_title, grau, location
        ) VALUES ($1, 'Artesão Hermético', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150', 1200, 
        'artesao', 'Vendedor de itens consagrados e oráculos artesanais.', 'Artesão', 'Grau III - Alquimista', 'Santuário Alquímico')`,
        [sellerUserId]
      );
      await client.query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [sellerUserId]
      );
      await client.query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [sellerUserId]
      );
      await client.query(
        "INSERT INTO sellers (user_id, balance, commission_rate) VALUES ($1, 250.00, 15.00)",
        [sellerUserId]
      );
    } else {
      sellerUserId = sellerCheck.rows[0].id;
    }

    // 4. Seed community news
    const newsCount = await client.query("SELECT COUNT(*) FROM community_news");
    if (parseInt(newsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO community_news (title, summary, content, date, read_time, image)
        VALUES 
        ('Portais Celestiais: Alinhamento de Júpiter em Gêmeos abre canais de Intuição Prática', 
         'Astrólogos alertam para aceleração de pensamentos e clareza oracular inédita nas próximas semanas.', 
         'Os céus se preparam para uma conjunção alquímica de profunda ressonância intelectual. Júpiter, o planeta da expansão espiritual e sabedoria, faz um trígono harmônico com os astros regentes na constelação de Gêmeos. Este trânsito específico desperta a agilidade hermética, permitindo que os praticantes de Tarot, Runas e Astrologia conectem conceitos abstratos com assombrosa facilidade empírica.', 
         'Hoje', '3 min', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'),
        ('Misticismo e Frequências Vibracionais: Práticas de Meditação Elevam Frequência Cardíaca Sutil', 
         'Estudos de bioenergética demonstram que ritos guiados harmonizam o campo áurico celular.', 
         'A ciência de ponta continua tateando as fronteiras invisíveis do hermetismo antigo. Novas medições com eletroencefalografia multicanal durante rituais de manifestação lunar expuseram ondas gama coerentes em áreas do lobo frontal ligadas à tomada de decisão.', 
         'Ontem', '5 min', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80')
      `);
    }

    // 5. Seed community posts
    const postsCount = await client.query("SELECT COUNT(*) FROM community_posts");
    if (parseInt(postsCount.rows[0].count, 10) === 0 && adminUserId && sellerUserId) {
      await client.query(`
        INSERT INTO community_posts (user_id, author_name, author_title, avatar, coven, content, images, likes, comments, tags)
        VALUES 
        ($1, 'Elias Thorne', 'Mestre Ascenso', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Astrologia Kármica', 'Tentei combinar o significado de Fehu com os trânsitos de Vênus para uma leitura financeira. Os resultados foram impressionantes! A chave está em focar na expansão e não na falta.', '["https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 243, 42, '["Astrologia", "Prosperidade"]'),
        ($2, 'Serena Moon', 'Sacerdotisa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Magia Natural & Ervas', 'Hoje o rito será sobre Intuição e Clareza. Acendam uma vela de lavanda e segurem sua pedra da lua. A vibração está propícia para revelações oníricas.', '[]', 89, 12, '["Ritual", "Lua"]'),
        ($1, 'Marcus Vane', 'Hermetista', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Ocultismo Prático', 'A geometria sagrada não é apenas estética; é a planta baixa da realidade. Estudem o Cubo de Metatron e como ele governa a estrutura atômica.', '[]', 56, 8, '["Geometria", "Teoria"]')
      `, [adminUserId, sellerUserId]);
    }

    // 6. Seed marketplace items
    const marketplaceCount = await client.query("SELECT COUNT(*) FROM marketplace_items");
    if (parseInt(marketplaceCount.rows[0].count, 10) === 0 && adminUserId && sellerUserId) {
      await client.query(`
        INSERT INTO marketplace_items (user_id, author_name, title, subtitle, description, price, category, cover_image, hashtags, file_url)
        VALUES
        ($1, 'Aria Nova', 'Arcanos Maiores', 'Uma Jornada pelo Inconsciente', 'Explore o caminho do Louco através dos 22 Arcanos Maiores, um guia passo a passo para entender profundamente seu próprio ser.', 0.00, 'books', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400', '["Tarot", "Arcanos", "Espiritualidade"]', ''),
        ($2, 'Mestre C.', 'Lenormand Essencial', 'Prática na Mesa Real', 'Um tomo digital focado na prática diária do Baralho Cigano (Lenormand). Aprenda a interpretar combinações complexas.', 49.90, 'books', 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=400', '["Lenormand", "MesaReal", "Cartomancia"]', ''),
        ($2, 'Artesão Hermético', 'Amuqueto Consagrado', 'Proteção e Aterramento Lunar', 'Pendant de quartzo rosa imbuído em rito sob a lua cheia.', 35.00, 'jewelry', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', '["Amuqueto", "Quartzo", "Proteção"]', ''),
        ($2, 'Lúcia R.', 'A Intuição do Oráculo', 'Aterramento e Proteção', 'Práticas para conectar sua intuição antes de qualquer leitura. Essencial para manter o canal limpo.', 25.00, 'consultations', 'https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=400', '["Intuição", "Proteção", "Mediumnidade"]', ''),
        ($1, 'Eliphas Sol', 'Kabbalah e Tarot', 'Os Caminhos da Árvore', 'A profunda conexão entre a Kabbalah Hermética e o Tarot. Recomendado apenas para estudantes avançados.', 89.90, 'books', 'https://images.unsplash.com/photo-1532054950961-002ab40dd324?auto=format&fit=crop&q=80&w=400', '["Kabbalah", "Tarot", "AltaMagia"]', '')
      `, [adminUserId, sellerUserId]);
    }

    console.log("[Database] All database seeds written successfully!");
  } catch (err) {
    console.error("[Database] Initialization and seed error:", err);
  } finally {
    client.release();
  }
}
