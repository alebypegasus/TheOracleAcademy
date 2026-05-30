import pg from "pg";

const { Pool } = pg;

// We expose a mutable pool reference so it can be initialized AFTER env vars load.
// Call initPool() from server.ts after the .env parser runs.
let _pool: pg.Pool | null = null;

export function initPool() {
  if (_pool) return _pool;
  _pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:oracle2024@127.0.0.1:5432/oracle_main",
  });
  return _pool;
}

export function getPool(): pg.Pool {
  if (!_pool) initPool();
  return _pool!;
}

// pool is used throughout the codebase - proxy it so existing code doesn't need changes
export const pool = {
  connect: () => getPool().connect(),
  query: (text: string, params?: any[]) => getPool().query(text, params),
  end: () => getPool().end(),
};

export let useFallback = false;

// define in-memory data structures for a seamless local-only fallback
export const fallbackDB: {
  users: any[];
  profiles: any[];
  grimoire_entries: any[];
  settings: any[];
  challenges: any[];
  community_posts: any[];
  marketplace_items: any[];
  notifications: any[];
  birth_charts: any[];
  study_plans: any[];
  post_comments: any[];
  community_news: any[];
  badges: any[];
  transactions: any[];
  courses: any[];
  purchases: any[];
  sellers: any[];
  product_reviews: any[];
  course_node_contents: any[];
  community_groups: any[];
  group_members: any[];
  friendships: any[];
  direct_messages: any[];
  lesson_audios: any[];
  ads_campaigns: any[];
} = {
  users: [
    { id: 1, email: 'admin@admin.com', password: '$2b$10$FdZebsjlwQP7GUjqxTX6UOO0iM7LSdHeXyG00kMpHHNpAmTaupHnG', role: 'admin', is_paid: true, created_at: new Date().toISOString() }, // password: 123456 (hashed)
    { id: 2, email: 'user@user.com', password: '$2b$10$FdZebsjlwQP7GUjqxTX6UOO0iM7LSdHeXyG00kMpHHNpAmTaupHnG', role: 'aluno', is_paid: true, created_at: new Date().toISOString() } // password: 123456 (hashed)
  ],
  profiles: [
    {
      id: 1,
      user_id: 1,
      name: 'Admin Master',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      xp: 5000,
      nickname: 'admin',
      phone: '',
      zip_code: '',
      address: '',
      description: 'Magus Supremo e decodificador das estrelas.',
      portfolio: '',
      website: 'oracle.academy',
      whatsapp: '',
      telegram: '',
      facebook: '',
      instagram: '@oraculum_comunidade',
      x_twitter: '',
      other_net: '',
      show_phone: false,
      show_address: false,
      author_title: 'Magus Supremo',
      grau: 'Grau VIII - Grão-Mestre',
      location: 'Santuário Urânia'
    },
    {
      id: 2,
      user_id: 2,
      name: 'Buscador Celestial',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
      xp: 450,
      nickname: 'AstroSeeker',
      phone: '',
      zip_code: '',
      address: '',
      description: 'Estudioso de astrologia, tarologia e ocultismo prático na egrégora de Oracle Academy.',
      portfolio: '',
      website: 'oracle.academy',
      whatsapp: '',
      telegram: '',
      facebook: '',
      instagram: '@oraculum_comunidade',
      x_twitter: '',
      other_net: '',
      show_phone: false,
      show_address: false,
      author_title: 'Iniciado',
      grau: 'Grau I - Iniciado',
      location: 'Santuário Sagrado'
    }
  ],
  grimoire_entries: [],
  settings: [
    { user_id: 1, theme_preference: 'auto', color_theme: 'oracle' },
    { user_id: 2, theme_preference: 'auto', color_theme: 'oracle' }
  ],
  challenges: [
    { user_id: 1, completed_quiz: false, flashcard_count: 5, flashcard_completed: false, completed_journal: false, lenormand_completed: false, lenormand_early: false },
    { user_id: 2, completed_quiz: false, flashcard_count: 5, flashcard_completed: false, completed_journal: false, lenormand_completed: false, lenormand_early: false }
  ],
  community_posts: [
    {
      id: 1,
      user_id: 1,
      author_name: 'Elias Thorne',
      author_title: 'Mestre Ascenso',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      coven: 'Astrologia Kármica',
      content: 'Tentei combinar o significado de Fehu com os trânsitos de Vênus para uma leitura financeira. Os resultados foram impressionantes! A chave está em focar na expansão e não na falta.',
      images: '["https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]',
      likes: 243,
      comments: 42,
      date: new Date().toISOString(),
      tags: '["Astrologia", "Prosperidade"]'
    },
    {
      id: 2,
      user_id: 2,
      author_name: 'Serena Moon',
      author_title: 'Sacerdotisa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      coven: 'Magia Natural & Ervas',
      content: 'Hoje o rito será sobre Intuição e Clareza. Acendam uma vela de lavanda e segurem sua pedra da lua. A vibração está propícia para revelações oníricas.',
      images: '[]',
      likes: 89,
      comments: 12,
      date: new Date().toISOString(),
      tags: '["Ritual", "Lua"]'
    }
  ],
  marketplace_items: [
    {
      id: 1,
      user_id: 1,
      author_name: 'Aria Nova',
      title: 'Arcanos Maiores',
      subtitle: 'Uma Jornada pelo Inconsciente',
      description: 'Explore o caminho do Louco através dos 22 Arcanos Maiores, um guia passo a passo para entender profundamente seu próprio ser.',
      price: 0.00,
      category: 'Tomos',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      hashtags: '["Tarot", "Arcanos", "Espiritualidade"]',
      file_url: '',
      date: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      author_name: 'Mestre C.',
      title: 'Lenormand Essencial',
      subtitle: 'Prática na Mesa Real',
      description: 'Um tomo digital focado na prática diária do Baralho Cigano (Lenormand). Aprenda a interpretar combinações complexas.',
      price: 49.90,
      category: 'Tomos',
      cover_image: 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=400',
      hashtags: '["Lenormand", "MesaReal", "Cartomancia"]',
      file_url: '',
      date: new Date().toISOString()
    }
  ],
  notifications: [
    { id: 1, user_id: 1, text: 'Alguém curtiu sua postagem de estudos na Comunidade de Estudantes!', is_read: false, created_at: new Date().toISOString(), type: 'like' },
    { id: 2, user_id: 1, text: 'Parabéns! Seu novo certificado de "Fundamentos de Ocultismo Prático" foi emitido com sucesso pela Oracle Academy.', is_read: false, created_at: new Date().toISOString(), type: 'certificate' },
    { id: 3, user_id: 2, text: 'Seu Altar Diário foi renovado com novas missões de leitura e transmutação mental.', is_read: false, created_at: new Date().toISOString(), type: 'challenge' }
  ],
  birth_charts: [],
  study_plans: [],
  post_comments: [],
  community_news: [
    {
      id: 1,
      title: 'Portais Celestiais: Alinhamento de Júpiter em Gêmeos abre canais de Intuição Prática',
      summary: 'Astrólogos alertam para aceleração de pensamentos e clareza oracular inédita nas próximas semanas.',
      content: 'Os céus se preparam para uma conjunção alquímica de profunda ressonância intelectual. Júpiter, o planeta da expansão espiritual e sabedoria, faz um trígono harmônico com os astros regentes na constelação de Gêmeos. Este trânsito específico desperta a agilidade hermética, permitindo que os praticantes de Tarot, Runas e Astrologia conectem conceitos abstratos com assombrosa facilidade empírica.',
      date: 'Hoje',
      read_time: '3 min',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Misticismo e Frequências Vibracionais: Práticas de Meditação Elevam Frequência Cardíaca Sutil',
      summary: 'Estudos de bioenergética demonstram que ritos guiados harmonizam o campo áurico celular.',
      content: 'A ciência de ponta continua tateando as fronteiras invisíveis do hermetismo antigo. Novas medições com eletroencefalografia multicanal durante rituais de manifestação lunar expuseram ondas gama coerentes em áreas do lobo frontal ligadas à tomada de decisão.',
      date: 'Ontem',
      read_time: '5 min',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80'
    }
  ],
  badges: [
    { id: 1, user_id: 1, name: 'Pioneiro Astral', description: 'Realizou a primeira jornada pelas estrelas.', category: 'Iniciação' },
    { id: 2, user_id: 1, name: 'Mestre do Grimório', description: 'Registrou 10 interpretações místicas.', category: 'Estudos' },
    { id: 3, user_id: 2, name: 'Centelha Divina', description: 'Atingiu 500 XP de energia cósmica.', category: 'Evolução' }
  ],
  transactions: [
    { id: 1, user_id: 1, type: 'venda', amount: 50.00, commission_platform: 7.50, amount_seller: 42.50, title: 'Leitura de Cartas Especiais', status: 'concluído', date: new Date().toISOString() },
    { id: 2, user_id: 2, type: 'compra', amount: 35.00, commission_platform: 5.25, amount_seller: 29.75, title: 'Incenso de Sândalo Astral', status: 'concluído', date: new Date().toISOString() }
  ],
  courses: [],
  purchases: [],
  sellers: [
    { id: 1, user_id: 1, balance: 150.00, commission_rate: 15.00 },
    { id: 2, user_id: 2, balance: 80.00, commission_rate: 15.00 }
  ],
  product_reviews: [],
  course_node_contents: [],
  community_groups: [],
  group_members: [],
  friendships: [],
  direct_messages: [],
  lesson_audios: [],
  ads_campaigns: [
    {
      id: 1,
      title: 'Plano Ascendente',
      image_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&h=300&q=80',
      link_url: '#/dashboard',
      placement: 'marketplace',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
};

// Custom query executor mimicking the standard queries for PostgreSQL
export function executeMockQuery(sql: string, params: any[] = []): { rows: any[] } {
  const norm = sql.toLowerCase().replace(/\s+/g, ' ').trim();

  const enrichWithCamelCase = (p: any) => {
    if (!p) return p;
    return {
      ...p,
      zipCode: p.zipCode || p.zip_code,
      otherNet: p.otherNet || p.other_net,
      showPhone: typeof p.showPhone !== 'undefined' ? p.showPhone : p.show_phone,
      showAddress: typeof p.showAddress !== 'undefined' ? p.showAddress : p.show_address,
      authorTitle: p.authorTitle || p.author_title
    };
  };

  try {
    // Intercept COUNT(*) queries first to avoid conflicts with general SELECT * filters
    if (norm.includes('select count(*) from')) {
      let count = 0;
      if (norm.includes('community_posts')) count = fallbackDB.community_posts.length;
      else if (norm.includes('marketplace_items')) count = fallbackDB.marketplace_items.length;
      else if (norm.includes('users')) count = fallbackDB.users.length;
      else if (norm.includes('courses')) count = fallbackDB.courses.length;
      else if (norm.includes('community_news')) count = fallbackDB.community_news.length;
      else if (norm.includes('course_node_contents')) count = fallbackDB.course_node_contents.length;
      return { rows: [{ count: count.toString() }] };
    }

    // 1. SELECT * FROM users WHERE email = $1
    if (norm.includes('from users where email =')) {
      const emailVal = params[0]?.toLowerCase();
      const match = fallbackDB.users.find(u => 
        u.email.toLowerCase() === emailVal || 
        u.role.toLowerCase() === emailVal || 
        u.email.split('@')[0].toLowerCase() === emailVal
      );
      return { rows: match ? [match] : [] };
    }

    // 2. INSERT INTO users
    if (norm.includes('insert into users')) {
      const email = params[0];
      const password = params[1];
      const role = params[2] || 'aluno';
      const isPaid = params[3] || false;
      const newUser = {
        id: fallbackDB.users.length + 1,
        email,
        password,
        role,
        is_paid: isPaid,
        created_at: new Date().toISOString()
      };
      fallbackDB.users.push(newUser);
      return { rows: [newUser] };
    }

    // 3. SELECT * FROM profiles WHERE user_id = $1
    if (norm.includes('from profiles where user_id =')) {
      const userId = Number(params[0]);
      let profile = fallbackDB.profiles.find(p => Number(p.user_id) === userId);
      if (!profile) {
        profile = {
          id: fallbackDB.profiles.length + 1,
          user_id: userId,
          name: 'Buscador',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
          xp: 100,
          nickname: '',
          phone: '',
          zip_code: '',
          address: '',
          description: 'Um buscador do éter.',
          portfolio: '',
          website: 'oracle.academy',
          whatsapp: '',
          telegram: '',
          facebook: '',
          instagram: '',
          x_twitter: '',
          other_net: '',
          show_phone: false,
          show_address: false,
          author_title: 'Busca-Caminhos',
          grau: 'Grau I - Iniciado',
          location: 'Santuário Sagrado'
        };
        fallbackDB.profiles.push(profile);
      }
      return { rows: [enrichWithCamelCase(profile)] };
    }

    // 4. INSERT INTO profiles or UPDATE profiles
    if (norm.includes('insert into profiles') || norm.includes('update profiles set')) {
      // General handler to support upsert behavior or set update
      const userId = Number(params[0]);
      let profile = fallbackDB.profiles.find(p => Number(p.user_id) === userId);
      if (!profile) {
        profile = { user_id: userId, name: params[1] || 'Buscador', xp: 100 };
        fallbackDB.profiles.push(profile);
      }
      if (norm.includes('xp = xp +')) {
        profile.xp = (profile.xp || 100) + Number(params[0]);
      } else if (params.length > 5) {
        profile.name = params[1] || profile.name;
        profile.avatar = params[2] || profile.avatar;
        profile.xp = params[3] !== undefined ? Number(params[3]) : profile.xp;
        profile.nickname = params[4] || profile.nickname;
        profile.phone = params[5] || profile.phone;
        profile.zip_code = params[6] || profile.zip_code;
        profile.address = params[7] || profile.address;
        profile.description = params[8] || profile.description;
        profile.portfolio = params[9] || profile.portfolio;
        profile.website = params[10] || profile.website;
        profile.whatsapp = params[11] || profile.whatsapp;
        profile.telegram = params[12] || profile.telegram;
        profile.facebook = params[13] || profile.facebook;
        profile.instagram = params[14] || profile.instagram;
        profile.x_twitter = params[15] || profile.x_twitter;
        profile.other_net = params[16] || profile.other_net;
        profile.show_phone = typeof params[17] !== 'undefined' ? !!params[17] : profile.show_phone;
        profile.show_address = typeof params[18] !== 'undefined' ? !!params[18] : profile.show_address;
        profile.author_title = params[19] || profile.author_title;
        profile.grau = params[20] || profile.grau;
        profile.location = params[21] || profile.location;
      }
      return { rows: [enrichWithCamelCase(profile)] };
    }

    // 5. SELECT * FROM courses
    if (norm.includes('from courses')) {
      if (norm.includes('where id =')) {
        const idVal = Number(params[0]);
        const course = fallbackDB.courses.find(c => c.id === idVal);
        return { rows: course ? [course] : [] };
      }
      if (norm.includes('where title =') || norm.includes('title ilike')) {
        let titleVal = '';
        if (params && params.length > 0 && params[0]) {
          titleVal = params[0].replace(/%/g, '').toLowerCase();
        } else {
          const matchQuote = sql.match(/'([^']+)'/);
          if (matchQuote) {
            titleVal = matchQuote[1].replace(/%/g, '').toLowerCase();
          }
        }
        const matches = fallbackDB.courses.filter(c => c.title.toLowerCase().includes(titleVal));
        return { rows: matches };
      }
      return { rows: fallbackDB.courses };
    }

    // 6. INSERT INTO courses
    if (norm.includes('insert into courses')) {
      let title = params[0];
      let description = params[1];
      let content = params[2];
      let author = params[3] || 'IA';
      let status = params[4] || 'gerado';
      
      if (params.length === 1) {
        title = 'Saga Oracular - Trilha do Iniciado';
        description = 'Trilha fundamental do buscador para compreender as correspondências simbólicas do universo.';
        content = params[0];
        author = 'Admin';
        status = 'publicado';
      }
      
      const newCourse = {
        id: fallbackDB.courses.length + 1,
        title,
        description,
        content: typeof content === 'string' ? JSON.parse(content) : content,
        author,
        status,
        created_at: new Date().toISOString()
      };
      fallbackDB.courses.push(newCourse);
      return { rows: [newCourse] };
    }

    // 7. SELECT * FROM marketplace_items
    if (norm.includes('from marketplace_items')) {
      if (norm.includes('where user_id =')) {
        const userId = Number(params[0]);
        return { rows: fallbackDB.marketplace_items.filter(m => m.user_id === userId) };
      }
      return { rows: fallbackDB.marketplace_items };
    }

    // 8. INSERT INTO marketplace_items
    if (norm.includes('insert into marketplace_items')) {
      const newItem = {
        id: fallbackDB.marketplace_items.length + 1,
        user_id: Number(params[0]),
        author_name: params[1],
        title: params[2],
        subtitle: params[3],
        description: params[4],
        price: Number(params[5]),
        category: params[6],
        cover_image: params[7],
        hashtags: typeof params[8] === 'string' ? JSON.parse(params[8]) : params[8],
        file_url: params[9] || '',
        date: new Date().toISOString()
      };
      fallbackDB.marketplace_items.push(newItem);
      return { rows: [newItem] };
    }

    // lesson_audios
    if (norm.includes('from lesson_audios')) {
      if (norm.includes('where hash =')) {
        const h = params[0];
        return { rows: fallbackDB.lesson_audios.filter((l: any) => l.hash === h) };
      }
      return { rows: fallbackDB.lesson_audios };
    }
    if (norm.includes('insert into lesson_audios')) {
      const newAudio = {
        id: fallbackDB.lesson_audios.length + 1,
        hash: params[0],
        voice_id: params[1],
        audio_data: params[2],
        created_at: new Date().toISOString()
      };
      fallbackDB.lesson_audios.push(newAudio);
      return { rows: [newAudio] };
    }

    // ads_campaigns
    if (norm.includes('from ads_campaigns')) {
      if (norm.includes('where placement =')) {
        const placement = params[0];
        return { rows: fallbackDB.ads_campaigns.filter((a: any) => a.placement === placement && a.is_active) };
      }
      return { rows: fallbackDB.ads_campaigns };
    }
    if (norm.includes('insert into ads_campaigns')) {
      const newAd = {
        id: fallbackDB.ads_campaigns.length > 0 ? Math.max(...fallbackDB.ads_campaigns.map(a => a.id)) + 1 : 1,
        title: params[0],
        image_url: params[1],
        link_url: params[2] || '',
        placement: params[3],
        is_active: true,
        created_at: new Date().toISOString()
      };
      fallbackDB.ads_campaigns.push(newAd);
      return { rows: [newAd] };
    }
    if (norm.includes('update ads_campaigns set is_active')) {
      const activeStatus = params[0];
      const adId = Number(params[1]);
      const ad = fallbackDB.ads_campaigns.find(a => a.id === adId);
      if (ad) {
         ad.is_active = activeStatus;
         return { rows: [ad] };
      }
      return { rows: [] };
    }
    if (norm.includes('delete from ads_campaigns')) {
      const adId = Number(params[0]);
      fallbackDB.ads_campaigns = fallbackDB.ads_campaigns.filter(a => a.id !== adId);
      return { rows: [] };
    }

    // 9. SELECT * FROM transactions
    if (norm.includes('from transactions')) {
      if (norm.includes('where user_id =')) {
        const userId = Number(params[0]);
        return { rows: fallbackDB.transactions.filter(t => t.user_id === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
      }
      return { rows: fallbackDB.transactions };
    }

    // 10. INSERT INTO transactions
    if (norm.includes('insert into transactions')) {
      const newTx = {
        id: fallbackDB.transactions.length + 1,
        user_id: Number(params[0]),
        type: params[1],
        amount: Number(params[2]),
        commission_platform: Number(params[3] || 0),
        amount_seller: Number(params[4] || 0),
        title: params[5],
        status: params[6] || 'pendente',
        pix_key: params[7] || '',
        date: new Date().toISOString()
      };
      fallbackDB.transactions.push(newTx);
      return { rows: [newTx] };
    }

    // 11. SELECT * FROM sellers WHERE user_id = $1
    if (norm.includes('from sellers where user_id =')) {
      const userId = Number(params[0]);
      let seller = fallbackDB.sellers.find(s => s.user_id === userId);
      if (!seller) {
        seller = { id: fallbackDB.sellers.length + 1, user_id: userId, balance: 0.00, commission_rate: 15.00 };
        fallbackDB.sellers.push(seller);
      }
      return { rows: [seller] };
    }

    // 12. UPDATE sellers SET balance = balance + $1 WHERE user_id = $2
    if (norm.includes('update sellers set balance =')) {
      const balanceVal = Number(params[0]);
      const userId = Number(params[1]);
      const seller = fallbackDB.sellers.find(s => s.user_id === userId);
      if (seller) {
        seller.balance = Number(seller.balance || 0) + balanceVal;
        return { rows: [seller] };
      }
      return { rows: [] };
    }

    // 13. SELECT * FROM grimoire_entries
    if (norm.includes('from grimoire_entries')) {
      const userId = Number(params[0]);
      return { rows: fallbackDB.grimoire_entries.filter(g => g.user_id === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
    }

    // 14. INSERT INTO grimoire_entries
    if (norm.includes('insert into grimoire_entries')) {
      const newEntry = {
        id: fallbackDB.grimoire_entries.length + 1,
        user_id: Number(params[0]),
        date: params[1] || new Date().toISOString(),
        question: params[2],
        spread_type: params[3],
        cards: typeof params[4] === 'string' ? JSON.parse(params[4]) : params[4],
        interpretation: params[5],
        attachments: typeof params[6] === 'string' ? JSON.parse(params[6]) : params[6]
      };
      fallbackDB.grimoire_entries.push(newEntry);
      return { rows: [newEntry] };
    }

    // 15. SELECT * FROM challenges
    if (norm.includes('from challenges where user_id =')) {
      const userId = Number(params[0]);
      let challenge = fallbackDB.challenges.find(c => c.user_id === userId);
      if (!challenge) {
        challenge = { user_id: userId, completed_quiz: false, flashcard_count: 0, flashcard_completed: false, completed_journal: false, lenormand_completed: false, lenormand_early: false };
        fallbackDB.challenges.push(challenge);
      }
      return { rows: [challenge] };
    }

    // 16. UPDATE challenges
    if (norm.includes('update challenges')) {
      const userId = Number(params[params.length - 1]);
      const challenge = fallbackDB.challenges.find(c => c.user_id === userId);
      if (challenge) {
        if (norm.includes('completed_quiz =')) challenge.completed_quiz = !!params[0];
        if (norm.includes('flashcard_count =')) {
          challenge.flashcard_count = Number(params[0]);
          challenge.flashcard_completed = !!params[1];
        }
        if (norm.includes('completed_journal =')) challenge.completed_journal = !!params[0];
        if (norm.includes('lenormand_completed =')) {
          challenge.lenormand_completed = !!params[0];
          challenge.lenormand_early = !!params[1];
        }
        return { rows: [challenge] };
      }
      return { rows: [] };
    }

    // 17. SELECT * FROM notifications WHERE user_id = $1
    if (norm.includes('from notifications where user_id =')) {
      const userId = Number(params[0]);
      return { rows: fallbackDB.notifications.filter(n => n.user_id === userId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) };
    }

    // 18. INSERT INTO notifications
    if (norm.includes('insert into notifications')) {
      const newNotif = {
        id: fallbackDB.notifications.length + 1,
        user_id: Number(params[0]),
        text: params[1],
        is_read: false,
        created_at: new Date().toISOString(),
        type: params[2] || 'generic'
      };
      fallbackDB.notifications.push(newNotif);
      return { rows: [newNotif] };
    }

    // 19. SELECT * FROM community_news
    if (norm.includes('from community_news')) {
      return { rows: fallbackDB.community_news || [] };
    }

    // 20. SELECT * FROM community_posts
    if (norm.includes('from community_posts')) {
      return { rows: fallbackDB.community_posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
    }

    // 21. INSERT INTO community_posts
    if (norm.includes('insert into community_posts')) {
      const newPost = {
        id: fallbackDB.community_posts.length + 1,
        user_id: Number(params[0]),
        author_name: params[1],
        author_title: 'Iniciado',
        avatar: params[2],
        coven: params[3] || 'Eter',
        content: params[4],
        images: params[5] || '[]',
        likes: 0,
        comments: 0,
        date: new Date().toISOString(),
        tags: params[6] || '[]'
      };
      fallbackDB.community_posts.push(newPost);
      return { rows: [newPost] };
    }

    // 21.5 UPDATE community_posts SET likes = likes + 1
    if (norm.includes('update community_posts set likes = likes + 1')) {
      const postId = Number(params[0]);
      const post = fallbackDB.community_posts.find(p => Number(p.id) === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        return { rows: [{ likes: post.likes }] };
      }
      return { rows: [{ likes: 1 }] };
    }

    // 22. SELECT COUNT(*) FROM (any table) (Intercepted at the top of executeMockQuery)

    // 23. SELECT * FROM birth_charts WHERE user_id = $1
    if (norm.includes('from birth_charts where user_id =')) {
      const userId = Number(params[0]);
      const match = fallbackDB.birth_charts.find(bc => Number(bc.user_id) === userId);
      return { rows: match ? [match] : [] };
    }

    // 24. INSERT INTO birth_charts upsert
    if (norm.includes('insert into birth_charts')) {
      const userId = Number(params[0]);
      const fullName = params[1];
      const birthDate = params[2];
      const birthTime = params[3];
      const birthLocation = params[4];
      const chartData = typeof params[5] === 'string' ? JSON.parse(params[5]) : params[5];

      let bc = fallbackDB.birth_charts.find(x => Number(x.user_id) === userId);
      if (bc) {
        bc.full_name = fullName;
        bc.birth_date = birthDate;
        bc.birth_time = birthTime;
        bc.birth_location = birthLocation;
        bc.chart_data = chartData;
      } else {
        bc = {
          id: fallbackDB.birth_charts.length + 1,
          user_id: userId,
          full_name: fullName,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_location: birthLocation,
          chart_data: chartData,
          created_at: new Date().toISOString()
        };
        fallbackDB.birth_charts.push(bc);
      }
      return { rows: [bc] };
    }

    // 25. SELECT * FROM study_plans
    if (norm.includes('from study_plans where user_id =')) {
      const userId = Number(params[0]);
      const match = fallbackDB.study_plans.find(sp => Number(sp.user_id) === userId);
      return { rows: match ? [match] : [] };
    }

    // 26. INSERT INTO study_plans upsert
    if (norm.includes('insert into study_plans')) {
      const userId = Number(params[0]);
      const plan = typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
      let sp = fallbackDB.study_plans.find(x => Number(x.user_id) === userId);
      if (sp) {
        sp.plan = plan;
      } else {
        sp = { user_id: userId, plan };
        fallbackDB.study_plans.push(sp);
      }
      return { rows: [sp] };
    }

    // 27. SELECT * FROM post_comments WHERE post_id = $1
    if (norm.includes('from post_comments where post_id =')) {
      const postId = Number(params[0]);
      return { rows: fallbackDB.post_comments.filter(pc => Number(pc.post_id) === postId) };
    }

    // 28. INSERT INTO post_comments
    if (norm.includes('insert into post_comments')) {
      const newComment = {
        id: fallbackDB.post_comments.length + 1,
        post_id: Number(params[0]),
        user_id: Number(params[1]),
        author_name: params[2],
        avatar: params[3],
        content: params[4],
        date: new Date().toISOString()
      };
      fallbackDB.post_comments.push(newComment);
      const post = fallbackDB.community_posts.find(p => Number(p.id) === newComment.post_id);
      if (post) post.comments = (post.comments || 0) + 1;
      return { rows: [newComment] };
    }

    // 29. UPDATE settings (user_id, theme_preference, color_theme)
    if (norm.includes('insert into settings') || norm.includes('update settings')) {
      const userId = Number(params[0]);
      let setting = fallbackDB.settings.find(s => Number(s.user_id) === userId);
      if (!setting) {
        setting = { user_id: userId, theme_preference: 'auto', color_theme: 'oracle' };
        fallbackDB.settings.push(setting);
      }
      setting.theme_preference = params[1] || setting.theme_preference;
      setting.color_theme = params[2] || setting.color_theme;
      return { rows: [setting] };
    }

    // 30. SELECT * FROM course_node_contents WHERE node_id = $1
    if (norm.includes('from course_node_contents where node_id =')) {
      const nodeId = params[0];
      const match = fallbackDB.course_node_contents.find(cnc => cnc.node_id === nodeId);
      return { rows: match ? [match] : [] };
    }

    // 31. INSERT INTO course_node_contents
    if (norm.includes('insert into course_node_contents')) {
      // In seed.ts bulk query: VALUES ('fund-espirito', $1, $2), ('fund-magia', $1, $3), ('fund-altares', $1, $4)
      if (norm.includes('values (\'fund-espirito\',')) {
        const courseId = params[0];
        const l1 = params[1];
        const l2 = params[2];
        const l3 = params[3];
        
        const cnc1 = { id: 1, node_id: 'fund-espirito', course_id: courseId, markdown_content: l1 };
        const cnc2 = { id: 2, node_id: 'fund-magia', course_id: courseId, markdown_content: l2 };
        const cnc3 = { id: 3, node_id: 'fund-altares', course_id: courseId, markdown_content: l3 };
        
        fallbackDB.course_node_contents = fallbackDB.course_node_contents.filter(c => !['fund-espirito', 'fund-magia', 'fund-altares'].includes(c.node_id));
        fallbackDB.course_node_contents.push(cnc1, cnc2, cnc3);
        return { rows: [cnc1, cnc2, cnc3] };
      }
      
      const nodeId = params[0];
      const courseId = params[1];
      const markdownContent = params[2];
      
      let match = fallbackDB.course_node_contents.find(cnc => cnc.node_id === nodeId);
      if (match) {
        match.markdown_content = markdownContent;
        match.updated_at = new Date().toISOString();
      } else {
        match = {
          id: fallbackDB.course_node_contents.length + 1,
          node_id: nodeId,
          course_id: courseId,
          markdown_content: markdownContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        fallbackDB.course_node_contents.push(match);
      }
      return { rows: [match] };
    }

  } catch (err) {
    console.error("Mock query error:", err);
  }

  return { rows: [] };
}

const fallbackClient = {
  query: async (text: string, params?: any[]) => {
    return executeMockQuery(text, params);
  },
  release: () => {}
};

const originalConnect = pool.connect.bind(pool);
const originalQuery = pool.query.bind(pool);

pool.connect = async function() {
  if (useFallback) {
    return fallbackClient as any;
  }
  try {
    return await originalConnect();
  } catch (err: any) {
    console.warn("[PostgreSQL] Connection failed, switching to fallback DB:", err.message);
    // Explicitly toggle useFallback so future operations skip trying to connect
    (useFallback as any) = true;
    return fallbackClient as any;
  }
};

pool.query = async function(text: any, params?: any) {
  if (useFallback) {
    return executeMockQuery(text, params) as any;
  }
  try {
    return await originalQuery(text, params);
  } catch (err: any) {
    console.warn("[PostgreSQL] Query failed, falling back to in-memory DB:", err.message);
    (useFallback as any) = true;
    return executeMockQuery(text, params) as any;
  }
};

// Helper for query execution
export const query = (text: string, params?: any[]) => pool.query(text, params);
