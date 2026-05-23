import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import pg from "pg";

const { Pool } = pg;

// Set up PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/oracle_platform",
});

let useFallback = false;

// We will define our in-memory data structures for a seamless local-only fallback
const fallbackDB: {
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
} = {
  users: [
    { id: 1, email: 'admin@admin.com', password: 'admin', is_paid: true }
  ],
  profiles: [
    {
      id: 1,
      user_id: 1,
      name: 'Buscador Celestial',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
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
      author_title: 'Sacerdote',
      grau: 'Grau II - Hermetista',
      location: 'Santuário Sagrado'
    }
  ],
  grimoire_entries: [],
  settings: [
    { user_id: 1, theme_preference: 'auto', color_theme: 'oracle' }
  ],
  challenges: [
    { user_id: 1, completed_quiz: false, flashcard_count: 5, flashcard_completed: false, completed_journal: false }
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
      user_id: 1,
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
      user_id: 1,
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
    { id: 3, user_id: 1, text: 'Seu Altar Diário foi renovado com novas missões de leitura e transmutação mental.', is_read: false, created_at: new Date().toISOString(), type: 'challenge' }
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
    { id: 3, user_id: 1, name: 'Centelha Divina', description: 'Atingiu 500 XP de energia cósmica.', category: 'Evolução' }
  ],
  transactions: [
    { id: 1, user_id: 1, type: 'venda', amount: 50.00, title: 'Leitura de Cartas Especiais', status: 'concluído', date: new Date().toISOString() },
    { id: 2, user_id: 1, type: 'compra', amount: 35.00, title: 'Incenso de Sândalo Astral', status: 'concluído', date: new Date().toISOString() }
  ]
};

function executeMockQuery(sql: string, params: any[] = []): { rows: any[] } {
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
    // 1. SELECT * FROM users WHERE email = $1
    if (norm.includes('from users where email =')) {
      const email = params[0];
      const match = fallbackDB.users.find(u => u.email === email);
      return { rows: match ? [match] : [] };
    }
    
    // 2. INSERT INTO users (email, password, is_paid) VALUES ($1, $2, $3) RETURNING *
    if (norm.includes('insert into users')) {
      const newUser = {
        id: fallbackDB.users.length + 1,
        email: params[0],
        password: params[1],
        is_paid: params[2] || false
      };
      fallbackDB.users.push(newUser);
      return { rows: [newUser] };
    }

    // 2.3 INSERT INTO profiles
    if (norm.includes('insert into profiles')) {
      const newProfile = {
        id: fallbackDB.profiles.length + 1,
        user_id: Number(params[0]),
        name: params[1],
        avatar: params[2],
        xp: Number(params[3] || 100),
        nickname: params[4] || '',
        phone: params[5] || '',
        zip_code: params[6] || '',
        address: params[7] || '',
        description: params[8] || '',
        portfolio: params[9] || '',
        website: params[10] || '',
        whatsapp: params[11] || '',
        telegram: params[12] || '',
        facebook: params[13] || '',
        instagram: params[14] || '',
        x_twitter: params[15] || '',
        other_net: params[16] || '',
        show_phone: !!params[17],
        show_address: !!params[18],
        author_title: params[19] || 'Busca-Caminhos',
        grau: params[20] || 'Grau I - Iniciado',
        location: params[21] || 'Santuário Sagrado'
      };
      fallbackDB.profiles = fallbackDB.profiles.filter(p => Number(p.user_id) !== newProfile.user_id);
      fallbackDB.profiles.push(newProfile);
      return { rows: [enrichWithCamelCase(newProfile)] };
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
          author_title: 'Iniciado',
          grau: 'Grau I - Iniciado',
          location: 'Santuário Sagrado'
        };
        fallbackDB.profiles.push(profile);
      }
      return { rows: [enrichWithCamelCase(profile)] };
    }

    // 4. UPDATE profiles SET ... WHERE user_id = $1
    if (norm.includes('update profiles set')) {
      const userId = Number(params[params.length - 1]);
      const profile = fallbackDB.profiles.find(p => Number(p.user_id) === userId);
      if (profile) {
         if (params.length >= 20) {
           profile.name = params[0];
           profile.avatar = params[1];
           profile.nickname = params[2];
           profile.phone = params[3];
           profile.zip_code = params[4];
           profile.address = params[5];
           profile.description = params[6];
           profile.portfolio = params[7];
           profile.website = params[8];
           profile.whatsapp = params[9];
           profile.telegram = params[10];
           profile.facebook = params[11];
           profile.instagram = params[12];
           profile.x_twitter = params[13];
           profile.other_net = params[14];
           profile.show_phone = !!params[15];
           profile.show_address = !!params[16];
           profile.author_title = params[17];
           profile.grau = params[18];
           profile.location = params[19];
         } else if (norm.includes('xp = xp +')) {
           profile.xp = (profile.xp || 100) + Number(params[0]);
         }
         return { rows: [profile] };
      }
      return { rows: [] };
    }

    // 5. SELECT * FROM grimoire_entries WHERE user_id = $1 ORDER BY date DESC
    if (norm.includes('from grimoire_entries')) {
      if (norm.includes('where user_id =')) {
        const userId = Number(params[0]);
        const matches = fallbackDB.grimoire_entries.filter(g => Number(g.user_id) === userId)
           .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
           .map(g => ({
             ...g,
             spreadType: g.spread_type || g.spreadType,
             attachments: g.attachments || []
           }));
        return { rows: matches };
      }
      return { rows: fallbackDB.grimoire_entries };
    }

    // 6. INSERT INTO grimoire_entries
    if (norm.includes('insert into grimoire_entries')) {
      const dateVal = params[1] || new Date().toISOString();
      const questionVal = params[2] || params[1] || "";
      const spreadTypeVal = params[3] || params[2] || "Anotação";
      const cardsVal = params[4] || params[3] || [];
      const interpretationVal = params[5] || params[4] || "";
      const attachmentsVal = params[6] || [];

      const newEntry = {
        id: fallbackDB.grimoire_entries.length + 1,
        user_id: Number(params[0]),
        date: dateVal,
        question: questionVal,
        spread_type: spreadTypeVal,
        spreadType: spreadTypeVal,
        cards: typeof cardsVal === 'string' ? JSON.parse(cardsVal) : cardsVal,
        interpretation: interpretationVal,
        attachments: typeof attachmentsVal === 'string' ? JSON.parse(attachmentsVal) : attachmentsVal
      };
      fallbackDB.grimoire_entries.push(newEntry);
      return { rows: [newEntry] };
    }

    // 6.5. UPDATE grimoire_entries
    if (norm.includes('update grimoire_entries')) {
      const questionVal = params[0];
      const spreadTypeVal = params[1];
      const cardsVal = params[2];
      const interpretationVal = params[3];
      const attachmentsVal = params[4];
      const idVal = Number(params[5]);
      const userIdVal = Number(params[6]);

      const entry = fallbackDB.grimoire_entries.find(g => Number(g.id) === idVal && Number(g.user_id) === userIdVal);
      if (entry) {
        entry.question = questionVal;
        entry.spread_type = spreadTypeVal;
        entry.spreadType = spreadTypeVal;
        entry.cards = typeof cardsVal === 'string' ? JSON.parse(cardsVal) : cardsVal;
        entry.interpretation = interpretationVal;
        entry.attachments = typeof attachmentsVal === 'string' ? JSON.parse(attachmentsVal) : attachmentsVal;
        return { rows: [entry] };
      }
      return { rows: [] };
    }

    // 6.6. DELETE FROM grimoire_entries
    if (norm.includes('delete from grimoire_entries')) {
      const idVal = Number(params[0]);
      const userIdVal = Number(params[1]);
      fallbackDB.grimoire_entries = fallbackDB.grimoire_entries.filter(g => !(Number(g.id) === idVal && Number(g.user_id) === userIdVal));
      return { rows: [{ success: true }] };
    }

    // 7. SELECT * FROM settings WHERE user_id = $1
    if (norm.includes('from settings where user_id =')) {
      const userId = Number(params[0]);
      let setting = fallbackDB.settings.find(s => Number(s.user_id) === userId);
      if (!setting) {
        setting = { user_id: userId, theme_preference: 'auto', color_theme: 'oracle' };
        fallbackDB.settings.push(setting);
      }
      return { rows: [setting] };
    }

    // 8. INSERT INTO settings (user_id, theme_preference, color_theme) ...
    if (norm.includes('insert into settings') || norm.includes('update settings')) {
      const userId = Number(params[0]);
      let setting = fallbackDB.settings.find(s => Number(s.user_id) === userId);
      if (!setting) {
        setting = { user_id: userId, theme_preference: 'auto', color_theme: 'oracle' };
        fallbackDB.settings.push(setting);
      }
      setting.theme_preference = params[1];
      setting.color_theme = params[2];
      return { rows: [setting] };
    }

    // 8.5 INSERT INTO challenges
    if (norm.includes('insert into challenges')) {
      const userId = Number(params[0]);
      let challenge = fallbackDB.challenges.find(c => Number(c.user_id) === userId);
      if (!challenge) {
        challenge = {
          user_id: userId,
          completed_quiz: !!params[1],
          flashcard_count: Number(params[2] || 0),
          flashcard_completed: !!params[3],
          completed_journal: !!params[4]
        };
        fallbackDB.challenges.push(challenge);
      } else {
        challenge.completed_quiz = !!params[1];
        challenge.flashcard_count = Number(params[2] || 0);
        challenge.flashcard_completed = !!params[3];
        challenge.completed_journal = !!params[4];
      }
      return { rows: [challenge] };
    }

    // 9. SELECT * FROM challenges WHERE user_id = $1
    if (norm.includes('from challenges where user_id =')) {
      const userId = Number(params[0]);
      let challenge = fallbackDB.challenges.find(c => Number(c.user_id) === userId);
      if (!challenge) {
        challenge = { user_id: userId, completed_quiz: false, flashcard_count: 5, flashcard_completed: false, completed_journal: false };
        fallbackDB.challenges.push(challenge);
      }
      return { rows: [challenge] };
    }

    // 10. UPDATE challenges SET ...
    if (norm.includes('update challenges set')) {
      const userId = Number(params[params.length - 1]);
      const challenge = fallbackDB.challenges.find(c => Number(c.user_id) === userId);
      if (challenge) {
        if (norm.includes('completed_quiz = $1')) {
          challenge.completed_quiz = !!params[0];
        } else if (norm.includes('flashcard_count = $1, flashcard_completed = $2')) {
          challenge.flashcard_count = Number(params[0]);
          challenge.flashcard_completed = !!params[1];
        } else if (norm.includes('completed_journal = $1')) {
          challenge.completed_journal = !!params[0];
        }
        return { rows: [challenge] };
      }
      return { rows: [] };
    }

    // Intercept community_news queries
    if (norm.includes('from community_news')) {
      return { rows: fallbackDB.community_news || [] };
    }
    if (norm.includes('insert into community_news')) {
      const newNews = {
        id: fallbackDB.community_news.length + 1,
        title: params[0],
        summary: params[1],
        content: params[2],
        date: params[3] || 'Hoje',
        read_time: params[4] || '5 min',
        image: params[5] || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400'
      };
      fallbackDB.community_news.push(newNews);
      return { rows: [newNews] };
    }

    // 11. SELECT * FROM community_posts
    if (norm.includes('from community_posts')) {
      // If finding a unique post: select user_id, content from community_posts where id = $1
      if (norm.includes('where id =')) {
        const postId = Number(params[0]);
        const post = fallbackDB.community_posts.find(p => Number(p.id) === postId);
        return { rows: post ? [post] : [] };
      }
      const matches = [...fallbackDB.community_posts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return { rows: matches };
    }

    // 12. INSERT INTO community_posts
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

    // 13. UPDATE community_posts SET likes = likes + 1 WHERE id = $1 RETURNING likes
    if (norm.includes('update community_posts set likes = likes + 1')) {
      const postId = Number(params[0]);
      const post = fallbackDB.community_posts.find(p => Number(p.id) === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        return { rows: [post] };
      }
      return { rows: [] };
    }

    // 14. SELECT * FROM marketplace_items
    if (norm.includes('from marketplace_items')) {
      if (norm.includes('where user_id =')) {
        const userId = Number(params[0]);
        const matches = fallbackDB.marketplace_items.filter(m => Number(m.user_id) === userId)
           .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { rows: matches };
      }
      const matches = [...fallbackDB.marketplace_items].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return { rows: matches };
    }

    // 15. INSERT INTO marketplace_items
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
        hashtags: params[8] || '[]',
        file_url: params[9] || '',
        date: new Date().toISOString()
      };
      fallbackDB.marketplace_items.push(newItem);
      return { rows: [newItem] };
    }

    // 16. SELECT * FROM notifications WHERE user_id = $1
    if (norm.includes('from notifications where user_id =')) {
      const userId = Number(params[0]);
      const matches = fallbackDB.notifications.filter(n => Number(n.user_id) === userId)
         .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { rows: matches };
    }

    // 17. UPDATE notifications SET is_read = TRUE WHERE user_id = $1
    if (norm.includes('update notifications set is_read = true') || norm.includes('is_read = true')) {
      const userId = Number(params[0]);
      fallbackDB.notifications.forEach(n => {
        if (Number(n.user_id) === userId) {
          n.is_read = true;
        }
      });
      return { rows: [] };
    }

    // 18. INSERT INTO notifications (user_id, text, type)
    if (norm.includes('insert into notifications')) {
      if (params.length === 1) {
        const userId = Number(params[0]);
        const notifs = [
          { id: fallbackDB.notifications.length + 1, user_id: userId, text: 'Alguém curtiu sua postagem de estudos na Comunidade de Estudantes!', is_read: false, created_at: new Date().toISOString(), type: 'like' },
          { id: fallbackDB.notifications.length + 2, user_id: userId, text: 'Parabéns! Seu novo certificado de "Fundamentos de Ocultismo Prático" foi emitido com sucesso pela Oracle Academy.', is_read: false, created_at: new Date().toISOString(), type: 'certificate' },
          { id: fallbackDB.notifications.length + 3, user_id: userId, text: 'Seu Altar Diário foi renovado com novas missões de leitura e transmutação mental.', is_read: false, created_at: new Date().toISOString(), type: 'challenge' }
        ];
        fallbackDB.notifications.push(...notifs);
        return { rows: notifs };
      } else {
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
    }

    // 19. SELECT COUNT(*) FROM (any table)
    if (norm.includes('select count(*) from')) {
      let count = 0;
      if (norm.includes('community_posts')) count = fallbackDB.community_posts.length;
      else if (norm.includes('marketplace_items')) count = fallbackDB.marketplace_items.length;
      else if (norm.includes('users')) count = fallbackDB.users.length;
      return { rows: [{ count: count.toString() }] };
    }

    // 20. SELECT * FROM profiles ORDER BY xp DESC
    if (norm.includes('from profiles order by xp desc')) {
      const sorted = [...fallbackDB.profiles].sort((a,b) => (b.xp || 0) - (a.xp || 0));
      return { rows: sorted.map(enrichWithCamelCase) };
    }

    // 21. SELECT * FROM birth_charts WHERE user_id = $1
    if (norm.includes('from birth_charts where user_id =')) {
      const userId = Number(params[0]);
      const match = fallbackDB.birth_charts.find(bc => Number(bc.user_id) === userId);
      return { rows: match ? [match] : [] };
    }

    // 22. INSERT INTO birth_charts upsert
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

    // 23. SELECT * FROM study_plans WHERE user_id = $1
    if (norm.includes('from study_plans where user_id =')) {
      const userId = Number(params[0]);
      const match = fallbackDB.study_plans.find(sp => Number(sp.user_id) === userId);
      return { rows: match ? [match] : [] };
    }

    // 24. INSERT INTO study_plans upsert
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

    // 25. SELECT * FROM post_comments WHERE post_id = $1
    if (norm.includes('from post_comments where post_id =')) {
      const postId = Number(params[0]);
      const matches = fallbackDB.post_comments.filter(pc => Number(pc.post_id) === postId)
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return { rows: matches };
    }

    // 26. INSERT INTO post_comments
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
      if (post) {
        post.comments = (post.comments || 0) + 1;
      }
      return { rows: [newComment] };
    }

    // 27. DELETE FROM community_posts WHERE id = $1
    if (norm.includes('delete from community_posts where') || norm.includes('delete from community_posts ')) {
      const postId = Number(params[0]);
      fallbackDB.community_posts = fallbackDB.community_posts.filter(p => Number(p.id) !== postId);
      fallbackDB.post_comments = fallbackDB.post_comments.filter(c => Number(c.post_id) !== postId);
      return { rows: [{ success: true }] };
    }

    // 28. DELETE FROM post_comments WHERE id = $1
    if (norm.includes('delete from post_comments where') || norm.includes('delete from post_comments ')) {
      const commentId = Number(params[0]);
      const comment = fallbackDB.post_comments.find(c => Number(c.id) === commentId);
      if (comment) {
        fallbackDB.post_comments = fallbackDB.post_comments.filter(c => Number(c.id) !== commentId);
        const post = fallbackDB.community_posts.find(p => Number(p.id) === Number(comment.post_id));
        if (post) {
          post.comments = Math.max(0, (post.comments || 1) - 1);
        }
      }
      return { rows: [{ success: true }] };
    }

  } catch (err) {
    console.error("Critical mock query error parsing context:", err);
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
    console.warn("[PostgreSQL] Connection failed, switching gracefully to in-memory fallback DB:", err.message);
    useFallback = true;
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
    useFallback = true;
    return executeMockQuery(text, params) as any;
  }
};

// Helper for query execution
const query = (text: string, params?: any[]) => pool.query(text, params);

async function initDB() {
  const client = await pool.connect();
  try {
    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_paid BOOLEAN DEFAULT FALSE
      );
    `);

    // 2. Profiles table (separated & enriched with columns check)
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        avatar TEXT,
        xp INT DEFAULT 100
      );
    `);

    // Ensure all extended profile columns exist dynamically
    const columns = [
      { name: 'nickname', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'zip_code', type: 'TEXT' },
      { name: 'address', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
      { name: 'portfolio', type: 'TEXT' },
      { name: 'website', type: 'TEXT' },
      { name: 'whatsapp', type: 'TEXT' },
      { name: 'telegram', type: 'TEXT' },
      { name: 'facebook', type: 'TEXT' },
      { name: 'instagram', type: 'TEXT' },
      { name: 'x_twitter', type: 'TEXT' },
      { name: 'other_net', type: 'TEXT' },
      { name: 'show_phone', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'show_address', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'author_title', type: "TEXT DEFAULT 'Busca-Caminhos'" },
      { name: 'grau', type: "TEXT DEFAULT 'Grau I - Iniciado'" },
      { name: 'location', type: "TEXT DEFAULT 'Santuário Sagrado'" }
    ];

    for (const col of columns) {
      await client.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
    }

    // 3. Grimoire entries table (separated)
    await client.query(`
      CREATE TABLE IF NOT EXISTS grimoire_entries (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMPTZ DEFAULT NOW(),
        question TEXT NOT NULL,
        spread_type TEXT NOT NULL,
        cards JSONB NOT NULL,
        interpretation TEXT NOT NULL
      );
    `);
    
    // Ensure attachments column exists on existing installations of grimoire_entries
    await client.query(`ALTER TABLE grimoire_entries ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';`);

    // 4. Settings table (separated)
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        theme_preference TEXT DEFAULT 'auto',
        color_theme TEXT DEFAULT 'oracle'
      );
    `);

    // 5. Challenges table (separated)
    await client.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        completed_quiz BOOLEAN DEFAULT FALSE,
        flashcard_count INT DEFAULT 0,
        flashcard_completed BOOLEAN DEFAULT FALSE,
        completed_journal BOOLEAN DEFAULT FALSE
      );
    `);

    // 6. Community posts table
    await client.query(`
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
        tags TEXT DEFAULT '[]'
      );
    `);

    // 7. Marketplace items table
    await client.query(`
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
        date TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        type TEXT NOT NULL
      );
    `);

    await client.query(`
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
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS study_plans (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        plan JSONB NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        avatar TEXT,
        content TEXT NOT NULL,
        date TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("[PostgreSQL] All database tables successfully initialized and separated!");

    // Seed default users if they don't exist
    const adminCheck = await client.query("SELECT * FROM users WHERE email = 'admin@admin.com'");
    let adminUserId = null;
    if (adminCheck.rows.length === 0) {
      const res = await client.query(
        "INSERT INTO users (email, password, is_paid) VALUES ('admin@admin.com', '123456', true) RETURNING id"
      );
      adminUserId = res.rows[0].id;
      await client.query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, description, author_title, grau, location
        ) VALUES ($1, 'Admin Master', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', 5000, 
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
    } else {
      adminUserId = adminCheck.rows[0].id;
    }

    const userCheck = await client.query("SELECT * FROM users WHERE email = 'user@user.com'");
    if (userCheck.rows.length === 0) {
      const res = await client.query(
        "INSERT INTO users (email, password, is_paid) VALUES ('user@user.com', '123456', false) RETURNING id"
      );
      const userId = res.rows[0].id;
      await client.query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, description, author_title, grau, location
        ) VALUES ($1, 'Usuário Comum', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', 120, 
        'comum', 'Buscador de verdades e mistérios celestiais.', 'Busca-Caminhos', 'Grau I - Iniciado', 'Estrela de Entrada')`,
        [userId]
      );
      await client.query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [userId]
      );
      await client.query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [userId]
      );
    }

    // Seed initial community posts if table is empty
    const postsCount = await client.query("SELECT COUNT(*) FROM community_posts");
    if (parseInt(postsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO community_posts (user_id, author_name, author_title, avatar, coven, content, images, likes, comments, tags)
        VALUES 
        ($1, 'Elias Thorne', 'Mestre Ascenso', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Astrologia Kármica', 'Tentei combinar o significado de Fehu com os trânsitos de Vênus para uma leitura financeira. Os resultados foram impressionantes! A chave está em focar na expansão e não na falta.', '["https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]', 243, 42, '["Astrologia", "Prosperidade"]'),
        ($1, 'Serena Moon', 'Sacerdotisa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Magia Natural & Ervas', 'Hoje o rito será sobre Intuição e Clareza. Acendam uma vela de lavanda e segurem sua pedra da lua. A vibração está propícia para revelações oníricas.', '[]', 89, 12, '["Ritual", "Lua"]'),
        ($1, 'Marcus Vane', 'Hermetista', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', 'Ocultismo Prático', 'A geometria sagrada não é apenas estética; é a planta baixa da realidade. Estudem o Cubo de Metatron e como ele governa a estrutura atômica.', '[]', 56, 8, '["Geometria", "Teoria"]')
      `, [adminUserId]);
    }

    // Seed initial marketplace items if table is empty
    const marketplaceCount = await client.query("SELECT COUNT(*) FROM marketplace_items");
    if (parseInt(marketplaceCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO marketplace_items (user_id, author_name, title, subtitle, description, price, category, cover_image, hashtags, file_url)
        VALUES
        ($1, 'Aria Nova', 'Arcanos Maiores', 'Uma Jornada pelo Inconsciente', 'Explore o caminho do Louco através dos 22 Arcanos Maiores, um guia passo a passo para entender profundamente seu próprio ser.', 0.00, 'Tomos', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400', '["Tarot", "Arcanos", "Espiritualidade"]', ''),
        ($1, 'Mestre C.', 'Lenormand Essencial', 'Prática na Mesa Real', 'Um tomo digital focado na prática diária do Baralho Cigano (Lenormand). Aprenda a interpretar combinações complexas.', 49.90, 'Tomos', 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=400', '["Lenormand", "MesaReal", "Cartomancia"]', ''),
        ($1, 'Lúcia R.', 'A Intuição do Oráculo', 'Aterramento e Proteção', 'Práticas para conectar sua intuição antes de qualquer leitura. Essencial para manter o canal limpo.', 25.00, 'Tomos', 'https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=400', '["Intuição", "Proteção", "Mediumnidade"]', ''),
        ($1, 'Eliphas Sol', 'Kabbalah e Tarot', 'Os Caminhos da Árvore', 'A profunda conexão entre a Kabbalah Hermética e o Tarot. Recomendado apenas para estudantes avançados.', 89.90, 'Tomos', 'https://images.unsplash.com/photo-1532054950961-002ab40dd324?auto=format&fit=crop&q=80&w=400', '["Kabbalah", "Tarot", "AltaMagia"]', ''),
        ($1, 'Aria Nova', 'Astrologia Kármica', 'O Nó Lunar', 'Entenda como os nós lunares ditam os aprendizados passados e os objetivos de vida futuros na astrologia.', 0.00, 'Tomos', 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=400', '["Astrologia", "Karma", "MapAstral"]', ''),
        ($1, 'Elias Thorne', 'Consulta de Mapa Astral', 'Análise Profunda e Trânsitos', 'Consulte os trânsitos de Vênus, Marte e Júpiter na sua casa astrológica com análise kármica personalizada.', 320.00, 'Consultas', 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=400', '["Astrologia", "Consulta", "Karma"]', ''),
        ($1, 'Serena Moon', 'Amuleto Consagrado', 'Proteção Lunar das Ervas', 'Brinde e pedra mística consagrada na Lua Cheia de Virgem, acompanhado de saquinho de camomila e lavanda.', 45.00, 'Brindes', 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=400', '["Amuleto", "Ervas", "Brinde"]', '')
      `, [adminUserId]);
    }

  } catch (err) {
    console.error("[PostgreSQL] Initialization error:", err);
  } finally {
    client.release();
  }
}

function validateMercadoPagoCredentials() {
  console.log("=== \x1b[36mMercado Pago Setup Guide\x1b[0m ===");
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token || token.includes('TEST-1234567890')) {
    console.log("[\x1b[33mAVISO\x1b[0m] Credenciais de sandbox não foram injetadas!");
    console.log("        -> Para validar pagamentos reais, siga os passos:");
    console.log("           1. Acesse o painel de desenvolvedores do Mercado Pago.");
    console.log("           2. Gere suas chaves de Sandbox (Access Token).");
    console.log("           3. Crie ou adicione 'MERCADO_PAGO_ACCESS_TOKEN' no arquivo .env (Secrects).");
    console.log("           4. Configure o Webhook IPN na URL: https://<seu-app>/api/payments/webhook com eventos 'payment'.");
  } else {
    console.log("[\x1b[32mOK\x1b[0m] Token do Mercado Pago detectado no ambiente.");
  }
  console.log("=====================================");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  validateMercadoPagoCredentials();

  // Initialize database schema
  await initDB();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Initialize the Gemini SDK client safely on the server side
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback mock content.");
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // --- AUTHENTICATION ENDPOINTS ---

  // POST: Register a new user with ENRICHED details
  app.post("/api/auth/register", async (req, res) => {
    const { 
      email, password, name, isPaid,
      nickname, phone, zipCode, address, description,
      portfolio, website, whatsapp, telegram, facebook,
      instagram, x_twitter, otherNet, showPhone, showAddress,
      avatar, authorTitle, grau, location
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "E-mail, senha e nome são obrigatórios" });
    }

    try {
      const checkExist = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (checkExist.rows.length > 0) {
        return res.status(400).json({ error: "E-mail já está em uso por outro buscador" });
      }

      const userRes = await query(
        "INSERT INTO users (email, password, is_paid) VALUES ($1, $2, $3) RETURNING id, email, is_paid",
        [email, password, !isPaid ? false : true]
      );
      const userId = userRes.rows[0].id;

      const defaultAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';
      
      // Create defaults for separate tables
      await query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, phone, zip_code, address, description, 
          portfolio, website, whatsapp, telegram, facebook, 
          instagram, x_twitter, other_net, show_phone, show_address,
          author_title, grau, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
        [
          userId, name, defaultAvatar, 100,
          nickname || '', phone || '', zipCode || '', address || '', description || '',
          portfolio || '', website || '', whatsapp || '', telegram || '', facebook || '',
          instagram || '', x_twitter || '', otherNet || '', !!showPhone, !!showAddress,
          authorTitle || 'Busca-Caminhos', grau || 'Grau I - Iniciado', location || 'Santuário Sagrado'
        ]
      );

      await query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [userId]
      );
      await query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [userId]
      );

      return res.json({
        id: userId,
        email: userRes.rows[0].email,
        isPaid: true,
        name: name,
        xp: 100,
        avatar: defaultAvatar,
        nickname: nickname || '',
        phone: phone || '',
        zipCode: zipCode || '',
        address: address || '',
        description: description || '',
        portfolio: portfolio || '',
        website: website || '',
        whatsapp: whatsapp || '',
        telegram: telegram || '',
        facebook: facebook || '',
        instagram: instagram || '',
        x_twitter: x_twitter || '',
        otherNet: otherNet || '',
        showPhone: !!showPhone,
        showAddress: !!showAddress,
        authorTitle: authorTitle || 'Busca-Caminhos',
        grau: grau || 'Grau I - Iniciado',
        location: location || 'Santuário Sagrado'
      });
    } catch (err: any) {
      console.error("Register Error:", err);
      return res.status(500).json({ error: "Erro ao registrar usuário nas estrelas" });
    }
  });

  // POST: Login user (Enriched profile fields)
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são requeridos" });
    }

    try {
      const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (userRes.rows.length === 0) {
        return res.status(401).json({ error: "E-mail não encontrado na constelação" });
      }

      const user = userRes.rows[0];
      if (user.password !== password) {
        return res.status(401).json({ error: "Chave mística (senha) incorreta" });
      }

      // Fetch ALL profile info columns to return combined login
      const profileRes = await query(`
        SELECT 
          name, avatar, xp, nickname, phone, zip_code AS "zipCode", address, description, 
          portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter, 
          other_net AS "otherNet", show_phone AS "showPhone", show_address AS "showAddress",
          author_title AS "authorTitle", grau, location
        FROM profiles 
        WHERE user_id = $1
      `, [user.id]);
      
      const profile = profileRes.rows[0] || {};

      return res.json({
        id: user.id,
        email: user.email,
        isPaid: true,
        name: profile.name || 'Buscador Solitário',
        xp: profile.xp || 100,
        avatar: profile.avatar || '',
        nickname: profile.nickname || '',
        phone: profile.phone || '',
        zipCode: profile.zipCode || '',
        address: profile.address || '',
        description: profile.description || '',
        portfolio: profile.portfolio || '',
        website: profile.website || '',
        whatsapp: profile.whatsapp || '',
        telegram: profile.telegram || '',
        facebook: profile.facebook || '',
        instagram: profile.instagram || '',
        x_twitter: profile.x_twitter || '',
        otherNet: profile.otherNet || '',
        showPhone: !!profile.showPhone,
        showAddress: !!profile.showAddress,
        authorTitle: profile.authorTitle || 'Busca-Caminhos',
        grau: profile.grau || 'Grau I - Iniciado',
        location: profile.location || 'Santuário Sagrado'
      });
    } catch (err: any) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "Erro ao consultar as runas de login" });
    }
  });

  // POST: Firebase Authentication Synchronizer (Google, Phone & Email providers)
  app.post("/api/auth/firebase-sync", async (req, res) => {
    const { email, name, phone, password } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ error: "E-mail ou Telefone obrigatório para sincronização." });
    }

    try {
      let userId: any = null;
      let userObj: any = null;

      // Find user by email or phone
      if (email) {
        const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);
        if (userRes.rows.length > 0) {
          userObj = userRes.rows[0];
          userId = userObj.id;
        }
      } else if (phone) {
        // Find user by phone in profile
        const profileRes = await query("SELECT user_id FROM profiles WHERE phone = $1", [phone]);
        if (profileRes.rows.length > 0) {
          userId = profileRes.rows[0].user_id;
          const userRes = await query("SELECT * FROM users WHERE id = $1", [userId]);
          if (userRes.rows.length > 0) {
            userObj = userRes.rows[0];
          }
        }
      }

      // If user exists, load full profile and return
      if (userObj) {
        const profileRes = await query(`
          SELECT 
            name, avatar, xp, nickname, phone, zip_code AS "zipCode", address, description, 
            portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter, 
            other_net AS "otherNet", show_phone AS "showPhone", show_address AS "showAddress",
            author_title AS "authorTitle", grau, location
          FROM profiles 
          WHERE user_id = $1
        `, [userId]);
        
        const profileObj = profileRes.rows[0] || {};
        return res.json({
          id: userObj.id,
          email: userObj.email,
          isPaid: true,
          name: profileObj.name || name || 'Buscador Solitário',
          xp: profileObj.xp || 100,
          avatar: profileObj.avatar || '',
          nickname: profileObj.nickname || '',
          phone: profileObj.phone || phone || '',
          zipCode: profileObj.zipCode || '',
          address: profileObj.address || '',
          description: profileObj.description || '',
          portfolio: profileObj.portfolio || '',
          website: profileObj.website || '',
          whatsapp: profileObj.whatsapp || '',
          telegram: profileObj.telegram || '',
          facebook: profileObj.facebook || '',
          instagram: profileObj.instagram || '',
          x_twitter: profileObj.x_twitter || '',
          otherNet: profileObj.otherNet || '',
          showPhone: !!profileObj.showPhone,
          showAddress: !!profileObj.showAddress,
          authorTitle: profileObj.authorTitle || 'Busca-Caminhos',
          grau: profileObj.grau || 'Grau I - Iniciado',
          location: profileObj.location || 'Santuário Sagrado'
        });
      }

      // If user doesn't exist, create / register them on the fly!
      const targetEmail = email || `phone_${phone.replace(/\D/g, '')}@oracle.academy`;
      const targetName = name || (phone ? `Buscador ${phone}` : 'Novo Buscador');
      const targetPassword = password || 'firebase_federated_pass_placeholder_3812';

      const userRes = await query(
        "INSERT INTO users (email, password, is_paid) VALUES ($1, $2, $3) RETURNING id, email, is_paid",
        [targetEmail, targetPassword, false]
      );
      userId = userRes.rows[0].id;

      const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';
      
      await query(
        `INSERT INTO profiles (
          user_id, name, avatar, xp, 
          nickname, phone, zip_code, address, description, 
          portfolio, website, whatsapp, telegram, facebook, 
          instagram, x_twitter, other_net, show_phone, show_address,
          author_title, grau, location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`,
        [
          userId, targetName, defaultAvatar, 100,
          '', phone || '', '', '', 'Buscador em sincronia com o éter cósmico.',
          '', '', phone || '', '', '',
          '', '', '', true, false,
          'Busca-Caminhos', 'Grau I - Iniciado', 'Santuário Sagrado'
        ]
      );

      await query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, 'dark', 'oracle')",
        [userId]
      );
      await query(
        "INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) VALUES ($1, false, 0, false, false)",
        [userId]
      );

      return res.json({
        id: userId,
        email: targetEmail,
        isPaid: true,
        name: targetName,
        xp: 100,
        avatar: defaultAvatar,
        nickname: '',
        phone: phone || '',
        zipCode: '',
        address: '',
        description: 'Buscador em sincronia com o éter cósmico.',
        portfolio: '',
        website: '',
        whatsapp: phone || '',
        telegram: '',
        facebook: '',
        instagram: '',
        x_twitter: '',
        otherNet: '',
        showPhone: true,
        showAddress: false,
        authorTitle: 'Busca-Caminhos',
        grau: 'Grau I - Iniciado',
        location: 'Santuário Sagrado'
      });

    } catch (err: any) {
      console.error("Firebase Sync Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar credencial celestial externa" });
    }
  });

  // GET: Sync all dynamic state from separate tables at startup/login (Enriched profile fields)
  app.get("/api/user/sync", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      // 1. Get detailed profile
      const profile = (await query(`
        SELECT 
          name, avatar, xp, nickname, phone, zip_code AS "zipCode", address, description, 
          portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter, 
          other_net AS "otherNet", show_phone AS "showPhone", show_address AS "showAddress",
          author_title AS "authorTitle", grau, location
        FROM profiles 
        WHERE user_id = $1
      `, [userId])).rows[0];

      // 2. Get settings
      const settings = (await query("SELECT theme_preference, color_theme FROM settings WHERE user_id = $1", [userId])).rows[0];
      // 3. Get challenges
      const challenges = (await query("SELECT completed_quiz, flashcard_count, flashcard_completed, completed_journal FROM challenges WHERE user_id = $1", [userId])).rows[0];
      // 4. Get grimoire entries
      const grimoireEntries = (await query("SELECT id, date, question, spread_type as \"spreadType\", cards, interpretation FROM grimoire_entries WHERE user_id = $1 ORDER BY date DESC", [userId])).rows;

      // 5. Get saved birth chart
      const birthChartRes = await query(`
        SELECT full_name AS "fullName", birth_date AS "birthDate", birth_time AS "birthTime", birth_location AS "birthLocation", chart_data AS "chartData"
        FROM birth_charts
        WHERE user_id = $1
      `, [userId]);
      const savedBirthChart = birthChartRes.rows[0] || null;

      return res.json({
        profile: profile || { name: 'Recluso', avatar: '', xp: 100 },
        settings: settings ? { themePreference: settings.theme_preference, colorTheme: settings.color_theme } : { themePreference: 'dark', colorTheme: 'oracle' },
        challenges: challenges ? {
          completedQuiz: challenges.completed_quiz,
          flashcardCount: challenges.flashcard_count,
          flashcardCompleted: challenges.flashcard_completed,
          completedJournal: challenges.completed_journal
        } : { completedQuiz: false, flashcardCount: 0, flashcardCompleted: false, completedJournal: false },
        grimoireEntries: grimoireEntries || [],
        savedBirthChart
      });
    } catch (err: any) {
      console.error("Sync Error:", err);
      return res.status(500).json({ error: "Erro ao sincronizar dados cósmicos" });
    }
  });

  // POST: Update profiles table with all properties
  app.post("/api/profile/update", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    const { 
      name, avatar, xp, nickname, phone, zipCode, address, description,
      portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
      otherNet, showPhone, showAddress, authorTitle, grau, location
    } = req.body;

    try {
      // Clean up inputs to make sure they can insert properly on ON CONFLICT
      await query(`
        INSERT INTO profiles (
          user_id, name, avatar, xp, nickname, phone, zip_code, address, description,
          portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
          other_net, show_phone, show_address, author_title, grau, location
        ) VALUES ($1, $2, $3, COALESCE($4, 100), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (user_id) DO UPDATE SET
          name = COALESCE($2, profiles.name),
          avatar = COALESCE($3, profiles.avatar),
          xp = COALESCE($4, profiles.xp),
          nickname = COALESCE($5, profiles.nickname),
          phone = COALESCE($6, profiles.phone),
          zip_code = COALESCE($7, profiles.zip_code),
          address = COALESCE($8, profiles.address),
          description = COALESCE($9, profiles.description),
          portfolio = COALESCE($10, profiles.portfolio),
          website = COALESCE($11, profiles.website),
          whatsapp = COALESCE($12, profiles.whatsapp),
          telegram = COALESCE($13, profiles.telegram),
          facebook = COALESCE($14, profiles.facebook),
          instagram = COALESCE($15, profiles.instagram),
          x_twitter = COALESCE($16, profiles.x_twitter),
          other_net = COALESCE($17, profiles.other_net),
          show_phone = COALESCE($18, profiles.show_phone),
          show_address = COALESCE($19, profiles.show_address),
          author_title = COALESCE($20, profiles.author_title),
          grau = COALESCE($21, profiles.grau),
          location = COALESCE($22, profiles.location)
      `, [
        userId, name, avatar, xp, nickname, phone, zipCode, address, description,
        portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
        otherNet, showPhone, showAddress, authorTitle, grau, location
      ]);
      
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Profile Update Error:", err);
      return res.status(500).json({ error: "Erro ao gravar dados do buscador" });
    }
  });

  app.get("/api/profile/badges", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    try {
      if (useFallback) {
        return res.json({ badges: fallbackDB.badges.filter(b => b.user_id === Number(userId)) });
      }
      const badgesRes = await query("SELECT * FROM badges WHERE user_id = $1", [userId]);
      res.json({ badges: badgesRes.rows });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error fetching badges" });
    }
  });

  // GET: Fetch profile and services by userId
  app.get("/api/profile/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const profileRes = await query("SELECT * FROM profiles WHERE user_id = $1", [userId]);
      if (profileRes.rows.length === 0) {
        return res.status(404).json({ error: "Buscador não localizado no éter." });
      }

      const row = profileRes.rows[0];
      const itemsRes = await query("SELECT * FROM marketplace_items WHERE user_id = $1 ORDER BY date DESC", [userId]);
      const services = itemsRes.rows.map(item => ({
        title: item.title,
        price: "R$ " + parseFloat(item.price).toFixed(2),
        desc: item.description,
        category: item.category
      }));

      return res.json({
        userId: row.user_id,
        authorName: row.name,
        authorTitle: row.author_title || "Busca-Caminhos",
        grau: row.grau || "Grau I - Iniciado",
        status: "online",
        avatar: row.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
        location: row.location || "Santuário Sagrado",
        bio: row.description || "Um buscador silencioso sintonizado nos mistérios.",
        level: Math.floor((row.xp || 100) / 100) || 1,
        stats: {
          ecos: 14 + Math.floor((row.xp || 100) / 90),
          aura: parseFloat(((row.xp || 100) * 1.5).toFixed(0)),
          ritos: Math.floor((row.xp || 100) / 250)
        },
        socials: {
          ig: row.instagram || "@oraculum_comunidade",
          web: row.website || "oracle.academy"
        },
        services: services,
        creds: [
          { title: "Selo de Verificação", source: "Oracle Academy Assinante", year: "2026" }
        ]
      });
    } catch (err: any) {
      console.error("Fetch profile with services error:", err);
      return res.status(500).json({ error: "Erro ao localizar buscador espiritual." });
    }
  });

  // POST: Update settings table
  app.post("/api/settings/update", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { themePreference, colorTheme } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      await query(
        "INSERT INTO settings (user_id, theme_preference, color_theme) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET theme_preference = COALESCE($2, settings.theme_preference), color_theme = COALESCE($3, settings.color_theme)",
        [userId, themePreference, colorTheme]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Settings Update Error:", err);
      return res.status(500).json({ error: "Erro ao gravar preferências" });
    }
  });

  // POST: Update challenges table
  app.post("/api/challenges/update", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { completedQuiz, flashcardCount, flashcardCompleted, completedJournal } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const current = await query("SELECT * FROM challenges WHERE user_id = $1", [userId]);
      const currentVal = current.rows[0] || {};

      const nextCompletedQuiz = completedQuiz !== undefined ? completedQuiz : (currentVal.completed_quiz ?? false);
      const nextFlashcardCount = flashcardCount !== undefined ? flashcardCount : (currentVal.flashcard_count ?? 0);
      const nextFlashcardCompleted = flashcardCompleted !== undefined ? flashcardCompleted : (currentVal.flashcard_completed ?? false);
      const nextCompletedJournal = completedJournal !== undefined ? completedJournal : (currentVal.completed_journal ?? false);

      await query(
        `INSERT INTO challenges (user_id, completed_quiz, flashcard_count, flashcard_completed, completed_journal) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (user_id) DO UPDATE SET completed_quiz = $2, flashcard_count = $3, flashcard_completed = $4, completed_journal = $5`,
        [userId, nextCompletedQuiz, nextFlashcardCount, nextFlashcardCompleted, nextCompletedJournal]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Challenges Update Error:", err);
      return res.status(500).json({ error: "Erro ao gravar conquistas do buscador" });
    }
  });

  // POST: Add a grimoire entry
  app.post("/api/grimoire/create", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { question, spreadType, cards, interpretation, date, attachments } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const result = await query(
        `INSERT INTO grimoire_entries (user_id, date, question, spread_type, cards, interpretation, attachments) 
         VALUES ($1, COALESCE($2, NOW()), $3, $4, $5, $6, $7) RETURNING id, date`,
        [userId, date, question, spreadType, JSON.stringify(cards || []), interpretation, JSON.stringify(attachments || [])]
      );
      return res.json({ success: true, entryId: result.rows[0].id, date: result.rows[0].date });
    } catch (err: any) {
      console.error("Grimoire Create Error:", err);
      return res.status(500).json({ error: "Falha ao selar grimório no altar" });
    }
  });

  // POST: Update a grimoire entry
  app.post("/api/grimoire/update", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id, question, spreadType, cards, interpretation, attachments } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }
    if (!id) {
      return res.status(400).json({ error: "ID do registro é obrigatório" });
    }

    try {
      await query(
        `UPDATE grimoire_entries 
         SET question = $1, spread_type = $2, cards = $3, interpretation = $4, attachments = $5 
         WHERE id = $6 AND user_id = $7`,
        [question, spreadType, JSON.stringify(cards || []), interpretation, JSON.stringify(attachments || []), id, userId]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Grimoire Update Error:", err);
      return res.status(500).json({ error: "Falha ao atualizar grimório no altar" });
    }
  });

  // POST: Analyze Grimoire notes in real-time with AI
  app.post("/api/ai/analyze-notes", async (req, res) => {
    const { title, content, type } = req.body;
    
    const ai = getGeminiClient();

    if (!ai) {
      // Mock analysis response when Gemini is not available
      return res.json({
        correctedText: content ? content.replace(/cerimonia/gi, "cerimônia").replace(/magia/gi, "magia sagrada") : "Anotação purificada.",
        grammarIssues: ["Correção de digitação: 'cerimonia' para 'cerimônia' (acentuação faltante)."],
        refinementTips: [
          "Enriqueça a descrição definindo as correspondências planetárias envolvidas na prática.",
          "Para maior profissionalismo místico, substitua termos comuns por palavras com maior solenidade iniciática."
        ],
        mysticalResonance: "Solene e Intuitivo"
      });
    }

    try {
      const systemInstruction = `Você é um Sábio Mentor Hermético e especialista em refinamento de grimórios e diários místicos.
Seu papel é analisar anotações espirituais e rituais enviadas pelo usuário, corrigindo pequenos erros gramaticais em português (como ortografia, acentuação, pontuação) e sugerindo melhorias sutis que confiram tom profissional, solene, respeitoso e iniciático às anotações, sem descaracterizar a essência espiritual e o testemunho autêntico do diário.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "correctedText": "Texto original revisado e polido por você, mantendo a formatação HTML se houver HTML, ou Markdown se houver Markdown, mas corrigindo os erros de digitação e ajustando ligeiramente para um tom mais belo e sofisticado.",
  "grammarIssues": ["Uma lista curta das correções gramaticais e de ortografia mais marcantes que foram resolvidas, em formato de string. Se não houver erros, indique que a escrita está imaculada."],
  "refinementTips": ["Sugestões didáticas para elevar a prática descrita (ex: sugerir velas, planetas herdeiros, incensos correlatos, elementos de altares, etc.) de modo a enriquecer o registro."],
  "mysticalResonance": "Estilo de tom preponderante que você identificou (ex: Solene, Poético, Arquetípico, Intelectual, Devocional, Prático)"
}`;

      const textToAnalyze = `Categoria: ${type || "Anotação"}
Título: "${title || ""}"
Anotação Atualmente Escrita:
"${content || ""}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: textToAnalyze,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text?.trim() || "{}";
      const resultObj = JSON.parse(responseText);
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Gemini analyze notes error:", err);
      return res.status(500).json({ 
        error: "Visão turva ao ler o éter de IA", 
        details: err.message 
      });
    }
  });

  // DELETE: Delete a grimoire entry
  app.delete("/api/grimoire/delete/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      await query(
        `DELETE FROM grimoire_entries WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Grimoire Delete Error:", err);
      return res.status(500).json({ error: "Falha ao deletar registro do grimório" });
    }
  });

  // GET: List all grimoire entries
  app.get("/api/grimoire/list", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const items = await query(
        `SELECT id, date, question, spread_type as "spreadType", cards, interpretation, attachments 
         FROM grimoire_entries WHERE user_id = $1 ORDER BY date DESC`,
        [userId]
      );
      return res.json(items.rows);
    } catch (err: any) {
      console.error("Grimoire List Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar grimório" });
    }
  });

  // GET: Fetch notifications for user (auto-seeding if empty)
  app.get("/api/notifications", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Identidade mística requerida" });
    }

    try {
      const checkRes = await query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
      if (checkRes.rows.length === 0) {
        await query(
          `INSERT INTO notifications (user_id, text, type) VALUES 
          ($1, 'Alguém curtiu sua postagem de estudos na Comunidade de Estudantes!', 'like'), 
          ($1, 'Parabéns! Seu novo certificado de "Fundamentos de Ocultismo Prático" foi emitido com sucesso pela Oracle Academy.', 'certificate'), 
          ($1, 'Seu Altar Diário foi renovado com novas missões de leitura e transmutação mental.', 'challenge')`,
          [userId]
        );
        const secondCheck = await query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
        return res.json(secondCheck.rows.map(row => ({
          id: row.id,
          text: row.text,
          isRead: row.is_read,
          createdAt: row.created_at,
          type: row.type
        })));
      }

      return res.json(checkRes.rows.map(row => ({
        id: row.id,
        text: row.text,
        isRead: row.is_read,
        createdAt: row.created_at,
        type: row.type
      })));
    } catch (err: any) {
      console.error("Notifications fetch error:", err);
      return res.status(500).json({ error: "Falha de conexão com os sinais do éter" });
    }
  });

  // POST: Mark all notifications as read
  app.post("/api/notifications/read-all", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Identidade mística requerida" });
    }

    try {
      await query("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [userId]);
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Notifications mark read error:", err);
      return res.status(500).json({ error: "Erro ao silenciar as transmissões" });
    }
  });

  // POST: Create a mock notification for testing (for community likes, challenges, certs, etc)
  app.post("/api/notifications/trigger", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { text, type } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Sem identidade celestial" });
    }
    try {
      await query("INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, $3)", [userId, text || "Uma nova vibração do oráculo foi detectada.", type || "generic"]);
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao gerar sinal do éter" });
    }
  });

  // GET: Unified platform-wide search for courses, community posts, library items
  app.get("/api/search", async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.json({ posts: [], items: [] });
    }
    const term = `%${q}%`;
    try {
      const postsRes = await query(
        `SELECT id, user_id as "userId", author_name as "authorName", author_title as "authorTitle", avatar, coven, content, likes, comments, date, tags 
         FROM community_posts 
         WHERE content ILIKE $1 OR author_name ILIKE $1 OR tags ILIKE $1
         ORDER BY date DESC LIMIT 15`,
        [term]
      );
      
      const itemsRes = await query(
        `SELECT id, user_id as "userId", author_name as "author", title, subtitle, description, price, category, cover_image as "coverImage", hashtags, file_url as "fileUrl"
         FROM marketplace_items 
         WHERE title ILIKE $1 OR subtitle ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 OR hashtags ILIKE $1
         ORDER BY date DESC LIMIT 15`,
        [term]
      );

      return res.json({
        posts: postsRes.rows.map(row => ({
          ...row,
          images: [],
          tags: JSON.parse(row.tags || '[]')
        })),
        items: itemsRes.rows.map(row => ({
          ...row,
          hashtags: JSON.parse(row.hashtags || '[]'),
          price: parseFloat(row.price || '0')
        }))
      });
    } catch (err) {
      console.error("Global search error:", err);
      return res.status(500).json({ error: "Erro na sintonia de busca celestial" });
    }
  });

  // GET: Fetch real top rankings from profiles table
  app.get("/api/rankings", async (req, res) => {
    try {
      const items = await query(
        `SELECT name, avatar, xp, 'Brasil' as state FROM profiles ORDER BY xp DESC LIMIT 10`
      );
      return res.json(items.rows);
    } catch (err: any) {
      console.error("Rankings Fetch Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar rankings" });
    }
  });

  // GET: Fetch community mystical news
  app.get("/api/community/news", async (req, res) => {
    try {
      const result = await query("SELECT * FROM community_news ORDER BY id DESC LIMIT 10");
      const news = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        content: row.content,
        date: row.date || 'Hoje',
        readTime: row.read_time || '5 min',
        image: row.image || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80'
      }));
      return res.json(news);
    } catch (err) {
      console.error("Fetch community news error:", err);
      // Fallback to memory
      const fallbackNews = (fallbackDB.community_news || []).map(row => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        content: row.content,
        date: row.date || 'Hoje',
        readTime: row.read_time || '5 min',
        image: row.image || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80'
      }));
      return res.json(fallbackNews);
    }
  });

  // POST: Generate a new random mystical news article using Gemini AI
  app.post("/api/community/news/generate", async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      // Mock random generation if Gemini is not set up
      const mockNewsList = [
        {
          title: "Revelação Arcana: Trígonos de Lilith ativam visões clarividentes pós-crepúsculo",
          summary: "Estudiosos afirmam que o silêncio da noite potencializará canalizações intuitivas nesta semana.",
          content: "Com a aspectação angular favorável de Lilith em Escorpião, oraculistas noturnos observam um aumento súbito na clareza ao ler as cartas de tarô de Thoth e do baralho Rider-Waite. Este fluxo de sabedoria flui com facilidade pelas horas mortas mundanas.",
          date: "Hoje",
          read_time: "4 min",
          image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400"
        },
        {
          title: "Consagração Cósmica: Oráculo Solar em Leão maximiza ritos de expansão profissional",
          summary: "Especialistas indicam ritos elementais de velas douradas para canalizar abundância.",
          content: "O Sol entra em sua morada régia de Leão, impulsionando a consagração de tarôs orientados à carreira e prosperidade financeira. É o momento perfeito para invocar a energia elemental do fogo para transmutação material profunda.",
          date: "Hoje",
          read_time: "2 min",
          image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=400"
        }
      ];
      const randomMock = mockNewsList[Math.floor(Math.random() * mockNewsList.length)];
      try {
        const insertRes = await query(
          "INSERT INTO community_news (title, summary, content, date, read_time, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [randomMock.title, randomMock.summary, randomMock.content, randomMock.date, randomMock.read_time, randomMock.image]
        );
        return res.json({ id: insertRes.rows[0]?.id || 99, ...randomMock, readTime: randomMock.read_time });
      } catch (err) {
        // Fallback memory database update
        const idVal = fallbackDB.community_news.length + 1;
        const fallbackObj = { id: idVal, ...randomMock };
        fallbackDB.community_news.push(fallbackObj);
        return res.json({ ...fallbackObj, readTime: fallbackObj.read_time });
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Gere uma notícia mística, espiritual, hermética ou astrológica inovadora e surpreendente para um portal esotérico de alta qualidade.
A notícia deve ser original, poética, intrigante e escrita em português do Brasil. O tema pode variar entre astronomia, arqueologia mágica, estudos de tarô de ponta, ritos lunares, alquimia das ervas ou transmutação energética celular.
Retorne rigorosamente e APENAS um JSON válido que respeite este formato exato, sem markdown extra ao redor:
{
  "title": "Um título atraente, solene e altamente profissional, ex: 'Alinhamento em Capricórnio desperta virtudes de foco mental'",
  "summary": "Um sumário curto de 1 ou 2 linhas descrevendo o impacto oracular.",
  "content": "O texto completo da notícia detalhando o trânsito celeste ou descoberta arqueológica, contendo conselhos práticos para oraculistas e buscadores.",
  "read_time": "Ex: '4 min'",
  "image": "Uma URL de imagem que seja uma das seguintes: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400' ou 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400' ou 'https://images.unsplash.com/photo-1600367163103-93694001cff3?auto=format&fit=crop&w=400' ou 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400' ou 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=400'"
}`
      });

      const responseText = response.text ? response.text.trim() : "";
      
      // Clean JSON if model returns standard markdown braces
      const cleaned = responseText.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned);

      const title = parsed.title || "Notícia do Éter Astral";
      const summary = parsed.summary || "Uma nova vibração percorre os canais da egrégora.";
      const content = parsed.content || "As forças sutis estão se organizando de forma inédita.";
      const read_time = parsed.read_time || "3 min";
      const image = parsed.image || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400";
      const date = "Hoje";

      try {
        const insertRes = await query(
          "INSERT INTO community_news (title, summary, content, date, read_time, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [title, summary, content, date, read_time, image]
        );
        return res.json({ id: insertRes.rows[0]?.id || 100, title, summary, content, date, readTime: read_time, image });
      } catch (err) {
        const idVal = fallbackDB.community_news.length + 1;
        const fallbackObj = { id: idVal, title, summary, content, date, read_time, image };
        fallbackDB.community_news.push(fallbackObj);
        return res.json({ ...fallbackObj, readTime: fallbackObj.read_time });
      }
    } catch (err) {
      console.error("Failed to generate mystical news with Gemini:", err);
      const mockNewsList = [
        {
          title: "Revelação Arcana: Trígonos de Lilith ativam visões clarividentes pós-crepúsculo",
          summary: "Estudiosos afirmam que o silêncio da noite potencializará canalizações intuitivas nesta semana.",
          content: "Com a aspectação angular favorável de Lilith em Escorpião, oraculistas noturnos observam um aumento súbito na clareza ao ler as cartas de tarô de Thoth e do baralho Rider-Waite. Este fluxo de sabedoria flui com facilidade pelas horas mortas mundanas.",
          date: "Hoje",
          read_time: "4 min",
          image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400"
        },
        {
          title: "Consagração Cósmica: Oráculo Solar em Leão maximiza ritos de expansão profissional",
          summary: "Especialistas indicam ritos elementais de velas douradas para canalizar abundância.",
          content: "O Sol entra em sua morada régia de Leão, impulsionando a consagração de tarôs orientados à carreira e prosperidade financeira. É o momento perfeito para invocar a energia elemental do fogo para transmutação material profunda.",
          date: "Hoje",
          read_time: "2 min",
          image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=400"
        }
      ];
      const randomMock = mockNewsList[Math.floor(Math.random() * mockNewsList.length)];
      try {
        const insertRes = await query(
          "INSERT INTO community_news (title, summary, content, date, read_time, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [randomMock.title, randomMock.summary, randomMock.content, randomMock.date, randomMock.read_time, randomMock.image]
        );
        return res.json({ id: insertRes.rows[0]?.id || 99, ...randomMock, readTime: randomMock.read_time });
      } catch (errDb) {
        const idVal = fallbackDB.community_news.length + 1;
        const fallbackObj = { id: idVal, ...randomMock };
        fallbackDB.community_news.push(fallbackObj);
        return res.json({ ...fallbackObj, readTime: fallbackObj.read_time });
      }
    }
  });

  // GET: Fetch community posts
  app.get("/api/community/posts", async (req, res) => {
    try {
      const result = await query("SELECT * FROM community_posts ORDER BY date DESC");
      const posts = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        authorName: row.author_name,
        authorTitle: row.author_title,
        status: 'online', 
        avatar: row.avatar,
        coven: row.coven,
        content: row.content,
        images: JSON.parse(row.images || '[]'),
        likes: row.likes,
        comments: row.comments,
        time: 'Recente',
        tags: JSON.parse(row.tags || '[]')
      }));
      return res.json(posts);
    } catch (err) {
      console.error("Fetch posts error:", err);
      return res.status(500).json({ error: "Erro ao invocar as mensagens do além" });
    }
  });

  // POST: Create a community post
  app.post("/api/community/posts", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { content, coven, images, tags } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Identidade cósmica requerida" });
    }

    try {
      const profileRes = await query("SELECT name, avatar FROM profiles WHERE user_id = $1", [userId]);
      const profile = profileRes.rows[0] || { name: 'Buscador', avatar: '' };

      const result = await query(
        `INSERT INTO community_posts (user_id, author_name, author_title, avatar, coven, content, images, tags)
         VALUES ($1, $2, 'Iniciado', $3, $4, $5, $6, $7) RETURNING *`,
        [userId, profile.name, profile.avatar, coven || 'Eter', content, JSON.stringify(images || []), JSON.stringify(tags || [])]
      );

      const row = result.rows[0];
      return res.json({
        id: row.id,
        authorName: row.author_name,
        authorTitle: row.author_title,
        status: 'online',
        avatar: row.avatar,
        coven: row.coven,
        content: row.content,
        images: JSON.parse(row.images || '[]'),
        likes: row.likes,
        comments: row.comments,
        time: 'Agora',
        tags: JSON.parse(row.tags || '[]')
      });
    } catch (err) {
      console.error("Create post error:", err);
      return res.status(500).json({ error: "Erro ao propagar mensagem no éter" });
    }
  });

  // POST: Like a community post
  app.post("/api/community/posts/:id/like", async (req, res) => {
    const { id } = req.params;
    try {
      const postRes = await query("SELECT user_id, content FROM community_posts WHERE id = $1", [id]);
      if (postRes.rows.length === 0) {
        return res.status(404).json({ error: "Postagem não localizada" });
      }
      const post = postRes.rows[0];
      const result = await query("UPDATE community_posts SET likes = likes + 1 WHERE id = $1 RETURNING likes", [id]);
      
      const briefContent = post.content.length > 25 ? post.content.substring(0, 25) + "..." : post.content;
      await query(
        `INSERT INTO notifications (user_id, text, type) 
         VALUES ($1, $2, 'like')`,
        [post.user_id, `Sua postagem ("${briefContent}") recebeu uma nova curtida na comunidade de oráculos!`]
      );

      return res.json({ likes: result.rows[0].likes });
    } catch (err) {
      console.error("Like post error:", err);
      return res.status(500).json({ error: "Erro ao ressoar simpatia cósmica" });
    }
  });

  // GET: Fetch marketplace items (Library, consultations, gifts, etc)
  app.get("/api/marketplace/items", async (req, res) => {
    try {
      const result = await query("SELECT * FROM marketplace_items ORDER BY date DESC");
      const items = result.rows.map(row => ({
        id: row.id.toString(),
        userId: row.user_id,
        authorName: row.author_name,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        coverImage: row.cover_image,
        hashtags: JSON.parse(row.hashtags || '[]'),
        fileUrl: row.file_url
      }));
      return res.json(items);
    } catch (err) {
      console.error("Fetch marketplace error:", err);
      return res.status(500).json({ error: "Erro ao ler as mercadorias místicas" });
    }
  });

  // POST: Create a marketplace item
  app.post("/api/marketplace/items", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { title, subtitle, description, price, category, coverImage, hashtags, fileUrl } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso comercial não autorizado" });
    }

    try {
      const profileRes = await query("SELECT name FROM profiles WHERE user_id = $1", [userId]);
      const profile = profileRes.rows[0] || { name: 'Alquimista' };

      const result = await query(
        `INSERT INTO marketplace_items (user_id, author_name, title, subtitle, description, price, category, cover_image, hashtags, file_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [userId, profile.name, title, subtitle, description, price, category, coverImage, JSON.stringify(hashtags || []), fileUrl || '']
      );

      const row = result.rows[0];
      return res.json({
        id: row.id.toString(),
        authorName: row.author_name,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        coverImage: row.cover_image,
        hashtags: JSON.parse(row.hashtags || '[]'),
        fileUrl: row.file_url
      });
    } catch (err) {
      console.error("Create marketplace item error:", err);
      return res.status(500).json({ error: "Erro ao manifestar livro ou serviço para venda" });
    }
  });

  // --- EXISTING ORACLE GEMINI ENDPOINTS ---

  // API endpoint: Generate Personalized Oracle Spread
  app.post("/api/oracle/generate", async (req, res) => {
    const { question, oracle, spreadType, learningFocus } = req.body;
    
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackCards = oracle === "Runas" 
        ? ["Fehu (Riqueza)", "Ansuz (Sinal/Mensagem)", "Uruz (Força)"]
        : oracle === "Lenormand"
        ? ["O Cavaleiro", "A Estrela", "A Chave"]
        : ["O Louco", "A Sacerdotisa", "O Mundo"];

      return res.json({
        cards: fallbackCards,
        meanings: [
          "Representa novos começos, potencial ilimitado e saltos de fé.",
          "Indica intuição primária, sabedoria interior e reflexão silenciosa.",
          "Representa a manifestação completa, celebração e o fim de um ciclo de aprendizado."
        ],
        interpretation: "### A Visão do Portal Místico\n\n*(Nota: O Oráculo está rodando em Modo de Comunhão Local)*\n\nSua tiragem revela um fluxo contínuo de despertar. O ponto de partida convida você a se desvincular do medo do erro. No seu foco de estudos (**" + (learningFocus || "Conexões Gerais") + "**), as correntes espirituais mostram que a prática constante trará mais intuição do que mera racionalização. Confie na sabedoria adormecida nas profundezas de sua mente cósmica.",
        studyNote: "**Exercício de Fixação**: Desenhe os símbolos das cartas tiradas em seu caderno físico. Ao meditar sobre elas por 5 minutos antes de dormir, você consolidará a memorização dos arquétipos.",
        mode: "mock"
      });
    }

    try {
      const systemInstruction = `Você é um místico sábio e excelente instrutor de oráculos (Tarot, Runas e Lenormand).
Seu objetivo é ajudar o aluno a estudar. Com base no oráculo selecionado, tire cartas apropriadas para a tiragem solicitada e elabore um retorno didático-místico.
Conecte as cartas diretamente ao foco de aprendizado especificado pelo usuário.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "cards": ["Nome da Carta 1", "Nome da Carta 2", "Nome da Carta 3"],
  "meanings": ["Significado breve da Carta 1", "Significado breve da Carta 2", "Significado breve da Carta 3"],
  "interpretation": "Explicação fluida da tiragem em relação à pergunta ou do estudo, usando formatação rica Markdown com títulos e destaques.",
  "studyNote": "Instrução prática ou correlação mística didática para memorizar essas cartas de forma simples."
}`;

      const oracleContext = `Instruções principais:
Oráculo selecionado: ${oracle || "Tarot"}
Tiragem solicitada: ${spreadType || "Conselho Rápido"}
Pergunta/Dúvida do Usuário: "${question || "Estudos e progresso espiritual"}"
Meta/Foco de Estudos do Aluno: "${learningFocus || "Não especificado"}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: oracleContext,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text?.trim() || "{}";
      const resultObj = JSON.parse(responseText);
      return res.json(resultObj);

    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      return res.status(500).json({ 
        error: "Visão turva temporária.",
        details: err.message 
      });
    }
  });

  // API endpoint: Standard Ask Oracle fallback
  app.post("/api/oracle/ask", async (req, res) => {
    const { question, spreadType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        cards: ["A Imperatriz", "O Eremita"],
        interpretation: "*(Modo de Teste Local)*\n\nA Imperatriz aponta exuberância e fertilidade em seus projetos de estudo antigos, enquanto O Eremita aconselha recolhimento e silêncio para processar os novos conhecimentos acumulados. Excelente momento para introspecção."
      });
    }

    try {
      const prompt = `Você é um místico Oráculo e leitor de Tarot/Lenormand. 
O usuário pergunta: "${question}"
Tipo de tiragem solicitada: ${spreadType}.
1. Escolha de modo justo e aleatório cartas apropriadas para esta tiragem.
2. Forneça uma interpretação misteriosa mas conselheira do significado delas em relação à pergunta (em Português do Brasil).
Retorne a resposta em formato JSON correspondente a este schema: 
{ "cards": ["Carta 1", "Carta 2"], "interpretation": "Descrição longa em Markdown..." }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text?.trim() || "{}");
      return res.json(result);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: "Erro na conexão com as forças astrais." });
    }
  });

  // API endpoint: Generate free Astral Birth Chart (Mapa Astral) for Landing Page seeker demo
  app.post("/api/oracle/free-birth-chart", async (req, res) => {
    const { fullName, birthDate, birthTime, birthLocation } = req.body;
    const userId = req.headers["x-user-id"];

    if (!fullName || !birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({ error: "Todos os dados sagrados de nascimento são necessários para sintonizar as estrelas" });
    }

    const generateFallbackBirthChart = (fName: string, bDate: string, bTime: string, bLocation: string) => {
      const dateObj = new Date(bDate);
      const day = dateObj.getDate() || 15;
      const month = dateObj.getMonth() + 1 || 5;
      
      // Basic solar sign calculator
      let sign = "Escorpião";
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = "Áries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = "Touro";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = "Gêmeos";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = "Câncer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = "Leão";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = "Virgem";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = "Libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = "Escorpião";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = "Sagitário";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = "Capricórnio";
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = "Aquário";
      else sign = "Peixes";

      const asc = day % 2 === 0 ? "Leão" : "Sagitário";
      const moon = day % 3 === 0 ? "Touro" : day % 3 === 1 ? "Peixes" : "Câncer";

      return {
        signoSolar: sign,
        signoAscendente: asc,
        luna: moon,
        vidaAmorosa: `Para o buscador ${fName}, nascido em ${bLocation}, os trânsitos planetários sobre seu aspecto solar em ${sign} apontam uma fase de profunda necessidade de conexão mística no amor. Você anseia por uma alma companheira que compreenda seus silêncios e mistérios, e não apenas sua fachada social. Evite projetar expectativas excessivas nos outros nas próximas luas.`,
        vidaFinanceira: `Com o signo solar em ${sign} influenciando sua segunda casa astrológica, sua vida financeira flutua de acordo com sua estabilidade mental e mística. Há caminhos auspiciosos de prosperidade revelados para este ciclo, desde que você aprenda a planejar estrategicamente em vez de gastar por impulsividade emocional ou desejos efêmeros.`,
        vidaEspiritual: `Seu espírito carrega o peso de sabedorias antigas. O ascendente em ${asc} lhe traz um farol de liderança espiritual espontânea. Você é puxado para desvendar segredos e o ocultismo. A Oracle Academy é a egrégora exata para ajudá-lo a transmutar essas dúvidas mentais em pura mestria interpretativa de oráculos.`,
        pontosFortes: [
          "Intuição Aguda: Capacidade de ler ambientes e pessoas quase instantaneamente.",
          "Magnetismo Pessoal: Sua presença gera curiosidade e fascínio sutil.",
          "Consistência Espiritual: Quando foca em um estudo ocultista, sua mente penetra véus profundos."
        ],
        pontosFracos: [
          "Fuga da Realidade: Tendência de se isolar no mundo astral quando estressado.",
          "Segredo Excessivo: Dificuldade de confiar e compartilhar suas fraquezas com os outros.",
          "Ansiedade Cósmica: Querer decodificar o futuro antes de viver o presente com maestria."
        ],
        conselhoEstelar: `Busque o equilíbrio ativo entre a Terra e o Cosmo! Você deve focar em desapegar-se do controle absoluto sobre os resultados. Permita-se ser um canal de energia, consagrando seus estudos diariamente. A sua real evolução começará quando você se registrar formalmente no Círculo de Estudos da Oracle Academy.`
      };
    };

    const ai = getGeminiClient();
    let resultObj: any = null;

    if (!ai) {
      resultObj = generateFallbackBirthChart(fullName, birthDate, birthTime, birthLocation);
    } else {
      try {
        const systemInstruction = `Você é o Astrólogo Cósmico da Oracle Academy, focado em decodificar mistérios profundos utilizando os segredos estelares da astrologia matemática e hermética.
O tom de sua resposta deve ser divino, refinado, acolhedor, altamente inteligente e poético.
Você deve analisar minuciosamente os dados fornecidos pelo usuário e computar um Mapa Astral demonstrativo real baseado nessas sintonias.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "signoSolar": "Nome do Signo Solar",
  "signoAscendente": "Nome do Signo Ascendente",
  "luna": "Nome do Signo Lunar",
  "vidaAmorosa": "Texto místico profundo sobre a vida amorosa do buscador, baseado nos aspectos astrológicos de seu nascimento (cerca de 100 a 120 palavras).",
  "vidaFinanceira": "Texto místico profundo sobre a prosperidade e vida financeira (cerca de 100 a 120 palavras).",
  "vidaEspiritual": "Texto místico profundo revelando sua jornada de alma e espiritualidade (cerca de 100 a 120 palavras).",
  "pontosFortes": ["Ponto Forte 1: breve explicação2", "Ponto Forte 2: breve descrição", "Ponto Forte 3: breve descrição"],
  "pontosFracos": ["Ponto Fraco 1: breve descrição", "Ponto Fraco 2: breve descrição", "Ponto Fraco 3: breve descrição"],
  "conselhoEstelar": "Um conselho estelar majestoso sobre o que o usuário deve transmutar, mudar ou focar em sua vida hoje para realizar seu pleno potencial divino."
}
Responda em PORTUGUÊS DO BRASIL. Não inclua nenhuma formatação markdown fora do bloco JSON. Não inclua a palavra 'json' na resposta, envie apenas o objeto de texto limpo para JSON.parse()`;

        const context = `Nome Completo do Buscador: ${fullName}
Data de Nascimento: ${birthDate}
Hora de Nascimento: ${birthTime}
Local de Nascimento: ${birthLocation}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: context,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
          }
        });

        const responseText = response.text?.trim() || "{}";
        resultObj = JSON.parse(responseText);

      } catch (err: any) {
        console.error("Gemini Birthchart Generation Error, falling back to local generator:", err);
        // Seamlessly fall back so the application is completely robust against 403 API key or any online errors
        resultObj = generateFallbackBirthChart(fullName, birthDate, birthTime, birthLocation);
      }
    }

    // Save to database if user is logged in
    if (userId && resultObj) {
      try {
        await query(`
          INSERT INTO birth_charts (user_id, full_name, birth_date, birth_time, birth_location, chart_data)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id) DO UPDATE SET 
            full_name = $2, 
            birth_date = $3, 
            birth_time = $4, 
            birth_location = $5, 
            chart_data = $6
        `, [userId, fullName, birthDate, birthTime, birthLocation, JSON.stringify(resultObj)]);
      } catch (dbErr) {
        console.error("Error saving birth chart to database:", dbErr);
      }
    }

    return res.json(resultObj);
  });

  // GET: Fetch study plan
  app.get("/api/study-plan", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Identidade mística requerida" });
    }
    try {
      const match = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
      if (match.rows.length === 0) {
        return res.json({ plan: null });
      }
      return res.json({ plan: typeof match.rows[0].plan === 'string' ? JSON.parse(match.rows[0].plan) : match.rows[0].plan });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao sintonizar plano de estudos" });
    }
  });

  // POST: Generate personalized study plan
  app.post("/api/study-plan/generate", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ error: "Identidade mística requerida" });
    }

    const ai = getGeminiClient();

    let profile = { name: "Buscador", xp: 100, authorTitle: "Iniciado", grau: "Grau I - Iniciado" };
    let challenges = { completedQuiz: false, flashcardCount: 0, flashcardCompleted: false, completedJournal: false };
    let grimoireCount = 0;

    try {
      const pRes = await query(`
        SELECT name, xp, author_title as "authorTitle", grau 
        FROM profiles 
        WHERE user_id = $1
      `, [userId]);
      if (pRes.rows.length > 0) profile = pRes.rows[0];

      const cRes = await query(`
        SELECT completed_quiz as "completedQuiz", flashcard_count as "flashcardCount", 
               flashcard_completed as "flashcardCompleted", completed_journal as "completedJournal" 
        FROM challenges 
        WHERE user_id = $1
      `, [userId]);
      if (cRes.rows.length > 0) challenges = cRes.rows[0];

      const gRes = await query("SELECT COUNT(*) as count FROM grimoire_entries WHERE user_id = $1", [userId]);
      if (gRes.rows.length > 0) grimoireCount = parseInt(gRes.rows[0].count || 0);
    } catch (err) {
      console.error("Error gathering user stats for study plan:", err);
    }

    const generateFallbackPlan = () => {
      return {
        tasks: [
          { id: "t1", day: "Segunda", title: "Fundamentos de Velas e Piromancia", activity: "Consumação da lição Teoria e Fundamentos. Pratique o foco espiritual por 10 minutos.", duration: "20 min", xp: 25, completed: false, category: "Study", notificationsEnabled: false },
          { id: "t2", day: "Terça", title: "Sincronia Cósmica do Altar", activity: "Aprenda a fazer a limpeza do Altar com incenso de lavanda.", duration: "15 min", xp: 25, completed: false, category: "Ritual", notificationsEnabled: false },
          { id: "t3", day: "Quarta", title: "Intuição com Água e Sombras", activity: "Observe uma taça de água à luz de velas buscando formas arquetípicas.", duration: "30 min", xp: 30, completed: false, category: "Meditation", notificationsEnabled: false },
          { id: "t4", day: "Quinta", title: "Exercício com Pêndulo", activity: "Acalme a mente e conduza perguntas binárias (sim/não) de validação.", duration: "15 min", xp: 25, completed: false, category: "Meditation", notificationsEnabled: false },
          { id: "t5", day: "Sexta", title: "Registro e Meditação", activity: "Escreva uma reflexão mística em seu Grimório Pessoal para firmar aprendizado.", duration: "25 min", xp: 30, completed: false, category: "Study", notificationsEnabled: false }
        ]
      };
    };

    let planObj: any = null;

    if (!ai) {
      planObj = generateFallbackPlan();
    } else {
      try {
        const systemInstruction = `Você é o Conselheiro de Aprendizagem de Oráculos da Oracle Academy. Sua missão é formular um programa de estudos personalizado e equilibrado baseado na jornada mística atual de cada buscador.
Você deve produzir um cronograma de atividades focado no progresso acadêmico-espiritual deles.
Analise estas estatísticas do usuário:
- Nome: ${profile.name}
- Nível de Experiência: ${profile.xp} XP (Grau: ${profile.grau})
- Questionários respondidos: ${challenges.completedQuiz ? "Sim" : "Ainda não"}
- Revisões de baralhos: ${challenges.flashcardCount} sessões completadas
- Diário de Práticas: ${challenges.completedJournal ? "Conectado" : "Não conectado"}
- Entradas de oráculo salvas: ${grimoireCount}

Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "tasks": [
    {
      "id": "t1",
      "day": "Dia da semana (ex: Segunda)",
      "title": "Título conciso e inspirador focado em oráculos e ocultismo",
      "activity": "Descrição didática e estimulante da atividade que o buscador deve realizar",
      "duration": "Tempo sugerido (ex: 15 min ou 20 min)",
      "xp": 25,
      "completed": false,
      "category": "Escolha entre: Ritual, Study, ou Meditation",
      "notificationsEnabled": false
    }
  ]
}
Gere entre 4 a 6 tarefas refinadas e ricas. Use o português do Brasil. Não inclua bloco markdown ou outro texto fora do JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: "Por favor, elabore meu plano de estudos personalizado celestial de acordo com minhas estatísticas cósmicas.",
          config: {
            systemInstruction,
            responseMimeType: "application/json",
          }
        });
        
        const text = response.text?.trim() || "{}";
        planObj = JSON.parse(text);
        if (!planObj.tasks || !Array.isArray(planObj.tasks)) {
          planObj = generateFallbackPlan();
        }
      } catch (err) {
        console.error("Gemini failed to generate study plan, falling back:", err);
        planObj = generateFallbackPlan();
      }
    }

    try {
      await query(`
        INSERT INTO study_plans (user_id, plan) VALUES ($1, $2)
        ON CONFLICT (user_id) DO UPDATE SET plan = $2
      `, [userId, JSON.stringify(planObj)]);

      await query(`
        INSERT INTO notifications (user_id, text, type)
        VALUES ($1, 'Seu Plano de Estudos Personalizado por IA foi revelado! Estude e complete tarefas para receber recompensas de XP extras.', 'challenge')
      `, [userId]);

      return res.json({ success: true, plan: planObj });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao registrar o plano cósmico de estudos" });
    }
  });

  // POST: Toggle notifications for study plan task
  app.post("/api/study-plan/toggle-notification", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { taskId, enabled } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: "Parâmetros insuficientes" });
    }

    try {
      const spRes = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
      if (spRes.rows.length === 0) {
        return res.status(404).json({ error: "Plano de estudos não localizado" });
      }

      const planObj = typeof spRes.rows[0].plan === 'string' ? JSON.parse(spRes.rows[0].plan) : spRes.rows[0].plan;
      const tasks = planObj.tasks || [];
      const task = tasks.find((t: any) => t.id === taskId);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não localizada" });
      }

      task.notificationsEnabled = enabled;

      await query("UPDATE study_plans SET plan = $1 WHERE user_id = $2", [JSON.stringify(planObj), userId]);

      return res.json({ success: true, plan: planObj });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao processar notificações" });
    }
  });

  // POST: Complete a study plan task
  app.post("/api/study-plan/complete-task", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { taskId } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: "Parâmetros insuficientes" });
    }

    try {
      const spRes = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
      if (spRes.rows.length === 0) {
        return res.status(404).json({ error: "Plano de estudos não localizado" });
      }

      const planObj = typeof spRes.rows[0].plan === 'string' ? JSON.parse(spRes.rows[0].plan) : spRes.rows[0].plan;
      const tasks = planObj.tasks || [];
      const task = tasks.find((t: any) => t.id === taskId);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não localizada" });
      }

      if (task.completed) {
        return res.status(400).json({ error: "Tarefa já foi finalizada" });
      }

      task.completed = true;
      const awardXp = task.xp || 25;

      await query("UPDATE study_plans SET plan = $1 WHERE user_id = $2", [JSON.stringify(planObj), userId]);
      await query("UPDATE profiles SET xp = xp + $1 WHERE user_id = $2", [awardXp, userId]);

      await query(`
        INSERT INTO notifications (user_id, text, type)
        VALUES ($1, $2, 'challenge')
      `, [userId, `Parabéns! Você concluiu a tarefa "${task.title}" e recebeu +${awardXp} XP de recompensa cósmica.`]);

      return res.json({ success: true, plan: planObj, xpAwarded: awardXp });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao processar sacramentos de estudo" });
    }
  });

  // POST: Complete lesson/module step and award XP
  app.post("/api/courses/complete-step", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { nodeName, lessonTitle, isQuiz, score } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    try {
      let awardXp = 30;
      let msg = `Você concluiu com sucesso a lição "${lessonTitle}" em ${nodeName}! (+30 XP)`;

      if (isQuiz) {
        awardXp = 50;
        msg = `Você completou o Desafio Avaliativo de ${nodeName} com pontuação de ${score}%! (+50 XP)`;
        
        await query("UPDATE challenges SET completed_quiz = TRUE WHERE user_id = $1", [userId]);
        
        if (score === 100) {
          msg += " PONTUAÇÃO PERFEITA!";
          await query(`
            INSERT INTO notifications (user_id, text, type)
            VALUES ($1, 'Incrível! Você desbloqueou o selo distintivo "Chama do Conhecimento" por sua pontuação perfeita (100%) no quiz avaliativo.', 'certificate')
          `, [userId]);
        }
      }

      await query("UPDATE profiles SET xp = xp + $1 WHERE user_id = $2", [awardXp, userId]);
      await query("INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')", [userId, msg]);

      return res.json({ success: true, xpAwarded: awardXp });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Falha ao certificar lição" });
    }
  });

  // GET: Fetch comments for a post
  app.get("/api/community/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    try {
      const match = await query("SELECT * FROM post_comments WHERE post_id = $1 ORDER BY date ASC", [id]);
      const comments = match.rows.map(row => ({
        id: row.id,
        postId: row.post_id,
        userId: row.user_id,
        authorName: row.author_name,
        avatar: row.avatar,
        content: row.content,
        date: row.date
      }));
      return res.json(comments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao invocar respostas" });
    }
  });

  // POST: Add comment to a post
  app.post("/api/community/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    const userId = req.headers["x-user-id"];
    const { content } = req.body;
    if (!userId || !content) {
      return res.status(400).json({ error: "Parâmetros insuficientes para responder" });
    }

    try {
      const profileRes = await query("SELECT name, avatar FROM profiles WHERE user_id = $1", [userId]);
      const profile = profileRes.rows[0] || { name: "Buscador", avatar: "" };

      const comRes = await query(`
        INSERT INTO post_comments (post_id, user_id, author_name, avatar, content)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [id, userId, profile.name, profile.avatar, content]);

      const row = comRes.rows[0];

      await query("UPDATE community_posts SET comments = comments + 1 WHERE id = $1", [id]);

      const postRes = await query("SELECT user_id, content FROM community_posts WHERE id = $1", [id]);
      if (postRes.rows.length > 0) {
        const postAuthor = postRes.rows[0].user_id;
        const postBrief = postRes.rows[0].content.substring(0, 20) + "...";
        if (Number(postAuthor) !== Number(userId)) {
          await query(`
            INSERT INTO notifications (user_id, text, type)
            VALUES ($1, $2, 'like')
          `, [postAuthor, `${profile.name} comentou em sua publicação ("${postBrief}"): "${content.substring(0, 30)}..."`]);
        }
      }

      return res.json({
        id: row.id,
        postId: row.post_id,
        userId: row.user_id,
        authorName: row.author_name,
        avatar: row.avatar,
        content: row.content,
        date: row.date
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao propagar comentário" });
    }
  });

  // DELETE: Delete post (Moderation feature + creator deletion)
  app.delete("/api/community/posts/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Identidade cósmica necessária para moderar" });
    }

    try {
      const checkRes = await query("SELECT user_id FROM community_posts WHERE id = $1", [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ error: "Postagem não encontrada" });
      }

      const creatorId = checkRes.rows[0].user_id;

      const profRes = await query(`
        SELECT description, author_title as "authorTitle" 
        FROM profiles 
        WHERE user_id = $1
      `, [userId]);
      const profile = profRes.rows[0];
      const isAdmin = profile && (profile.authorTitle === 'Magus Supremo' || profile.description?.toLowerCase().includes('admin'));

      if (Number(creatorId) !== Number(userId) && !isAdmin) {
        return res.status(403).json({ error: "Apenas moderadores celestiais ou o criador podem remover esta mensagem" });
      }

      await query("DELETE FROM community_posts WHERE id = $1", [id]);
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao transmutar deleção cósmica" });
    }
  });

  // DELETE: Delete comment (Moderation feature + creator deletion)
  app.delete("/api/community/comments/:id", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Não sintonizado" });
    }

    try {
      const checkRes = await query("SELECT user_id, post_id FROM post_comments WHERE id = $1", [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ error: "Comentáculo não localizado" });
      }

      const creatorId = checkRes.rows[0].user_id;
      const postId = checkRes.rows[0].post_id;

      const profRes = await query(`
        SELECT description, author_title as "authorTitle" 
        FROM profiles 
        WHERE user_id = $1
      `, [userId]);
      const profile = profRes.rows[0];
      const isAdmin = profile && (profile.authorTitle === 'Magus Supremo' || profile.description?.toLowerCase().includes('admin'));

      if (Number(creatorId) !== Number(userId) && !isAdmin) {
        return res.status(403).json({ error: "Permissões de moderação insuficientes" });
      }

      await query("DELETE FROM post_comments WHERE id = $1", [id]);
      
      await query(`
        UPDATE community_posts 
        SET comments = CASE WHEN comments > 0 THEN comments - 1 ELSE 0 END 
        WHERE id = $1
      `, [postId]);

      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover o comentário" });
    }
  });

  // --- MERCADO PAGO INTEGRATIONS ---
  let MercadoPagoConfig: any, Preference: any;
  try {
    const mp = require('mercadopago');
    MercadoPagoConfig = mp.MercadoPagoConfig;
    Preference = mp.Preference;
  } catch (e) {
    console.error("mercadopago not initialized");
  }

  app.post("/api/payments/checkout", async (req, res) => {
    try {
      if (!MercadoPagoConfig || !Preference) return res.status(500).json({ error: 'SDK Ausente' });
      const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-1234567890';
      const mpConfig = new MercadoPagoConfig({ accessToken: mpAccessToken, options: { timeout: 5000 } });

      const { title, price, quantity, sellerName } = req.body;
      const userId = req.headers['x-user-id'] || '1';
      
      const preference = new Preference(mpConfig);
      const response = await preference.create({
        body: {
          items: [
            {
              id: 'item-ID-1234',
              title: title || 'Item Cósmico',
              quantity: quantity || 1,
              unit_price: Number(price) || 10,
              currency_id: 'BRL',
            }
          ],
          metadata: {
            sellerName
          },
          external_reference: userId.toString(), 
          back_urls: {
            success: 'https://ais-dev.run.app/success',
            failure: 'https://ais-dev.run.app/failure',
            pending: 'https://ais-dev.run.app/pending'
          },
          auto_return: 'approved',
          notification_url: 'https://ais-dev.run.app/api/payments/webhook' // simulated webhook
        }
      });
      
      // Armazenamos a transação pendente para rastreio
      try {
        if (!useFallback) {
          await query("INSERT INTO transactions (user_id, type, amount, title, status) VALUES ($1, $2, $3, $4, $5)", [userId, 'compra', price, title, 'pendente']);
        } else {
          fallbackDB.transactions.push({ id: fallbackDB.transactions.length + 1, user_id: Number(userId), type: 'compra', amount: Number(price), title, status: 'pendente', date: new Date().toISOString() });
        }
      } catch (e) {
        console.error("Transação de checkout fallback log error", e);
      }

      res.json({ init_point: response.init_point, preferenceId: response.id });
    } catch (error) {
      console.error('Error creating MP preference:', error);
      res.status(500).json({ error: 'Erro ao gerar checkout do mercado pago' });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const { type, data } = req.body;
      // Trata as notificações do Mercado Pago (IPN)
      if (type === 'payment' && data && data.id) {
        // Suponha que, no modelo real, vamos buscar a payment_info via API do MP para obter "external_reference"
        // Simulando que identificamos a referência externa = 1, atualizando is_paid.
        const assumedUserId = 1; 

        if (useFallback) {
           const u = fallbackDB.users.find(u => u.id === assumedUserId);
           if (u) u.is_paid = true;
           // Atualiza uma transação pendente aleatória (mock)
           const tx = fallbackDB.transactions.find(t => t.user_id === assumedUserId && t.status === 'pendente');
           if (tx) tx.status = 'concluído';
        } else {
           await query("UPDATE users SET is_paid = true WHERE id = $1", [assumedUserId]);
           await query("UPDATE transactions SET status = 'concluído' WHERE user_id = $1 AND status = 'pendente'", [assumedUserId]);
        }
        return res.status(200).send("OK");
      }
      res.status(200).send("OK");
    } catch (e) {
      console.error("IPN Error", e);
      res.status(200).send("ERROR");
    }
  });

  app.get("/api/payments/transactions", async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Não autorizado' });
    try {
      if (useFallback) {
         return res.json({ transactions: fallbackDB.transactions.filter(t => t.user_id === Number(userId)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) });
      }
      const dbTx = await query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC", [userId]);
      return res.json({ transactions: dbTx.rows });
    } catch (e) {
       console.error("Erro ao buscar extrato", e);
       return res.status(500).json({ error: 'Falha ao buscar as transações da carteira oracular' });
    }
  });
  
  app.get("/api/payments/validate-credentials", async (req, res) => {
     // Helper para validar o token no ambiente da Vercel / Cloud Run
     const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
     if (!mpAccessToken || mpAccessToken.includes('TEST-1234567890')) {
       return res.json({ status: 'unconfigured', message: 'Recomendamos injetar as chaves reais de sandbox/produção no arquivo .env para processamentos interligados.' });
     }
     return res.json({ status: 'configured', message: 'Credenciais do MP lidas e prontas para ambiente interligado.' });
  });

  app.post("/api/payments/withdraw", async (req, res) => {
    try {
      const { amount, pixKey, type } = req.body;
      const userId = req.headers['x-user-id'];
      
      if (!amount || !pixKey) {
        return res.status(400).json({ error: 'Dados incompletos para saque.' });
      }

      // 1. Validar se a chave PIX está com formato correto
      let isValidPixUrl = false;
      if (type === 'cpf') isValidPixUrl = /^\d{11}|\d{14}$/.test(pixKey.replace(/\D/g, ''));
      else if (type === 'email') isValidPixUrl = /^\S+@\S+\.\S+$/.test(pixKey);
      else if (type === 'phone') isValidPixUrl = /^\+?\d{10,}$/.test(pixKey.replace(/[\s()-]/g, ''));
      else if (type === 'random') isValidPixUrl = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey);
      
      if (!isValidPixUrl) {
         return res.status(400).json({ error: `Chave PIX via ${type.toUpperCase()} possui fomato inválido.` });
      }

      // 2. Verificar saldo
      // Num caso real consultaríamos o banco; vamos assumir saldo "fictício" validado para fins de teste MVP, 
      // e registrar o repasse subtraindo
      const amountNum = Number(amount);
      
      // Registra a transferência na lista de transactions
      if (useFallback) {
         fallbackDB.transactions.push({ id: fallbackDB.transactions.length + 1, user_id: Number(userId), type: 'saque', amount: amountNum, title: 'Saque Mercado Pago PIX (Repasse)', status: 'pendente', date: new Date().toISOString() });
      } else {
         await query("INSERT INTO transactions (user_id, type, amount, title, status) VALUES ($1, $2, $3, $4, $5)", [userId, 'saque', amountNum, 'Saque Mercado Pago PIX', 'pendente']);
      }
      
      console.log(`[PIX] Saque de R$${amount} (PIX: ${pixKey} / ${type}), Usuário ID ${userId}`);
      res.json({ success: true, message: 'Transferência de repasse PIX agendada via Mercado Pago na carteira e entrará em processamento.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro profundo ao processar repasse de saque.' });
    }
  });

  // --- Global API Error & 404 Handlers ---
  // Ensure that API routes never return HTML to prevent JSON parsing errors on the frontend.
  app.use('/api', (req, res) => {
    res.status(404).json({ error: `API não encontrada: ${req.method} ${req.url}` });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.error("[API Error Catch-All]:", err);
      res.status(err.status || 500).json({ error: err.message || "Erro Interno no Servidor Astral" });
    } else {
      next(err);
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Astral Server] Servidor flutuando na porta ${PORT}`);
  });
}

startServer();
