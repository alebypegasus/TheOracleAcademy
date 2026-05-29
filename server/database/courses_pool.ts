import pg from "pg";

const { Pool } = pg;

let _coursesPool: pg.Pool | null = null;

export function initCoursesPool() {
  if (_coursesPool) return _coursesPool;
  _coursesPool = new Pool({
    connectionString: process.env.COURSES_DATABASE_URL || "postgresql://postgres:oracle2024@127.0.0.1:5432/oracle_courses",
  });
  return _coursesPool;
}

export function getCoursesPool(): pg.Pool {
  if (!_coursesPool) initCoursesPool();
  return _coursesPool!;
}

export const coursesPool = {
  connect: () => getCoursesPool().connect(),
  query: (text: string, values?: any[]) => getCoursesPool().query(text, values),
  end: () => getCoursesPool().end(),
};

export let useCoursesFallback = false;

// Separate in-memory fallback database specifically for courses
export const fallbackCoursesDB: {
  courses: any[];
  course_node_contents: any[];
} = {
  courses: [],
  course_node_contents: []
};

// Returns premium, meticulously structured seed markdown for each step in Module 0 (0.1 to 0.6)
export function getSeedMarkdown(nodeId: string, stepId: number): string {
  const nodeNames: Record<string, string> = {
    'fund-espirito': 'Natureza da Espiritualidade',
    'fund-magia': 'Estrutura da Magia',
    'fund-altares': 'Altares e Consagração'
  };

  const name = nodeNames[nodeId] || nodeId.replace(/-/g, " ");

  const mockSourcesAndLocations = `

### 📚 Fontes e Aprofundamento

**Fontes Autorais (Exatamente 3):**
1. *Corpus Hermeticum* - Atribuído a Hermes Trismegisto (A base filosófica do hermetismo antigo e a egrégora da manifestação cósmica).
2. *Enéadas* - Plotino (A exploração filosófica e mística do Uno, da Alma do Mundo e o reflexo fractal do micro no macrocosmo).
3. *De Mysteriis Aegyptiorum* - Jâmblico (O tratado clássico sobre a Teurgia antiga, a prática do ritual sagrado e a calibração elemental).

**Locais de Estudo e Pesquisa (Exatamente 10):**
1. **Bibliotheca Philosophica Hermetica, Amsterdã:** O maior acervo físico e digital do mundo focado em misticismo, alquimia e hermetismo clássico.
2. **Templo de Ísis em Philae, Egito:** Centro de egrégora ritualística ancestral focado na iniciação e consagração dos mistérios femininos e estelares.
3. **Seção de Manuscritos da Bodleian Library, Oxford:** Acervo insubstituível que contém tratados teológicos originais e grimórios clássicos medievais.
4. **Galeria de Amuletos do British Museum, Londres:** Exposição arqueológica física e tours digitais sobre sigilografia gnóstica, magia ptolomaica e egípcia.
5. **Acervo de Obras Raras da Sociedade Teosófica, Adyar (Índia):** Artigos profundos e manuscritos sobre a evolução dos planos cósmicos e energia sutil.
6. **Bibliothèque Nationale de France, Paris:** Arquivo contendo versões originais das clavículas salomônicas e grimórios clássicos de teurgia.
7. **Santuário e Oráculo de Delfos, Grécia:** Estudo antropológico e físico das câmaras de sintonização e transmutação mediúnica ancestral.
8. **Grande Templo da Ordem Rosacruz AMORC, Curitiba:** Espaço ritual estruturado para o estudo e a prática da calibração sutil dos elementos materiais.
9. **Biblioteca Apostólica Vaticana, Roma:** O repositório fechado mais enigmático de textos heréticos, códices gnósticos e segredos suprimidos.
10. **Acervo Hermético da The Oracle Academy Library:** Nosso ecossistema de grimórios virtuais focados na evolução teológica do buscador oracular.`;

  if (stepId === 1) {
    return `# 0.1. Teoria e Fundamentos: ${name}

### 🌌 1. Contexto Histórico e Cosmologia Hermética
A história de ${name} remonta aos albores da autoconsciência humana, enraizando-se nos ritos xamânicos paleolíticos e na subsequente filosofia desenvolvida no Egito Alexandrino. Quando Plotino postulou a emanação cósmica, ele descreveu um fluxo sutil e inteligível que conecta a realidade primordial ao plano terrestre. Esta egrégora representa o portal de transição entre o caos material e o logos sutil. 

Para compreender ${name}, o operador deve se despir dos dogmas limitantes e abraçar a *Teurgia* — a ciência da união divina através da experiência ritual empírica. Enquanto as religiões profanas confiam a revelação a intermediários burocráticos, o hermetismo e a mística oculta exigem que o próprio operador se erija como o templo vivo.

### 📜 2. Os Pilares Metafísicos da Prática
* **A Lei do Aterramento Físico (*Grounding*):** O espírito e o éter só se estruturam onde há consistência material e corporal. Sem estabilidade física e psíquica, a invocação das forças mentais gera dissociação mental e enfraquecimento orgânico.
* **A Lei da Intencionalidade Indestrutível (*Thelema*):** A vontade consciente atua como o dínamo direcionador que molda o éter caótico em formas de manifestação objetivas.
* **A Lei da Polaridade Dinâmica:** O cosmos opera em polaridades flutuantes de atração e repulsão energética. Calibrar estas forças é o primeiro segredo da consagração.

### 🏛️ 3. Aprofundamento no Saber Oculto
Este saber exige que o estudante dedique horas de meditação sobre o trânsito sutil. A egrégora cósmica se expande conforme a pureza intelectual se consolida. Compreender os fundamentos herméticos impede que a mente profana caia no abismo da superstição cega e da ingenuidade simbólica.

O buscador autêntico deve compreender que a sintonização elemental não é um ato de fantasia poética, mas um alinhamento sutil das frequências do éter celular com as correntes eletromagnéticas do universo.${mockSourcesAndLocations}`;
  }

  if (stepId === 2) {
    return `# 0.2. Prática Guiada: ${name}

### 🕯️ 1. Preparação Física e Ritualística
Antes de iniciar qualquer prática ritualística ligada a ${name}, o operador deve purificar seu quadrante físico e alinhar sua estrutura biológica. 
* **Aterramento Inicial:** Descalce-se e sinta a gravidade puxando seus calcanhares para o centro denso da Terra.
* **Purificação do Espaço:** Utilize fumaça de incenso natural ou uma infusão de ervas de banimento (alecrim ou sálvia) em sentido anti-horário ao redor do seu assento.

### 💨 2. A Calibração da Respiração (Pranayama Hermético)
Sente-se de maneira ereta, com a coluna livre e os ombros relaxados. Execute a respiração clássica de quatro tempos:
1. **Inalação:** Puxe o éter pelas narinas contando 4 segundos (visualize luz violeta preenchendo as células).
2. **Retenção Cheia:** Mantenha o ar no pulmão por 4 segundos, selando a força vital.
3. **Exalação:** Solte o ar suavemente pela boca por 4 segundos, descarregando tensões profanas.
4. **Retenção Vazia:** Permaneça sem ar por 4 segundos, integrando o silêncio do abismo cósmico.
*Repita este ciclo por exatamente 10 voltas antes de avançar para a sintonização.*

### 🧘 3. Rito de Sintonização de ${name}
1. Projete mentalmente uma coluna dourada subindo do núcleo da Terra, atravessando sua coluna vertebral.
2. Sintonize seu foco na egrégora ativa do Módulo. Deixe que a energia sutil o envolva por completo.
3. Permaneça em contemplação silenciosa, anotando as variações da percepção sutil em sua mente.${mockSourcesAndLocations}`;
  }

  if (stepId === 3) {
    return `# 0.3. Erros Comuns: ${name}

### ⚠️ 1. Desvios Ritualísticos e Psicológicos
Na jornada da evolução ocultista, o operador de ${name} enfrenta severos riscos decorrentes do ego inflado e da falta de calibração pragmática. Abaixo estão os desvios mais nocivos identificados pelas egrégoras tradicionais:

* **Ignorar o Aterramento (*Spiritual Bypass*):** Tentar acoplar e canalizar energias de alta vibração astral sem ter estabilidade material, financeira ou saúde física. Isso resulta em séria dissociação mental, fanatismo irracional e fraqueza psíquica.
* **Materialismo Esotérico:** Crença de que a eficácia do rito depende do custo ou da quantidade de instrumentos e cristais no altar. O único templo autêntico é a mente do operador; as ferramentas são meros espelhos e dínamos auxiliares.
* **Exposição de Força (Quebra do Silêncio):** Comentar ou mostrar seus sigilos e metas esotéricas para pessoas céticas. A interferência mental alheia funciona como contaminação energética, dissipando o acúmulo vibracional.

### 🛡️ 2. Protocolo de Banimento e Calibração
Se sentir dispersão mental ou fadiga severa após a sintonização de ${name}, execute imediatamente a lavagem das mãos com água corrente e sal grosso, seguida por 5 minutos de respiração de aterramento. A sobriedade intelectual é o melhor escudo contra fantasias irracionais.${mockSourcesAndLocations}`;
  }

  if (stepId === 4) {
    return `# 0.4. Visão Crítica: ${name}

### 🔍 1. Perspectiva Cética e Sociológica
Embora a egrégora esotérica confira um véu místico a ${name}, a análise científica e sociológica contemporânea oferece um entendimento crucial para que o buscador não caia na armadilha da alienação cognitiva. A psicologia junguiana descreve estas práticas como projeções ativas dos arquétipos do *Inconsciente Coletivo*. 

Ao ritualizar a intuição ou a consagração, o cérebro humano acessa estados alterados de consciência que ativam a egrégora de foco extremo, mimetizando padrões que o ocultismo clássico rotulava como "trânsito astral". Sociologicamente, tais práticas também funcionam como mecanismos de coesão comunitária e criação de identidade.

### 🧠 2. Desmistificação Científica
A neurociência cognitiva demonstra que a meditação de aterramento sintoniza as ondas cerebrais nas frequências Alfa e Teta, propiciando um aumento na flexibilidade cognitiva e na redução do cortisol. O operador moderno deve saber integrar a poesia sagrada do rito esotérico com a clareza da psicologia contemporânea, mantendo o discernimento afiado e o intelecto livre de dogmatismos cegos.${mockSourcesAndLocations}`;
  }

  if (stepId === 5) {
    return `# 0.5. Exercícios Práticos: ${name}

Abaixo estão **exatamente 10 exercícios detalhados** para fixação teórica e ritualística de ${name}. Cada um deve ser executado com foco e registrado em seu Grimório digital.

1. **Exercício da Presença Aterrada:** Permaneça 5 minutos de olhos fechados sentindo a planta dos pés e a gravidade terrestre. *Objetivo:* Neutralizar a dissociação psíquica.
2. **Exercício do Fluxo Hermético:** Execute 10 respirações em 4 tempos em um ambiente silencioso. *Objetivo:* Harmonizar as frequências bioenergéticas.
3. **Exercício de Banimento do Ruído:** Escreva uma preocupação profana em um papel e rasgue-o sob a chama de uma vela consagrada. *Objetivo:* Limpar o canal mental.
4. **Exercício do Cubo de Metatron:** Desenhe o selo sagrado e concentre seu foco no centro geométrico dele por 3 minutos. *Objetivo:* Expandir a visão espacial e mental.
5. **Exercício da Correspondência Cósmica:** Liste 3 eventos materiais recentes e descreva a egrégora interna ou padrão de pensamento que os atraiu. *Objetivo:* Validar a Lei da Correspondência.
6. **Exercício do Silêncio Protetor:** Mantenha um segredo oracular por 24 horas consecutivas sem comentá-lo com ninguém. *Objetivo:* Desenvolver a contenção energética.
7. **Exercício de Sintonização de Altar:** Limpe seu altar elemental com álcool e acenda uma vela simples ao sul, consagrando o espaço. *Objetivo:* Praticar a delimitação do sagrado.
8. **Exercício da Polaridade Reversa:** Quando sentir medo ou carência, feche os olhos e force mentalmente a egrégora de coragem e prosperidade. *Objetivo:* Alterar a polaridade interna.
9. **Exercício do Diário Astral:** Anote 3 percepções intuitivas que você teve durante o dia em seu grimório eletrônico. *Objetivo:* Treinar a sensibilidade sutil.
10. **Exercício do Selamento Final:** Faça uma saudação formal em frente ao seu micro-altar elemental declarando concluída sua jornada neste degrau. *Objetivo:* Integrar o saber à matéria.${mockSourcesAndLocations}`;
  }

  return `# 0.6. Avaliação com IA: ${name}

### 🎓 Preparação para a Sabedoria Cósmica
Parabéns, buscador! Você concluiu todos os pilares teóricos, práticos, críticos e de erros comuns sobre **${name}**. 

Agora, a sua mente e a sua intuição serão postas à prova. O Mentor Inteligente da Inteligência Artificial avaliará a sua assimilação intelectual e espiritual. Prepare-se para responder ao chat oracular com seriedade, profundidade acadêmica e sinceridade íntima.

*Revise seus conceitos antes de invocar o Mentor.*${mockSourcesAndLocations}`;
}

// Initialize courses tables and seed Module 0 in the separate database
export async function initCoursesDB() {
  try {
    // Test connection
    const client = await coursesPool.connect();
    console.log("[Courses DB] Connected to PostgreSQL course database successfully!");
    
    // Create courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'publicado',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create course_node_contents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_node_contents (
        id SERIAL PRIMARY KEY,
        node_id TEXT UNIQUE NOT NULL,
        course_id INTEGER,
        markdown_content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- SEED SEPARATE DB ---
    // 1. Seed courses catalog if empty
    const checkCourses = await client.query("SELECT COUNT(*) FROM courses");
    if (parseInt(checkCourses.rows[0].count, 10) === 0) {
      console.log("[Courses DB Seed] Seeding main course catalog...");
      const defaultCourseContent = [
        {
          level: 0,
          title: 'Módulo 0 — Fundamentos',
          desc: 'Obrigatório antes de qualquer oráculo. Evita prática superficial e confusão simbólica. Aprenda a base.',
          unlocked: true,
          bgGlow: 'bg-amber-500',
          nodes: [
            { id: 'fund-espirito', name: 'Natureza da Espiritualidade', desc: 'Espiritualidade, religião e ocultismo', icon: 'Crown', color: 'text-amber-400', tailwindColor: 'bg-amber-500' },
            { id: 'fund-magia', name: 'Estrutura da Magia', desc: 'Visão histórica, antropológica e correntes', icon: 'Sparkles', color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
            { id: 'fund-altares', name: 'Altares e Consagração', desc: 'Como montar, consagrar ritualística e proteção', icon: 'Flame', color: 'text-rose-400', tailwindColor: 'bg-rose-500' },
          ]
        },
        {
          level: 1,
          title: 'Nível 1 — Oráculos Intuitivos',
          desc: 'Pouca estrutura, foco em percepção. Onde se aprende que intuição não é fantasia.',
          unlocked: true,
          bgGlow: 'bg-orange-500',
          nodes: [
            { id: 'leitura-velas', name: 'Leitura de Velas e Fumaça', desc: 'Piromancia, queima ritual, padrões', icon: 'Flame', color: 'text-orange-400', tailwindColor: 'bg-orange-500' },
            { id: 'leitura-agua', name: 'Água e Sombras', desc: 'Hidromancia, reflexos, visões', icon: 'Droplets', color: 'text-cyan-400', tailwindColor: 'bg-cyan-500' },
            { id: 'leitura-sorteios', name: 'Acaso e Pêndulo', desc: 'Dados, bibliomancia, radiestesia', icon: 'CircleDot', color: 'text-emerald-400', tailwindColor: 'bg-emerald-500' },
          ]
        },
        {
          level: 2,
          title: 'Nível 2 — Oráculos Simbólicos',
          desc: 'Sistemas leves e estruturados. Entra a disciplina interpretativa.',
          unlocked: true,
          bgGlow: 'bg-indigo-500',
          nodes: [
            { id: 'lenormand-kipper', name: 'Lenormand e Kipper', desc: 'Cartas objetivas e narrativa social', icon: 'BookOpen', color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
            { id: 'runas-ogham', name: 'Runas e Ogham', desc: 'Sistemas nórdicos e celtas, alfabetos mágicos', icon: 'Feather', color: 'text-sky-400', tailwindColor: 'bg-sky-500' },
            { id: 'sibilla', name: 'Sibilla Italiana', desc: 'Narrativa emocional e prática de leitura', icon: 'Eye', color: 'text-pink-400', tailwindColor: 'bg-pink-500' },
          ]
        }
      ];

      await client.query(
        "INSERT INTO courses (title, description, content, author, status) VALUES ($1, $2, $3, 'Admin', 'publicado')",
        ['Saga Oracular - Trilha do Iniciado', 'Trilha fundamental do buscador para compreender as correspondências simbólicas do universo.', JSON.stringify(defaultCourseContent)]
      );
    }

    // Get course id (will be 1 or similar)
    const courseIdRes = await client.query("SELECT id FROM courses LIMIT 1");
    const courseId = courseIdRes.rows[0]?.id || 1;

    // Seed the 3 nodes of Module 0, each having 6 sub-steps!
    const nodes = ['fund-espirito', 'fund-magia', 'fund-altares'];
    for (const nodeId of nodes) {
      for (let stepId = 1; stepId <= 6; stepId++) {
        const fullNodeId = `${nodeId}-step-${stepId}`;
        const checkContent = await client.query("SELECT COUNT(*) FROM course_node_contents WHERE node_id = $1", [fullNodeId]);
        if (parseInt(checkContent.rows[0].count, 10) === 0) {
          const markdown = getSeedMarkdown(nodeId, stepId);
          await client.query(
            "INSERT INTO course_node_contents (node_id, course_id, markdown_content) VALUES ($1, $2, $3)",
            [fullNodeId, courseId, markdown]
          );
        }
      }
    }

    console.log("[Courses DB Seed] All separate courses DB seeds loaded successfully!");
    client.release();
  } catch (err) {
    console.warn("[Courses DB] Connection failed, switching to fallback courses DB:", (err as Error).message);
    useCoursesFallback = true;
    seedFallbackDB();
  }
}

// Populates the in-memory fallbackCoursesDB with exact same premium seeded data
function seedFallbackDB() {
  console.log("[Courses Fallback Seed] Seeding in-memory courses DB...");
  const defaultCourseContent = [
    {
      level: 0,
      title: 'Módulo 0 — Fundamentos',
      desc: 'Obrigatório antes de qualquer oráculo. Evita prática superficial e confusão simbólica. Aprenda a base.',
      unlocked: true,
      bgGlow: 'bg-amber-500',
      nodes: [
        { id: 'fund-espirito', name: 'Natureza da Espiritualidade', desc: 'Espiritualidade, religião e ocultismo', icon: 'Crown', color: 'text-amber-400', tailwindColor: 'bg-amber-500' },
        { id: 'fund-magia', name: 'Estrutura da Magia', desc: 'Visão histórica, antropológica e correntes', icon: 'Sparkles', color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
        { id: 'fund-altares', name: 'Altares e Consagração', desc: 'Como montar, consagrar ritualística e proteção', icon: 'Flame', color: 'text-rose-400', tailwindColor: 'bg-rose-500' },
      ]
    },
    {
      level: 1,
      title: 'Nível 1 — Oráculos Intuitivos',
      desc: 'Pouca estrutura, foco em percepção. Onde se aprende que intuição não é fantasia.',
      unlocked: true,
      bgGlow: 'bg-orange-500',
      nodes: [
        { id: 'leitura-velas', name: 'Leitura de Velas e Fumaça', desc: 'Piromancia, queima ritual, padrões', icon: 'Flame', color: 'text-orange-400', tailwindColor: 'bg-orange-500' },
        { id: 'leitura-agua', name: 'Água e Sombras', desc: 'Hidromancia, reflexos, visões', icon: 'Droplets', color: 'text-cyan-400', tailwindColor: 'bg-cyan-500' },
        { id: 'leitura-sorteios', name: 'Acaso e Pêndulo', desc: 'Dados, bibliomancia, radiestesia', icon: 'CircleDot', color: 'text-emerald-400', tailwindColor: 'bg-emerald-500' },
      ]
    },
    {
      level: 2,
      title: 'Nível 2 — Oráculos Simbólicos',
      desc: 'Sistemas leves e estruturados. Entra a disciplina interpretativa.',
      unlocked: true,
      bgGlow: 'bg-indigo-500',
      nodes: [
        { id: 'lenormand-kipper', name: 'Lenormand e Kipper', desc: 'Cartas objetivas e narrativa social', icon: 'BookOpen', color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
        { id: 'runas-ogham', name: 'Runas e Ogham', desc: 'Sistemas nórdicos e celtas, alfabetos mágicos', icon: 'Feather', color: 'text-sky-400', tailwindColor: 'bg-sky-500' },
        { id: 'sibilla', name: 'Sibilla Italiana', desc: 'Narrativa emocional e prática de leitura', icon: 'Eye', color: 'text-pink-400', tailwindColor: 'bg-pink-500' },
      ]
    }
  ];

  fallbackCoursesDB.courses = [{
    id: 1,
    title: 'Saga Oracular - Trilha do Iniciado',
    description: 'Trilha fundamental do buscador para compreender as correspondências simbólicas do universo.',
    content: defaultCourseContent,
    author: 'Admin',
    status: 'publicado',
    created_at: new Date().toISOString()
  }];

  const nodes = ['fund-espirito', 'fund-magia', 'fund-altares'];
  for (const nodeId of nodes) {
    for (let stepId = 1; stepId <= 6; stepId++) {
      const fullNodeId = `${nodeId}-step-${stepId}`;
      const markdown = getSeedMarkdown(nodeId, stepId);
      fallbackCoursesDB.course_node_contents.push({
        id: fallbackCoursesDB.course_node_contents.length + 1,
        node_id: fullNodeId,
        course_id: 1,
        markdown_content: markdown,
        is_seed: true,  // Mark as seed so AI can replace it later
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }
  console.log("[Courses Fallback Seed] In-memory courses DB seeded successfully!");
}

// Separate query executor for courses database
export async function coursesQuery(text: string, params?: any[]): Promise<any> {
  if (!useCoursesFallback) {
    try {
      return await coursesPool.query(text, params);
    } catch (err) {
      console.error("[Courses DB Query Error]:", err);
      throw err;
    }
  }

  // Fallback DB Emulator specifically for courses
  const norm = text.toLowerCase().trim();
  
  // 1. SELECT * FROM courses ORDER BY created_at DESC
  if (norm.includes('from courses') && norm.includes('order by created_at desc')) {
    return { rows: [...fallbackCoursesDB.courses].sort((a, b) => b.created_at.localeCompare(a.created_at)) };
  }

  // 2. SELECT * FROM courses WHERE id = $1
  if (norm.includes('from courses where id =')) {
    const id = Number(params?.[0]);
    const match = fallbackCoursesDB.courses.find(c => c.id === id);
    return { rows: match ? [match] : [] };
  }

  // 3. SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 1
  if (norm.includes('from courses where title ilike') || norm.includes('description ilike')) {
    const term = (params?.[0] as string || "").replace(/%/g, "").toLowerCase();
    const match = fallbackCoursesDB.courses.find(c => 
      c.title.toLowerCase().includes(term) || 
      c.description.toLowerCase().includes(term)
    );
    return { rows: match ? [match] : [] };
  }

  // 4. INSERT INTO courses
  if (norm.includes('insert into courses')) {
    const title = params?.[0];
    const description = params?.[1];
    const content = params?.[2];
    const author = params?.[3] || 'IA';
    const status = params?.[4] || 'gerado';
    
    const newCourse = {
      id: fallbackCoursesDB.courses.length + 1,
      title,
      description,
      content: typeof content === 'string' ? JSON.parse(content) : content,
      author,
      status,
      created_at: new Date().toISOString()
    };
    fallbackCoursesDB.courses.push(newCourse);
    return { rows: [newCourse] };
  }

  // 5. SELECT * FROM course_node_contents WHERE node_id = $1
  if (norm.includes('from course_node_contents where node_id =')) {
    const nodeId = params?.[0];
    const match = fallbackCoursesDB.course_node_contents.find(cnc => cnc.node_id === nodeId);
    return { rows: match ? [match] : [] };
  }

  // 6. INSERT INTO course_node_contents
  if (norm.includes('insert into course_node_contents')) {
    const nodeId = params?.[0];
    const courseId = params?.[1];
    const markdownContent = params?.[2];
    
    let match = fallbackCoursesDB.course_node_contents.find(cnc => cnc.node_id === nodeId);
    if (match) {
      match.markdown_content = markdownContent;
      match.updated_at = new Date().toISOString();
      return { rows: [match] };
    } else {
      const newCnc = {
        id: fallbackCoursesDB.course_node_contents.length + 1,
        node_id: nodeId,
        course_id: Number(courseId || 1),
        markdown_content: markdownContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      fallbackCoursesDB.course_node_contents.push(newCnc);
      return { rows: [newCnc] };
    }
  }

  return { rows: [] };
}
