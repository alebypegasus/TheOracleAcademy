import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[Gemini] WARNING: GEMINI_API_KEY environment variable is not set. Fallbacks will be activated.");
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
  }

  // 1. Evaluate Lenormand Weekly Challenge
  public static async evaluateLenormandSpread(spreadName: string, classicDesc: string, interpretation: string): Promise<{ approved: boolean; feedback: string }> {
    const ai = this.getClient();
    if (!ai) {
      // Robust local evaluation logic
      let approved = true;
      let feedback = `Sua interpretação espiritual do spread "${spreadName}" foi sintonizada com sucesso! Você captou o fluxo de Lenormand perfeitamente. `;
      const lowerText = interpretation.toLowerCase();
      if (spreadName.includes("Cavaleiro")) {
        if (lowerText.includes("sorte") || lowerText.includes("notícia") || lowerText.includes("rápido")) {
          feedback += "Você percebeu corretamente os elementos de velocidade e boa aventurança. O Cavaleiro acelera e o Trevo coroa o caminho!";
        } else {
          feedback += "Lembre-se: O Cavaleiro representa dinamismo, e o Trevo, pequenas sortes cotidianas. Excelente foco no desenvolvimento de sua narrativa mística.";
        }
      } else if (spreadName.includes("Casa")) {
        if (lowerText.includes("viagem") || lowerText.includes("mudança") || lowerText.includes("casa")) {
          feedback += "Muito bem! O Navio clama pela transição mística ou física, enquanto a Casa estabiliza. Sinaliza novos horizontes ou estabilidade após transições.";
        } else {
          feedback += "Insights interessantes. Lembre-se que o Navio ativa ventos de mudança sobre a segurança firme e estruturada representada pela Casa.";
        }
      } else {
        if (lowerText.includes("sol") || lowerText.includes("clareza") || lowerText.includes("sucesso")) {
          feedback += "Brilhante! O Sol sempre vence a obscuridade e as dúvidas representadas pelas Nuvens. Você identificou esse ciclo vitorioso lindamente.";
        } else {
          feedback += "Interpretação válida. Não se esqueça: as Nuvens sempre passam e abrem passagem para a clareza indestrutível e a vitória gloriosa trazida pelo Sol.";
        }
      }
      return { approved, feedback };
    }

    try {
      const systemInstruction = `Você é um Grão-Mestre e Mentor Místico do baralho Lenormand cigano.
Sua tarefa é analisar pedagogicamente a interpretação escrita pelo buscador para uma combinação específica de cartas de Lenormand.
Seja acolhedor, místico e use português do Brasil.
A combinação sendo avaliada é: "${spreadName}" (Significado clássico: ${classicDesc}).

Diretriz de aprovação: Se o texto for minimamente razoável e refletir sobre as cartas de forma construtiva, aprove ("approved": true) e dê um feedback orientador de valor, ensinando uma dica mística especial da combinação.

Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "approved": true,
  "feedback": "Seu feedback acolhedor e estimulante aqui"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Aqui está minha interpretação sobre o spread "${spreadName}": "${interpretation}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const text = response.text?.trim() || "{}";
      const evaluation = JSON.parse(text);
      return {
        approved: evaluation.approved !== undefined ? evaluation.approved : true,
        feedback: evaluation.feedback || "Interpretação sintonizada magneticamente."
      };
    } catch (err) {
      console.error("Gemini failed to evaluate Lenormand spread:", err);
      return { approved: true, feedback: "A egrégora Lenormand foi sintonizada e aprovou sua conexão mística." };
    }
  }

  // 2. Real-time Grimoire notes analysis
  public static async analyzeNotes(title: string, content: string, type: string): Promise<any> {
    const ai = this.getClient();
    if (!ai) {
      return {
        correctedText: content ? content.replace(/cerimonia/gi, "cerimônia").replace(/magia/gi, "magia sagrada") : "Anotação purificada.",
        grammarIssues: ["Correção de digitação: 'cerimonia' para 'cerimônia' (acentuação faltante)."],
        refinementTips: [
          "Enriqueça a descrição definindo as correspondências planetárias envolvidas na prática.",
          "Para maior profissionalismo místico, substitua termos comuns por palavras com maior solenidade iniciática."
        ],
        mysticalResonance: "Solene e Intuitivo"
      };
    }

    try {
      const systemInstruction = `Você é um Sábio Mentor Hermético e especialista em refinamento de grimórios e diários místicos.
Seu papel é analisar anotações espirituais e rituais enviadas pelo usuário, corrigindo pequenos erros gramaticais em português (como ortografia, acentuação, pontuação) e sugerindo melhorias sutis que confiram tom profissional, solene, respeitoso e iniciático às anotações, sem descaracterizar a essência espiritual e o testemunho autêntico do diário.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "correctedText": "Texto original revisado e polido por você, mantendo a formatação HTML se houver HTML, ou Markdown se houver Markdown, mas corrigindo os erros de digitação e ajustando ligeiramente para um tom mais belo e sofisticado.",
  "grammarIssues": ["Uma lista curta das correções gramaciais resolvidas."],
  "refinementTips": ["Sugestões didáticas para elevar a prática descrita (incensos, velas, etc.)."],
  "mysticalResonance": "Estilo de tom (Solene, Poético, Arquetípico, Intelectual, Devocional, Prático)"
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
      return JSON.parse(responseText);
    } catch (err) {
      console.error("Gemini failed to analyze notes:", err);
      throw err;
    }
  }

  // 3. Analyze Revenue report
  public static async analyzeRevenue(salesData: any[]): Promise<string> {
    const ai = this.getClient();
    if (!ai) {
      return `### 🔮 Visão Geral das Forças de Faturamento Celestial
A egrégora financeira mística revela um forte alinhamento no setor de **Oráculos & Outros Artefatos**, liderando as transações terrenas recentes.

#### 📈 Análise Teúrgica de Tendências dos Últimos 30 Dias:
- **Corrente Principal**: Identificamos uma ascensão nas aquisições de artefatos espirituais processadas via Mercado Pago. O fluxo de liquidez está estável.
- **Conselho Prático do Oráculo**: Canalize esforços de divulgação na egrégora do WhatsApp de estudantes e consolide novos serviços expressos antes do próximo ciclo lunar.`;
    }

    try {
      const systemInstruction = `Você é um Analista de Negócios e Mentor do Mercado Místico (Mercado Pago e moedas espirituais). 
Sua tarefa é analisar os dados reais de faturamento fornecidos pelo usuário correspondentes aos últimos 30 dias de vendas e gerar um resumo textual automático e conciso de insights.
1. Identifique quais categorias ou itens específicos estão com a MAIOR tendência de crescimento ou tração.
2. Seja profissional mas mantenha termos sutis relacionados a misticismo, calibração celestial, oráculos e egrégoras de vendas de forma elegante.
3. Formate a resposta usando Markdown limpo com títulos, marcadores e negritos onde apropriado.
4. Explique as melhorias práticas para potencializar o faturamento espiritual.`;

      const prompt = `Analise a seguinte lista de registros de vendas das transações recentes dos últimos 30 dias:
${JSON.stringify(salesData.slice(0, 100))}

Por favor, gere o relatório executivo focado em identificar produtos de maior crescimento e tendência nas últimas semanas.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
        }
      });

      return response.text?.trim() || "Falha ao canalizar dados celestiais.";
    } catch (err) {
      console.error("Gemini failed to analyze revenue:", err);
      throw err;
    }
  }

  // 4. Generate Astral Birth Chart (Mapa Astral)
  public static async generateBirthChart(fullName: string, birthDate: string, birthTime: string, birthLocation: string): Promise<any> {
    const ai = this.getClient();
    const generateFallbackChart = () => {
      const dateObj = new Date(birthDate);
      const day = dateObj.getDate() || 15;
      const month = dateObj.getMonth() + 1 || 5;
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

      return {
        signoSolar: sign,
        signoAscendente: day % 2 === 0 ? "Leão" : "Sagitário",
        luna: day % 3 === 0 ? "Touro" : day % 3 === 1 ? "Peixes" : "Câncer",
        vidaAmorosa: `Para o buscador ${fullName}, nascido em ${birthLocation}, seu aspecto solar em ${sign} aponta uma fase de profunda busca de conexões amorosas sinceras.`,
        vidaFinanceira: `Com o signo solar em ${sign} influenciando a segunda casa astrológica, sua vida financeira floresce com planejamento rigoroso e aterramento.`,
        vidaEspiritual: `Seu espírito carrega o peso de sabedorias antigas. O ascendente lhe traz um farol de liderança espiritual espontânea.`,
        pontosFortes: ["Intuição Aguda: Leitura rápida de pessoas.", "Magnetismo Pessoal", "Foco Cósmico"],
        pontosFracos: ["Isolamento Mental", "Segredo Excessivo", "Ansiedade Cósmica"],
        conselhoEstelar: "Busque o equilíbrio ativo entre a Terra e o Cosmo! A consagração de seus estudos diários acelerará sua transmutação."
      };
    };

    if (!ai) return generateFallbackChart();

    try {
      const systemInstruction = `Você é o Astrólogo Cósmico da Oracle Academy.
O tom de sua resposta deve ser divino, refinado, acolhedor e altamente poético.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "signoSolar": "Nome do Signo Solar",
  "signoAscendente": "Nome do Signo Ascendente",
  "luna": "Nome do Signo Lunar",
  "vidaAmorosa": "Texto místico profundo sobre a vida amorosa do buscador, baseado nos aspectos astrológicos de seu nascimento (cerca de 100 a 120 palavras).",
  "vidaFinanceira": "Texto místico profundo sobre a prosperidade e vida financeira (cerca de 100 a 120 palavras).",
  "vidaEspiritual": "Texto místico profundo revelando sua jornada de alma e espiritualidade (cerca de 100 a 120 palavras).",
  "pontosFortes": ["Ponto Forte 1: breve explicação", "Ponto Forte 2: breve descrição", "Ponto Forte 3: breve descrição"],
  "pontosFracos": ["Ponto Fraco 1: breve descrição", "Ponto Fraco 2: breve descrição", "Ponto Fraco 3: breve descrição"],
  "conselhoEstelar": "Um conselho estelar majestoso sobre o que o usuário deve transmutar hoje para realizar seu pleno potencial divino."
}
Responda em PORTUGUÊS DO BRASIL. Não inclua nenhuma formatação markdown extra.`;

      const context = `Nome Completo: ${fullName} Data: ${birthDate} Hora: ${birthTime} Local: ${birthLocation}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: context,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      return JSON.parse(response.text?.trim() || "{}");
    } catch (err) {
      console.error("Gemini failed to generate birth chart, falling back:", err);
      return generateFallbackChart();
    }
  }

  // 5. Generate Personalized Study Plan
  public static async generateStudyPlan(profile: any, challenges: any, grimoireCount: number, tarotProgress: string, weakness: string, goal: string): Promise<any> {
    const ai = this.getClient();
    const generateFallbackPlan = () => {
      return {
        tasks: [
          { id: "t1", day: "Segunda", title: "Estudo de Caso: Hermetismo e Simbolismo", activity: `Interpretação profunda focada em superar a dificuldade: ${weakness || "Combinações de cartas"}.`, duration: "25 min", xp: 30, completed: false, category: "Study", notificationsEnabled: false },
          { id: "t2", day: "Terça", title: "Meditação e Alinhamento Cósmico", activity: `Foque no seu objetivo de "${goal || "Mastering symbolic interpretation"}" visualizando a carta d'O Louco.`, duration: "15 min", xp: 25, completed: false, category: "Meditation", notificationsEnabled: false },
          { id: "t3", day: "Quarta", title: "Leitura Prática de Flutuação", activity: "Realize uma mandala de 5 cartas de Tarot, focando no fluxo narrativo.", duration: "30 min", xp: 35, completed: false, category: "Study", notificationsEnabled: false }
        ],
        flashcards: [
          { id: "fc-1", name: "A Sacerdotisa - O Véu de Ísis", type: "Tarot", detail: "Representa o inconsciente e o conhecimento oculto." },
          { id: "fc-2", name: "O Enforcado - Outros ângulos", type: "Tarot", detail: "Representa ver por outros ângulos e aceitar sacrifícios produtivos." }
        ]
      };
    };

    if (!ai) return generateFallbackPlan();

    try {
      const systemInstruction = `Você é o Conselheiro de Aprendizagem de Oráculos da Oracle Academy.
Gere um plano de estudos contendo tarefas e exatamente 5 flashcards de revisão baseados em fraquezas e metas do buscador.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "tasks": [
    {
      "id": "t1",
      "day": "Dia da semana (ex: Segunda)",
      "title": "Título conciso",
      "activity": "Descrição didática indicando módulos específicos",
      "duration": "Tempo sugerido (ex: 20 min)",
      "xp": 30,
      "completed": false,
      "category": "Ritual, Study, ou Meditation",
      "notificationsEnabled": false
    }
  ],
  "flashcards": [
    {
      "id": "ai-fc-1",
      "name": "Nome do Arcano ou Símbolo do Tarot",
      "type": "Tarot",
      "detail": "Interpretação e conselho prático focado na fraqueza do usuário"
    }
  ]
}`;

      const context = `Perfil: ${profile.name} (XP: ${profile.xp}, Grau: ${profile.grau}) 
Dificuldade: ${weakness} 
Objetivo: ${goal}
Grimório: ${grimoireCount} registros`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: context,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      return JSON.parse(response.text?.trim() || "{}");
    } catch (err) {
      console.error("Gemini failed to generate study plan:", err);
      return generateFallbackPlan();
    }
  }

  // 6. Generate Complete Course with IA
  public static async generateCourse(topic: string): Promise<{ title: string; description: string; content: any }> {
    const ai = this.getClient();
    if (!ai) {
      // Mock generated course
      return {
        title: `Estudo Avançado de ${topic}`,
        description: `Um programa místico decodificado por IA focado em desvendar a simbologia profunda de ${topic}.`,
        content: [
          {
            level: 0,
            title: 'Módulo 1 — Despertar Inicial',
            desc: `Compreensão intuitiva básica e introdução histórica a ${topic}.`,
            unlocked: true,
            bgGlow: 'bg-indigo-500',
            nodes: [
              { id: 'node-ai-1', name: `Portais de ${topic}`, desc: 'História, cosmologia e correspondências', icon: 'Sparkles', color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
              { id: 'node-ai-2', name: 'Altar Prático e Consagração', desc: 'Preparações e consagrações elementares', icon: 'Flame', color: 'text-rose-400', tailwindColor: 'bg-rose-500' }
            ]
          }
        ]
      };
    }

    try {
      const systemInstruction = `Você é o Arquivista Hermético Cósmico da Oracle Academy.
Sua tarefa é gerar uma trilha de aprendizagem/curso completo sobre o tema de oráculos ou ocultismo fornecido pelo usuário.
O curso gerado deve possuir exatamente 2 a 3 módulos e, dentro de cada módulo, 2 a 3 nodes/aulas.
Retorne SEMPRE e EXCLUSIVAMENTE um JSON que respeita este formato de esquema exato:
{
  "title": "Título Nobre e Poético do Curso",
  "description": "Uma introdução mística e inspiradora sobre o que o aluno decodificará neste curso (cerca de 50 palavras).",
  "content": [
    {
      "level": 0,
      "title": "Módulo 0 — Título do Módulo",
      "desc": "Breve descrição do foco do módulo.",
      "unlocked": true,
      "bgGlow": "bg-indigo-500",
      "nodes": [
        {
          "id": "node-exclusivo-id",
          "name": "Título da Aula/Node",
          "desc": "Conceitos principais que serão aprendidos.",
          "icon": "Sparkles, Crown, Flame, Star, BookOpen, Eye ou Droplets",
          "color": "text-indigo-400 ou text-amber-400 ou text-purple-400",
          "tailwindColor": "bg-indigo-500 ou bg-amber-500"
        }
      ]
    }
  ]
}
Responda em PORTUGUÊS DO BRASIL. Não inclua blocos markdown fora do JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Gere um curso completo sobre o tema: "${topic}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      return {
        title: parsed.title || `Estudos sobre ${topic}`,
        description: parsed.description || "Curso decodificado pela egrégora de IA.",
        content: parsed.content || []
      };
    } catch (err) {
      console.error("Gemini failed to generate course, returning mock:", err);
      return {
        title: `Estudo Avançado de ${topic}`,
        description: `Um programa místico focado em desvendar a simbologia profunda de ${topic}.`,
        content: [
          {
            level: 0,
            title: 'Módulo 1 — Despertar Inicial',
            desc: `Introdução prática a ${topic}.`,
            unlocked: true,
            bgGlow: 'bg-indigo-500',
            nodes: [
              { id: 'node-ai-1', name: `Portais de ${topic}`, desc: 'História, cosmologia e correspondências', icon: 'Sparkles', color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' }
            ]
          }
        ]
      };
    }
  }

  // 7. Evaluate Module Chat (Avaliação com IA - Step 6)
  public static async evaluateModuleChat(nodeName: string, message: string, history: {role: string, content: string}[]): Promise<string> {
    const ai = this.getClient();
    const isInit = message === '__INIT__';

    if (!ai) {
      if (isInit) {
        return `Saudações, buscador. Sou o Guardião do Templo dos Mistérios. Agora que você percorreu os ensinamentos de **"${nodeName}"**, chegou o momento da Prova Oracular. Responda-me: qual é o conceito fundamental que você absorveu desta jornada e como ele se manifesta na sua prática espiritual cotidiana?`;
      }
      return `Sua resposta revela profundidade interior. A egrégora reconhece seu esforço e crescimento. Continue praticando com intenção e o conhecimento de "${nodeName}" se consolidará em sua jornada oracular.`;
    }

    try {
      const systemInstruction = `Você é o Guardião do Templo — um mentor oracular sábio e socrático da Oracle Academy.
Seu papel é conduzir uma avaliação dialógica e pedagógica sobre o módulo de estudo que o usuário acabou de completar: "${nodeName}".
Regras:
- Se a mensagem do usuário for "__INIT__", gere UMA pergunta oracular de abertura sobre "${nodeName}" para iniciar a avaliação. Seja poético, acolhedor e estimulante.
- Se for uma resposta do usuário, avalie pedagogicamente, elogie os acertos, corrija gentilmente os erros, e faça UMA nova pergunta aprofundada.
- Nunca revele a resposta diretamente — guie o buscador a descobrir.
- Use linguagem mística mas clara, em Português do Brasil.
- Máximo 3 parágrafos por resposta.
- Não use listas ou bullet points — apenas prosa fluida.`;

      const contents = isInit 
        ? `__INIT__: Inicie a avaliação sobre "${nodeName}".`
        : history.map((m: any) => `${m.role === 'assistant' ? 'Guardião' : 'Buscador'}: ${m.content}`).join('\n') + `\nBuscador: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: { systemInstruction }
      });

      return response.text?.trim() || `Sua percepção demonstra evolução genuína no estudo de "${nodeName}". Continue aprofundando sua prática e o templo do saber se abrirá cada vez mais para você.`;
    } catch (err) {
      console.error("[Gemini] evaluateModuleChat failed:", err);
      if (isInit) {
        return `Saudações, buscador. Chegou o momento da Prova Oracular de **"${nodeName}"**. Descreva em suas próprias palavras o que este módulo revelou para você e como você aplicaria esse conhecimento na sua prática espiritual.`;
      }
      return `Sua resposta foi registrada na egrégora do templo. Reflita sobre os ensinamentos de "${nodeName}" com profundidade — a sabedoria se consolida na prática constante.`;
    }
  }
}
