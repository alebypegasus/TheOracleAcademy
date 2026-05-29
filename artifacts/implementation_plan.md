# Refatoração da Experiência de Cursos (Courses View)

O objetivo principal é transformar a jornada de aprendizado do `CoursesView.tsx` atual em uma experiência premium, imersiva e altamente intuitiva. Para isso, vamos dividir a responsabilidade do componente monolítico, melhorar o design de navegação e integrar o `scroll-island` do Watermelon UI para a leitura focada.

## User Review Required

> [!IMPORTANT]
> **Aprovação do Design da Navegação**: A navegação atual usa "cards" para cada lição dentro de um módulo (Teoria, Prática, Erros Comuns). Planejo alterar isso para um **"Roadmap Vertical Animado"** (uma linha do tempo), onde o usuário vê claramente o caminho do Iniciante ao Mestre dentro daquele módulo. Você concorda com essa abordagem visual?

> [!WARNING]
> **Uso do Scroll Island**: O componente `scroll-island` será fixado na parte inferior ou superior da tela durante a **leitura da lição**. Ele conterá botões rápidos para: Voltar, Ouvir Áudio (TTS), Fazer Anotações e Concluir Lição. Isso substituirá os painéis fixos nas laterais para garantir uma leitura "Zen".

## Open Questions

- Como a barra lateral (Sidebar) se comportará durante a leitura? Você prefere que a Sidebar seja recolhida automaticamente (modo Zen total) quando o usuário entrar em uma lição, mantendo apenas o texto e o Scroll Island na tela?
- O Chat de Avaliação da IA no final do módulo deve ocupar a tela inteira em modo focado, ou abrir como um modal/drawer deslizando pela lateral?

## Proposed Changes

### 1. Estrutura e Modularização
O arquivo atual `CoursesView.tsx` tem quase 1100 linhas. Ele será dividido em componentes menores e reutilizáveis.

#### [NEW] `src/components/views/Courses/CoursesSaga.tsx`
Será a visão principal (Landing dos Cursos). Exibirá os Módulos (Nível 0 a Nível 6) com um design de carrossel ou cards expansíveis mais modernos, focados em revelar a capa e o tema mágico de cada módulo.

#### [NEW] `src/components/views/Courses/ModuleRoadmap.tsx`
Quando um módulo for clicado, esta tela exibirá o caminho interno (`INNER_PATH`). Em vez de um grid, será uma trilha interativa com nós brilhantes (estilo árvore de habilidades).

#### [NEW] `src/components/views/Courses/LessonReader.tsx`
O ambiente de leitura focado. Terá uma tipografia otimizada, fundos imersivos baseados no nível do módulo e utilizará o `ScrollIsland` para controles.

#### [MODIFY] `src/components/views/CoursesView.tsx`
Atuará apenas como o "Controller/Router" principal que gerencia o estado global (qual módulo está aberto, qual lição está ativa) e orquestra a transição entre `CoursesSaga`, `ModuleRoadmap` e `LessonReader` usando o `AnimatePresence` do framer-motion para transições fluidas.

---

### 2. Integração do Watermelon UI
Instalação e configuração dos componentes solicitados.

#### [NEW] `scroll-island`
- Executar: `npx shadcn@latest add https://registry.watermelon.sh/r/scroll-island.json`
- Será integrado dentro do `LessonReader.tsx`.
- Vai abrigar ações rápidas: Progresso de Scroll, Play (Áudio), Bloco de Notas e Botão de Finalizar.

---

### 3. Melhorias Visuais e de Navegação
- **Transições**: Uso extensivo de `layoutId` do Framer Motion para que o ícone de um módulo "cresça" e se transforme no cabeçalho da lição.
- **Experiência de Leitura**: Largura máxima do texto em `65ch` (padrão ideal para leitura), fontes maiores para títulos (`Cinzel`) e texto fluido (`Inter`), com contraste otimizado (sem bordas brancas).

## Verification Plan

### Automated Tests
1. Verificar a injeção do componente `scroll-island` pelo script do npx.
2. Garantir que as variáveis de cor e estado funcionem sem quebrar com a nova estrutura.

### Manual Verification
1. O usuário (Admin/Aluno) abrirá a página de "Saga Oracular".
2. Clicará no Nível 0, validando se a animação abre a linha do tempo (Roadmap) do módulo.
3. Clicará em "Teoria e Fundamentos", o que deverá esconder a interface pesada e entrar no "Modo de Leitura", exibindo o componente `scroll-island` ao rolar a página.
4. Testar o botão de completar a lição a partir do scroll-island.
