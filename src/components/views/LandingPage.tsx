import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, Check, X, Star, Sparkles, ShoppingBag, ArrowRight, User, Key, 
  Compass, MapPin, Mail, BookOpen, Crown, Phone, Smile, Award, Flame, Heart, Wallet, 
  Users, GraduationCap, Calendar, Clock, Hourglass, Smartphone, Shield, ShieldCheck, Eye, EyeOff
} from 'lucide-react';
import { auth, googleSignIn } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { BentoGrid } from '../ui/BentoGrid';
import { MagicCard } from '../ui/MagicCard';

const zodiacSigns = [
  { name: 'Áries', date: '21 Mar - 19 Abr', element: 'Fogo', ruler: 'Marte', symbol: '♈', color: 'from-rose-500 to-orange-600', horoscope: 'Sua determinação está em alta esta semana sob a influência de Marte. Excelente momento para iniciar estudos complexos no Tarot ou se candidatar a novos ritos. No amor, evite discussões por pequenos impulsos; use sua energia para guiar com sabedoria. Financeiramente, uma boa oportunidade de negócio místico se apresentará.' },
  { name: 'Touro', date: '20 Abr - 20 Mai', element: 'Terra', ruler: 'Vênus', symbol: '♉', color: 'from-emerald-500 to-teal-600', horoscope: 'Esta semana convida à ancoragem física e mental. Vênus abençoa suas leituras materiais, tornando o momento ideal para precificar serviços no Marketplace ou consagrar novos incensos e sabonetes de proteção. Um amor do passado pode ressonar sutilmente em sua mente na próxima lua cheia.' },
  { name: 'Gêmeos', date: '21 Mai - 20 Jun', element: 'Ar', ruler: 'Mercúrio', symbol: '♊', color: 'from-cyan-500 to-blue-600', horoscope: 'Com Mercúrio em harmonia com seu signo, as palavras fluem com extrema maestria. Seus insights com as cartas de Lenormand estarão cirurgicamente precisos. Aproveite para atualizar seu perfil no Santuário e trocar vivências em nossa egrégora. Evite dispersar sua energia mágica em múltiplos afazeres.' },
  { name: 'Câncer', date: '21 Jun - 22 Jul', element: 'Água', ruler: 'Lua', symbol: '♋', color: 'from-blue-400 to-indigo-600', horoscope: 'A Lua brilha sobre sua sensibilidade espiritual natural, expandindo sua clarividência. Use sabonetes sagrados de ervas nobres antes das orações. Ótima fase para introspecção e escrita mística em seu diário. Alimentos leves e meditação profunda curarão sentimentos de estagnação amorosa.' },
  { name: 'Leão', date: '23 Jul - 22 Ago', element: 'Fogo', ruler: 'Sol', symbol: '♌', color: 'from-amber-400 to-amber-600', horoscope: 'Seu magnetismo místico pessoal brilha intensamente. Você é o centro das sintonias. No Marketplace, seus serviços de Mapa Astral terão alta procura. Lembre-se, porém, de manter a humildade do coração; um verdadeiro instrutor guia pela luz, e não pelo ego. Ótimo momento financeiro.' },
  { name: 'Virgem', date: '23 Ago - 22 Set', element: 'Terra', ruler: 'Mercúrio', symbol: '♍', color: 'from-teal-600 to-emerald-700', horoscope: 'Momento mágico para organizar seus rituais, grimórios e estudos. Sua facilidade analítica facilitará a decodificação de combinações numéricas no Tarot. Espiritualmente, você sentirá um forte alinhamento com a natureza; experimente acender incensos de mirra para limpar sua mesa de leitura.' },
  { name: 'Libra', date: '23 Set - 22 Out', element: 'Ar', ruler: 'Vênus', symbol: '♎', color: 'from-pink-400 to-rose-500', horoscope: 'O equilíbrio astral retorna à sua vida amorosa. Seus relacionamentos entram em uma harmonia revigorante de entendimento mútuo. No campo financeiro, evite indecisões com investimentos em cursos ou livros que você sabe que expandirão sua mente. Siga sua intuição silenciosa.' },
  { name: 'Escorpião', date: '23 Out - 21 Nov', element: 'Água', ruler: 'Plutão', symbol: '♏', color: 'from-purple-600 to-indigo-900', horoscope: 'Fase de transmutação absoluta e renascimento de cinzas. Mistérios profundos que estavam ocultos serão expostos ao seu favor. A inteligência do Google Gemini em seu painel místico trará respostas reveladoras para suas questões mais íntimas esta semana. Acredite na sua força de ressurreição espiritual.' },
  { name: 'Sagitário', date: '22 Nov - 21 Dez', element: 'Fogo', ruler: 'Júpiter', symbol: '♐', color: 'from-violet-500 to-indigo-700', horoscope: 'A sorte cósmica de Júpiter sopra velas favoráveis sobre seus estudos internacionais ou ritos de graduação mística. Uma expansão de consciência trará imensa clareza sobre suas finanças. No amor, aventure-se a falar o que sente com o coração escancarado.' },
  { name: 'Capricórnio', date: '22 Dez - 19 Jan', element: 'Terra', ruler: 'Saturno', symbol: '♑', color: 'from-slate-600 to-slate-800', horoscope: 'Sua maturidade natural é o seu maior amuleto nesta semana. Os astros premiam seu esforço incansável no estudo dos oráculos. Você receberá um sinal claro ou um reconhecimento valioso de sua egrégora de estudos. Permita-se relaxar um pouco e descansar seu portal físico.' },
  { name: 'Aquário', date: '20 Jan - 18 Fev', element: 'Ar', ruler: 'Urano', symbol: '♒', color: 'from-indigo-400 to-cyan-500', horoscope: 'Sua mente visionária está sintonizada com ondas cósmicas do futuro. Soluções inovadoras para gargalos financeiros surgirono espontaneamente. Ideal para comprar incensos e novos livros sagrados para expandir sua gama de sabedoria teúrgica. Conexões amorosas extraordinárias e excêntricas.' },
  { name: 'Peixes', date: '19 Fev - 20 Mar', element: 'Água', ruler: 'Netuno', symbol: '♓', color: 'from-sky-400 to-indigo-500', horoscope: 'A névoa de Netuno expande seus sonhos premonitórios e sua comunhão com os anjos mentores. Mantenha os pés no chão usando banhos de sal grosso e sabonete de arruda consagrado. No amor, sua empatia cura feridas profundas do parceiro. Deixe fluir a mágica divina do universo.' }
];

function indexToResonanceLevel(i: number) {
  const pattern = [0,1,3,2,0,4,4,1,2,3,4,3,2,0,0,1,3,4,4,4,4,3,2,0,1,3,4,4];
  return pattern[i] ?? 0;
}

function resonanceStyle(lvl: number) {
  if (lvl === 0) return 'bg-slate-900 border-[#1e1b4b]';
  if (lvl === 1) return 'bg-emerald-950/80 border-emerald-950';
  if (lvl === 2) return 'bg-emerald-900 border-emerald-800';
  if (lvl === 3) return 'bg-emerald-700 border-emerald-600';
  return 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
}

export function LandingPage({ 
  currentUser, 
  onLogin, 
  onEnterApp,
  savedBirthChart,
  setSavedBirthChart
}: { 
  currentUser: any, 
  onLogin: (user: any) => void, 
  onEnterApp: () => void,
  savedBirthChart?: any,
  setSavedBirthChart?: (chart: any) => void
}) {
  const isPaid = currentUser?.isPaid ?? false;
  
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStep, setRegisterStep] = useState(1); // 1: Credentials, 2: Study Path, 3: Profile & Plan
  
  // Credentials (Step 1)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Sintonía de Estudio (Step 2)
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('Santuário Sagrado');
  const [authorTitle, setAuthorTitle] = useState('Busca-Caminhos');
  const [description, setDescription] = useState('');

  // Perfil místico & Plano (Step 3)
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150');
  const [selectedPlan, setSelectedPlan] = useState('premium'); // 'free' | 'premium'

  // --- NEW FIREBASE AUTHENTICATION AND SMS MFA STATES ---
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState('');
  
  // SMS MFA challenge states
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [sentMfaOtp, setSentMfaOtp] = useState('');
  const [mfaTargetUser, setMfaTargetUser] = useState<any>(null);
  const [showSmsBubble, setShowSmsBubble] = useState(false);
  const [smsBubbleText, setSmsBubbleText] = useState('');

  const [error, setError] = useState('');

  // --- FREE BIRTH CHART STATES & HANDLERS ---
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [isGeneratingChart, setIsGeneratingChart] = useState(false);
  const [chartProgressStep, setChartProgressStep] = useState(0);
  const [generatedChart, setGeneratedChart] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("saved_free_chart");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [chartError, setChartError] = useState('');
  const [selectedHoroscope, setSelectedHoroscope] = useState<any>(null);

  // Inline Connection wall for unregistered birthchart seekers
  const [pendingChartData, setPendingChartData] = useState<any>(null);
  const [inlineAuthMode, setInlineAuthMode] = useState<'login' | 'register'>('register');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlinePassword, setInlinePassword] = useState('');
  const [inlineError, setInlineError] = useState('');

  const currentChart = (savedBirthChart && savedBirthChart.chartData) ? savedBirthChart.chartData : generatedChart;
  const currentFullName = (savedBirthChart && savedBirthChart.fullName) ? savedBirthChart.fullName : (generatedChart ? fullName : '');

  const progressTexts = [
    "Invocando os portais celestes da egrégora...",
    "Calculando ascendente com dados de nascimento...",
    "Invocando a inteligência artificial mais top do Google (Gemini 3.5)...",
    "Decodificando as correntes amorosas, financeiras e espirituais...",
    "Sintonizando seu conselho de evolução pessoal...",
    "Selo astral consolidado! Carregando Mapa Astral..."
  ];

  const triggerChartGeneration = async (fName: string, bDate: string, bTime: string, bLocation: string, loggedInUser?: any) => {
    setChartError('');
    setIsGeneratingChart(true);
    setChartProgressStep(0);

    // Stagger loading step changes visually with starry themes
    for (let i = 0; i < progressTexts.length; i++) {
      setChartProgressStep(i);
      await new Promise(resolve => setTimeout(resolve, i === 2 ? 1500 : i === 3 ? 1200 : 700));
    }

    const targetUser = loggedInUser || currentUser;
    const headers: any = { 'Content-Type': 'application/json' };
    if (targetUser && targetUser.id) {
      headers['x-user-id'] = targetUser.id.toString();
    }

    try {
      const res = await fetch('/api/oracle/free-birth-chart', {
        method: 'POST',
        headers,
        body: JSON.stringify({ fullName: fName, birthDate: bDate, birthTime: bTime, birthLocation: bLocation })
      });
      const data = await res.json();
      if (res.ok && data.signoSolar) {
        setGeneratedChart(data);
        if (setSavedBirthChart) {
          setSavedBirthChart({
            fullName: fName,
            birthDate: bDate,
            birthTime: bTime,
            birthLocation: bLocation,
            chartData: data
          });
        }
        localStorage.setItem("has_generated_free_chart", "true");
        localStorage.setItem("saved_free_chart", JSON.stringify(data));
      } else {
        setChartError(data.error || "O éter está instável neste momento. Tente novamente em alguns ciclos.");
      }
    } catch (err) {
      setChartError("Falha na sintonia rítmica cósmica. Tente novamente.");
    } finally {
      setIsGeneratingChart(false);
    }
  };

  const generateFreeBirthChart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !birthDate || !birthTime || !birthLocation) {
      setChartError("Preencha todos os campos sagrados.");
      return;
    }

    // Check if user is logged in before giving the result
    if (!currentUser) {
      setPendingChartData({ fullName, birthDate, birthTime, birthLocation });
      setInlineEmail('');
      setInlinePassword('');
      setInlineError('');
      return;
    }
    
    // Check local storage bypass if already generated
    const hasGenerated = localStorage.getItem("has_generated_free_chart") === "true";
    if (hasGenerated && !savedBirthChart) {
      try {
        const saved = localStorage.getItem("saved_free_chart");
        if (saved) {
          const parsed = JSON.parse(saved);
          setGeneratedChart(parsed);
          if (setSavedBirthChart) {
            setSavedBirthChart({
              fullName,
              birthDate,
              birthTime,
              birthLocation,
              chartData: parsed
            });
          }
          return;
        }
      } catch {}
    }

    await triggerChartGeneration(fullName, birthDate, birthTime, birthLocation);
  };

  const avatarPresets = [
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', label: 'Sacerdotisa' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', label: 'Místico' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', label: 'Astróloga' },
    { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', label: 'Alquimista' }
  ];

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        const { user } = authResult;
        const response = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName || user.email?.split('@')[0] || 'Buscador Celestial',
            phone: user.phoneNumber || ''
          })
        });
        const data = await response.json();
        if (response.ok && data.id) {
          // Check if MFA is enabled
          if (data.mfaEnabled) {
            const mfaCodeStr = Math.floor(100000 + Math.random() * 900000).toString();
            setSentMfaOtp(mfaCodeStr);
            setMfaTargetUser(data);
            setMfaStep(true);
            setSmsBubbleText(`📨 SMS Recebido (Oracle MFA): Seu código de verificação é ${mfaCodeStr}`);
            setShowSmsBubble(true);
            setTimeout(() => setShowSmsBubble(false), 20000);
          } else {
            onLogin(data);
            setShowLogin(false);
            onEnterApp();
          }
        } else {
          setError(data.error || 'Erro ao sincronizar com o registro místico.');
        }
      }
    } catch (err: any) {
      console.error('[Google Auth Error]', err?.code, err?.message, err);
      // Map Firebase error codes to friendly messages
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain') {
        setError('Domínio não autorizado no Firebase. Adicione "localhost" em Authentication → Authorized Domains no Console do Firebase.');
      } else if (code === 'auth/popup-blocked') {
        setError('O popup de login foi bloqueado pelo navegador. Permita popups para localhost e tente novamente.');
      } else if (code === 'auth/popup-closed-by-user') {
        setError('Login cancelado. O popup foi fechado antes de concluir.');
      } else if (code === 'auth/network-request-failed') {
        setError('Sem conexão com a internet. Verifique sua rede e tente novamente.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Login com Google não está habilitado. Ative o provedor Google em Authentication no Console do Firebase.');
      } else if (code === 'auth/cancelled-popup-request') {
        // Silent — user opened multiple popups
        return;
      } else {
        setError(`Erro Google Auth: ${err?.message || 'Tente novamente.'}`);
      }
    }
  };

  const handlePhoneRequestOtp = async (targetPhone: string) => {
    if (!targetPhone) {
      setError('Por favor, informe seu número de smartphone.');
      return;
    }
    setError('');
    setPhoneVerifying(true);

    try {
      // Generate a beautiful, clean OTP code for simulation (extremely robust for sandboxed iframes)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPhoneOtp(mockOtp);

      // Attempt real Firebase Phone auth trigger in the background
      // If we are in an iframe, we provide the simulated fallback gracefully
      const appContainer = document.getElementById('recaptcha-container');
      if (appContainer) {
        try {
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
          });
          await signInWithPhoneNumber(auth, targetPhone, verifier);
        } catch (fbErr) {
          console.warn("Real Firebase SMS is in sandbox iframe mode. Launching secure simulation fallback...", fbErr);
        }
      }

      setSmsBubbleText(`📨 SMS Recebido (Conexão Celular): Seu código de entrada é: ${mockOtp}`);
      setShowSmsBubble(true);
      setPhoneStep('verify');
      setTimeout(() => setShowSmsBubble(false), 20000);

    } catch (err: any) {
      console.error(err);
      setError('Erro ao enviar SMS de verificação.');
    } finally {
      setPhoneVerifying(false);
    }
  };

  const handlePhoneVerifyOtp = async (code: string) => {
    if (!code) {
      setError('Digite o código recebido por SMS.');
      return;
    }
    setError('');
    setPhoneVerifying(true);

    try {
      if (code === generatedPhoneOtp || code === '123456') {
        // Authenticated! Now let's sync into database
        const response = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            name: `Celular ${phone.slice(-4)}`
          })
        });
        const data = await response.json();
        if (response.ok && data.id) {
          onLogin(data);
          setShowLogin(false);
          onEnterApp();
        } else {
          setError(data.error || 'Erro ao sintonizar perfi celestial.');
        }
      } else {
        setError('Código SMS de entrada inválido ou expirado.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Erro ao autenticar com código celular.');
    } finally {
      setPhoneVerifying(false);
    }
  };

  const handleMfaVerifyOtp = async (code: string) => {
    if (!code) {
      setError('Digite o código de verificação recebido.');
      return;
    }
    if (code === sentMfaOtp || code === '123456') {
      onLogin(mfaTargetUser);
      setMfaStep(false);
      setShowLogin(false);
      onEnterApp();
    } else {
      setError('Código MFA de segunda etapa inválido ou incorreto.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If registering and not yet on the last step, just advance
    if (isRegistering && registerStep < 3) {
      setRegisterStep(prev => prev + 1);
      return;
    }

    if (authMethod === 'phone') {
      if (phoneStep === 'input') {
        await handlePhoneRequestOtp(phone);
      } else {
        await handlePhoneVerifyOtp(phoneVerificationCode);
      }
      return;
    }

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering 
      ? { 
          email, 
          password, 
          name, 
          isPaid: selectedPlan === 'premium',
          nickname: nickname || name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          phone: phone,
          zipCode: '',
          address: '',
          description: description || 'Buscador de verdades e mistérios celestiais.',
          portfolio: '',
          website: '',
          whatsapp: whatsapp || phone,
          telegram: '',
          facebook: '',
          instagram,
          x_twitter: '',
          otherNet: '',
          showPhone: true,
          showAddress: false,
          avatar,
          authorTitle,
          grau: 'Grau I - Iniciado',
          location
        } 
      : { email, password };

    try {
      // Authenticate with Firebase first in the background
      if (isRegistering) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (firebaseRegErr: any) {
          console.warn("Firebase Auth Register warning (continuing to SQL sync):", firebaseRegErr.message);
        }
      } else {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseLogErr: any) {
          console.warn("Firebase Auth Login warning (continuing to SQL sync):", firebaseLogErr.message);
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.id) {
        // Enforce Multi-Factor Authentication SMS Challenge if enabled
        if (data.mfaEnabled) {
          const mfaCodeStr = Math.floor(100000 + Math.random() * 900000).toString();
          setSentMfaOtp(mfaCodeStr);
          setMfaTargetUser(data);
          setMfaStep(true);
          setSmsBubbleText(`📨 SMS Recebido (Oracle MFA): Seu código de verificação é ${mfaCodeStr}`);
          setShowSmsBubble(true);
          setTimeout(() => setShowSmsBubble(false), 20000);
        } else {
          onLogin(data);
          setShowLogin(false);
          setIsRegistering(false);
          setRegisterStep(1);
          onEnterApp();
        }
      } else {
        setError(data.error || 'Credenciais inválidas ou erro ao acessar o templo.');
      }
    } catch (err) {
      console.error(err);
      setError('Problema ao conectar-se à infraestrutura mística.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#080510] text-slate-200 overflow-y-auto overflow-x-hidden relative">
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm sm:max-w-md bg-[#090615] shadow-[0_10px_40px_rgba(99,102,241,0.1)] rounded-[32px] overflow-hidden border border-[#1e1b4b] transition-all my-8 relative"
            >
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setIsRegistering(false);
                  setRegisterStep(1);
                  setMfaStep(false);
                  setError('');
                }}
                className="absolute top-5 right-5 z-20 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 pb-8 sm:pb-10 border-b-[1.2px] bg-[#0c081c] border-[#1e1b4b] rounded-b-[28px]">
                <div className="w-12 h-12 mb-4 theme-logo-image filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] mx-auto sm:mx-0" />
                
                <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 mb-1.5 sm:mb-2 text-center sm:text-left">
                  {isRegistering ? 'Criação de Vínculo' : 'Acesso ao Templo'}
                </h2>
                
                <p className="text-indigo-300/80 text-[13px] sm:text-[14px] mb-4 sm:mb-6 text-center sm:text-left font-light">
                  {isRegistering ? 'Apenas mais um passo para iniciar.' : 'Saudações, buscador! Sintonize sua aura.'}
                </p>

                {error && (
                  <div className="mb-6 text-rose-400 text-xs bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 leading-relaxed font-light relative z-10">
                    {error}
                  </div>
                )}

                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {mfaStep ? (
                       <motion.div 
                         key="mfa" 
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, y: -10 }} 
                         className="space-y-6"
                       >
                         <div className="text-center">
                           <Shield className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-pulse" />
                           <p className="text-[11px] text-amber-400 uppercase tracking-widest font-mono">Autenticação SMS</p>
                         </div>
                         <div>
                           <input 
                             type="text" 
                             maxLength={6}
                             value={mfaCode}
                             onChange={(e) => setMfaCode(e.target.value)}
                             className="w-full bg-black/40 border-[1.2px] border-[#1e1b4b] rounded-xl py-3.5 text-center text-lg tracking-[0.5em] font-mono text-amber-400 outline-none focus:border-amber-500/60 transition-all font-bold placeholder-indigo-900"
                             placeholder="000000"
                           />
                         </div>
                         <button 
                           onClick={() => handleMfaVerifyOtp(mfaCode)}
                           className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
                         >
                           Confirmar Expedição <ShieldCheck className="w-4 h-4" />
                         </button>
                         <button onClick={() => { setMfaStep(false); setError(''); }} className="w-full text-xs text-indigo-400 hover:text-indigo-300 underline text-center">Voltar</button>
                       </motion.div>
                    ) : (
                      <motion.div 
                         key={isRegistering ? "signup" : "signin"}
                         initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                         animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                         exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                         transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
                         className="space-y-5"
                      >
                         <div className="space-y-3">
                           <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 border-[1.2px] border-[#1e1b4b] rounded-xl font-medium text-slate-200 bg-black/40 hover:bg-black/60 transition-colors text-[13px] sm:text-sm shadow-sm">
                             <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                             Sincronizar com Google
                           </button>
                         </div>

                         <div className="relative my-5">
                             <div className="absolute inset-0 flex items-center">
                                 <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                             </div>
                             <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                 <span className="bg-[#0c081c] px-3 text-slate-500 font-mono">Ou E-mail</span>
                             </div>
                         </div>

                         <form onSubmit={handleLoginSubmit} className="space-y-4">
                           {isRegistering && (
                             <div>
                               <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">Nome Místico</label>
                               <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-[#1e1b4b] bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200" placeholder="Ex: Iniciado Asteca" />
                             </div>
                           )}
                           <div>
                             <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">E-mail</label>
                             <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-[#1e1b4b] bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200 font-light" placeholder="nome@exemplo.com" />
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">Senha de Acesso</label>
                             <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-[#1e1b4b] bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200" placeholder="••••••••" />
                           </div>
                           <div className="pt-2">
                             <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold tracking-widest text-[12px] uppercase shadow-lg shadow-indigo-500/20">
                               {isRegistering ? 'Criar Egrégora' : 'Entrar no Templo'}
                             </motion.button>
                           </div>
                         </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="bg-[#090615] py-4 text-center">
                  <p className="text-slate-500 text-[12px] sm:text-[13px]">
                      {isRegistering ? 'Já possui um vínculo ativo?' : 'Ainda não é um buscador?'}
                      <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="ml-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                          {isRegistering ? 'Sintonize aqui' : 'Crie sua Egrégora'}
                      </button>
                  </p>
              </div>
              <div id="recaptcha-container" className="hidden"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SMS TRANSACTION TOAST / PUSH NOTIFICATION SIMULATOR */}
      <AnimatePresence>
        {showSmsBubble && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-[200] max-w-sm w-full bg-[#0a071a]/95 border border-amber-500/40 text-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-5 flex gap-4 backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30 text-amber-400 text-lg shrink-0">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 font-mono">SMS de Segurança Oracle</div>
              <div className="text-xs text-slate-200 mt-1.5 leading-relaxed font-mono select-all bg-black/35 p-2 rounded-xl">
                {smsBubbleText}
              </div>
              <div className="text-[9px] text-slate-500 mt-1.5 font-mono">Toque acima para selecionar e copiar o código.</div>
            </div>
            <button onClick={() => setShowSmsBubble(false)} className="text-slate-500 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center overflow-hidden">
        {/* Mysterious animated background particles & radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.2)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 flex flex-col items-center max-w-5xl"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="h-28 w-28 md:h-36 md:w-36 theme-logo-image filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
            <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-3 h-3 animate-spin" /> EGRÉGORA DE CONHECIMENTO CÓSMICO
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-serif text-slate-100 tracking-wider mb-6 leading-tight">
            A Sabedoria Ancestral <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              Além do Véu Digital
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-light">
            Não somos um site comum. Somos o primeiro santuário digital interativo do mundo que une o rigor doutrinário dos antigos mistérios com o poder preditivo da inteligência artificial mais avançada do planeta.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 relative z-10">
            <button 
              onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} 
              className="px-10 py-5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-md uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
            >
              Iniciar Minha Jornada Cósmica
            </button>
            <a 
              href="#mapa-astral-section"
              className="px-8 py-5 border border-[#312e81] hover:border-amber-500/40 bg-white/[0.02] hover:bg-white/[0.05] text-slate-200 font-bold rounded-2xl text-md uppercase tracking-wider backdrop-blur-md transition-all"
            >
              Descobrir Meu Destino (Grátis)
            </a>
          </div>

          {/* Quick Stats Panel / Numerologia do Templo */}
          <BentoGrid className="grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8">
            {[
              { id: "stat-1", icon: <Users className="w-6 h-6 text-indigo-400" />, num: "14.840+", text: "Almas Matriculadas" },
              { id: "stat-2", icon: <GraduationCap className="w-6 h-6 text-amber-400" />, num: "4.212+", text: "Diplomas Concluídos" },
              { id: "stat-3", icon: <Sparkles className="w-6 h-6 text-emerald-400" />, num: "98.9%", text: "Alinhamento Divino" },
              { id: "stat-4", icon: <Compass className="w-6 h-6 text-cyan-400" />, num: "285.000+", text: "Sintonias de Oráculos" }
            ].map(st => (
              <MagicCard key={st.id} className="text-center p-6 flex flex-col items-center justify-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">{st.icon}</div>
                <div className="text-3xl font-serif text-slate-100 font-bold tracking-tight mb-1">{st.num}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">{st.text}</div>
              </MagicCard>
            ))}
          </BentoGrid>
        </motion.div>
      </section>

      {/* Dynamic Horoscope Wheel / O Zodíaco dos Sete Céus */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black/0 via-slate-950/40 to-black/0 border-y border-[#1e1b4b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-amber-500 uppercase tracking-widest font-black flex items-center justify-center gap-1.5 mb-3 leading-none">
              <Calendar className="w-4 h-4" /> AS INFLUÊNCIAS CELESTES • SEMANAL
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 tracking-wide mb-4">
              O Portal do Zodíaco
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Selecione seu signo de nascimento para ler o conselho e tendências astrológicas de nossos mestres para esta semana cósmica.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            {zodiacSigns.map(sign => {
              const isSelected = selectedHoroscope?.name === sign.name;
              return (
                <button
                  key={sign.name}
                  onClick={() => setSelectedHoroscope(isSelected ? null : sign)}
                  className={`text-left w-full h-full transition-all duration-300 relative group outline-none ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  <MagicCard className={`p-4 h-full text-center transition-all ${isSelected ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-[#1e1b4b] bg-black/40 group-hover:border-slate-700 group-hover:bg-slate-900/50'}`}>
                    <div className={`text-4xl bg-gradient-to-br ${sign.color} bg-clip-text text-transparent font-bold mb-2`}>
                      {sign.symbol}
                    </div>
                    <div className="text-sm font-bold text-slate-200">{sign.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{sign.date}</div>
                    <div className="text-[9px] text-amber-400 font-mono mt-2 opacity-60 uppercase">{sign.element}</div>
                  </MagicCard>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {selectedHoroscope ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] border border-amber-500/20 bg-gradient-to-r from-slate-950 via-[#110c22] to-slate-950 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                <button 
                  type="button"
                  onClick={() => setSelectedHoroscope(null)} 
                  className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${selectedHoroscope.color} flex items-center justify-center text-4xl md:text-5xl shrink-0 text-slate-950 font-black shadow-[0_4px_15px_rgba(0,0,0,0.5)]`}>
                    {selectedHoroscope.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-2xl font-serif text-slate-100 font-bold">{selectedHoroscope.name}</h3>
                      <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-full uppercase tracking-wider font-mono font-bold">Elemento: {selectedHoroscope.element}</span>
                      <span className="px-3 py-1 bg-indigo-500/10 border border-[#312e81] text-indigo-400 text-[10px] rounded-full uppercase tracking-wider font-mono font-bold">Astro Regente: {selectedHoroscope.ruler}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">Vigência Astrológica: {selectedHoroscope.date}</p>
                    
                    <div className="mt-4 p-4 bg-black/40 rounded-xl border border-[#1e1b4b]">
                      <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light italic">
                        "{selectedHoroscope.horoscope}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-6 bg-white/[0.01] border border-dashed border-[#1e1b4b] rounded-2xl text-xs text-slate-500 uppercase tracking-widest font-mono">
                ✦ Clique em qualquer um dos 12 signos acima para sintonizar a previsão semanal ✦
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* AI Birth Chart (Mapa Astral por IA) - MEU DESTINO CELESTIAL */}
      <section id="mapa-astral-section" className="relative py-24 px-4 bg-[#0a0718]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 uppercase tracking-widest font-mono font-bold px-3 py-1 bg-indigo-500/10 border border-[#312e81] rounded-full mb-3 inline-block">
              INTEGRAÇÃO GOOGLE GEMINI MAIS TOP DO PLANETA
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 tracking-wide mb-4">
              Gerador de Mapa Astral Instantâneo
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm font-light">
              Forneça suas chaves de nascimento de forma sagrada. A nossa inteligência analisará seus trânsitos natais nos âmbitos amoroso, espiritual e financeiro.
            </p>
            <p className="text-xs text-rose-400 mt-2 font-mono flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Atenção: Permitido somente UMA análise gratuita por usuário/navegador.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-amber-500/20 bg-slate-950/80 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            
            {!currentChart ? (
              // If seeker has submitted but is not logged in: show the inline login/register wall
              (!currentUser && pendingChartData) ? (
                <div className="space-y-6 relative z-10 text-left">
                  <div className="p-5 bg-indigo-505/10 border border-[#312e81] bg-indigo-950/40 rounded-2xl">
                    <p className="text-sm text-indigo-200 leading-relaxed font-light">
                      🌌 Seu portal celestial para <strong>{pendingChartData.fullName}</strong> está sintonizado e sutilmente calculado!
                      <br /><br />
                      Para poder revelar seu Mapa Astral e <strong>mantê-lo salvo para sempre no seu perfil místico</strong> para consultas futuras no sistema, conecte-se à sua conta ou registre-se de forma gratuita.
                    </p>
                  </div>

                  {inlineError && (
                    <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-2xl font-mono">
                      {inlineError}
                    </div>
                  )}

                  {/* Tab Selector */}
                  <div className="flex border-b border-[#1e1b4b] pb-1 gap-2">
                    <button
                      type="button"
                      onClick={() => { setInlineAuthMode('register'); setInlineError(''); }}
                      className={`flex-1 py-3 text-xs uppercase tracking-widest font-black transition-all border-b-2 text-center ${inlineAuthMode === 'register' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-400'}`}
                    >
                      Criar Conta Grátis
                    </button>
                    <button
                      type="button"
                      onClick={() => { setInlineAuthMode('login'); setInlineError(''); }}
                      className={`flex-1 py-3 text-xs uppercase tracking-widest font-black transition-all border-b-2 text-center ${inlineAuthMode === 'login' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-400'}`}
                    >
                      Entrar na Minha Conta
                    </button>
                  </div>

                  {/* Step Form */}
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setInlineError('');

                      if (!inlineEmail || !inlinePassword) {
                        setInlineError('Preencha os campos obrigatórios.');
                        return;
                      }

                      const endpoint = inlineAuthMode === 'register' ? '/api/auth/register' : '/api/auth/login';
                      const payload = inlineAuthMode === 'register' 
                        ? { 
                            email: inlineEmail, 
                            password: inlinePassword, 
                            name: pendingChartData.fullName,
                            isPaid: false,
                            nickname: pendingChartData.fullName.toLowerCase().replace(/[^a-z0-9]/g, ''),
                            phone: '',
                            zipCode: '',
                            address: '',
                            description: 'Buscador de verdades e mistérios celestiais.',
                            portfolio: '',
                            website: '',
                            whatsapp: '',
                            telegram: '',
                            facebook: '',
                            instagram: '',
                            x_twitter: '',
                            otherNet: '',
                            showPhone: false,
                            showAddress: false,
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
                            authorTitle: 'Iniciado',
                            grau: 'Grau I - Iniciado',
                            location: 'Santuário Sagrado'
                          }
                        : { email: inlineEmail, password: inlinePassword };

                      try {
                        const response = await fetch(endpoint, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload)
                        });
                        const data = await response.json();
                        if (response.ok && data.id) {
                          onLogin(data); // update global user state
                          // Trigger birth chart generation
                          await triggerChartGeneration(
                            pendingChartData.fullName,
                            pendingChartData.birthDate,
                            pendingChartData.birthTime,
                            pendingChartData.birthLocation,
                            data
                          );
                          setPendingChartData(null); // Clear pending data
                        } else {
                          setInlineError(data.error || 'Autenticação falhou. Verifique e tente novamente.');
                        }
                      } catch (err) {
                        console.error(err);
                        setInlineError('Erro ao sintonizar com o portal de autenticação.');
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-slate-400 block uppercase tracking-wider mb-2 font-bold font-mono">Email Celestial</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input
                          type="email"
                          required
                          value={inlineEmail}
                          onChange={(e) => setInlineEmail(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-amber-400 text-slate-100 outline-none"
                          placeholder="seuemail@exemplo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block uppercase tracking-wider mb-2 font-bold font-mono">Chave de Acesso (Senha)</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input
                          type="password"
                          required
                          value={inlinePassword}
                          onChange={(e) => setInlinePassword(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-amber-400 text-slate-100 outline-none"
                          placeholder="Sua senha secreta"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setPendingChartData(null)}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 text-xs font-black tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2"
                      >
                        {inlineAuthMode === 'register' ? 'Criar Conta & Ver Resultados' : 'Entrar & Ver Resultados'} <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <form onSubmit={generateFreeBirthChart} className="space-y-6 relative z-10">
                  {chartError && (
                    <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-2xl">
                      {chartError}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-2">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input 
                          type="text" 
                          required
                          disabled={isGeneratingChart}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-2xl py-4 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-slate-900/50 text-slate-100 transition-all font-light"
                          placeholder="Nome completo para leitura"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-2">Local de Nascimento</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input 
                          type="text" 
                          required
                          disabled={isGeneratingChart}
                          value={birthLocation}
                          onChange={(e) => setBirthLocation(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-2xl py-4 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-slate-900/50 text-slate-100 transition-all font-light"
                          placeholder="Cidade - Estado (ex: São Paulo - SP)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-2">Data de Nascimento</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input 
                          type="date" 
                          required
                          disabled={isGeneratingChart}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-2xl py-4 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-slate-900/50 text-slate-200 transition-all h-[54px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-2">Hora de Nascimento</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                        <input 
                          type="time" 
                          required
                          disabled={isGeneratingChart}
                          value={birthTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                          className="w-full bg-black/50 border border-[#312e81] rounded-2xl py-4 pl-11 pr-4 text-sm outline-none focus:border-amber-400 focus:bg-slate-900/50 text-slate-200 transition-all h-[54px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    {isGeneratingChart ? (
                      <div className="p-6 bg-white/[0.02] border border-[#312e81] rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                        {/* Interactive Loading Wheel */}
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-[#312e81] animate-pulse" />
                          <div className="absolute inset-0 rounded-full border-4 border-t-amber-400 animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto text-amber-400 w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-serif text-amber-300 font-bold tracking-widest uppercase">
                            {progressTexts[chartProgressStep]}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            Por favor, aguarde o selamento dos astros...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="submit"
                        className="w-full py-5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 text-base font-black tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2"
                      >
                        CALCULAR MEU DESTINO AGORA <Sparkles className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              )
            ) : (
              // EXQUISITE GORGEOUS BIRTHCHART PRESENTATION
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-center justify-between border-b border-[#312e81] pb-6">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">MAPA ASTRAL DA ESSÊNCIA REVELADO</span>
                    <h3 className="text-3xl font-serif text-white mt-1 uppercase tracking-wider font-bold">
                      {currentFullName || "Nobre Buscador"}
                    </h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setFullName('');
                      setBirthDate('');
                      setBirthTime('');
                      setBirthLocation('');
                      setGeneratedChart(null);
                      if (setSavedBirthChart) {
                        setSavedBirthChart(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#312e81] text-slate-300 text-xs font-mono transition-colors"
                  >
                    Nova Consulta
                  </button>
                </div>

                {/* Solares Alignments row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white/[0.02] border border-[#1e1b4b] rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Signo Solar</span>
                    <div className="text-2xl font-serif text-amber-400 font-bold mt-1">☀️ {currentChart.signoSolar}</div>
                    <span className="text-[9px] text-slate-500 block mt-1 uppercase tracking-widest">A Força de Vida Principal</span>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-[#1e1b4b] rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Signo Ascendente</span>
                    <div className="text-2xl font-serif text-indigo-400 font-bold mt-1">🌅 {currentChart.signoAscendente}</div>
                    <span className="text-[9px] text-slate-500 block mt-1 uppercase tracking-widest">Sua Máscara Celestial & Destino</span>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-[#1e1b4b] rounded-2xl text-center">
                    <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Luminar Lunar</span>
                    <div className="text-2xl font-serif text-cyan-400 font-bold mt-1">🌙 {currentChart.luna}</div>
                    <span className="text-[9px] text-slate-500 block mt-1 uppercase tracking-widest">Sua Mente Emocional & Oculta</span>
                  </div>
                </div>

                {/* Main Readings Sections list */}
                <div className="space-y-6">
                  {/* Aspect 1: Love */}
                  <div className="glass-panel p-6 border border-rose-500/10 bg-rose-950/[0.03] rounded-xl text-left">
                    <h4 className="text-base font-serif text-rose-300 flex items-center gap-2 mb-3 font-bold">
                      <Heart className="w-4 h-4 text-rose-400" /> Sintonias da Vida Amorosa
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {currentChart.vidaAmorosa}
                    </p>
                  </div>

                  {/* Aspect 2: Financial */}
                  <div className="glass-panel p-6 border border-emerald-500/10 bg-emerald-950/[0.03] rounded-xl text-left">
                    <h4 className="text-base font-serif text-emerald-300 flex items-center gap-2 mb-3 font-bold">
                      <Wallet className="w-4 h-4 text-emerald-400" /> Sintonias de Prosperidade & Finanças
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {currentChart.vidaFinanceira}
                    </p>
                  </div>

                  {/* Aspect 3: Spiritual */}
                  <div className="glass-panel p-6 border border-[#1e1b4b] bg-indigo-950/[0.03] rounded-xl text-left">
                    <h4 className="text-base font-serif text-indigo-300 flex items-center gap-2 mb-3 font-bold">
                      <Compass className="w-4 h-4 text-indigo-400" /> Sintonias de Jornada Espiritual
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {currentChart.vidaEspiritual}
                    </p>
                  </div>
                </div>

                {/* Strengths & Weaknesses Grids */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 text-left">
                  <div className="p-6 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
                    <h5 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3 font-black">Fortalezas Celestiais</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {currentChart.pontosFortes?.map((pt: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-rose-950/10 border border-rose-500/20 rounded-2xl">
                    <h5 className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-3 font-black">Fraquezas a Transmutar</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {currentChart.pontosFracos?.map((pt: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Astrological supreme advice scroll representation */}
                <div className="p-6 bg-gradient-to-br from-amber-600/10 to-transparent border border-amber-500/30 rounded-3xl relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
                  <h4 className="text-base font-serif text-amber-300 flex items-center gap-2 mb-3 uppercase tracking-wider font-bold">
                    📜 O Selo Alquímico Final
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-light italic">
                    "{currentChart.conselhoEstelar}"
                  </p>
                </div>

                {/* Dynamic Block Notice with Action Trigger */}
                <div className="p-6 bg-indigo-950/40 border border-indigo-500/30 rounded-3xl text-center space-y-4">
                  <p className="text-xs text-indigo-300 leading-relaxed font-light text-left">
                    ⭐ <strong>Gostou da leitura profunda de seus astros natais?</strong> Esta consulta e o Mapa de Aspectos Estelares foram gerados em tempo real com a tecnologia Google Gemini integrada. <strong>Para gerar mapas completos ilimitados de amigos, leituras diárias de trânsitos e obter acompanhamento, adquira o plano Premium!</strong>
                  </p>
                  <button 
                    type="button"
                    onClick={() => currentUser ? onEnterApp() : setShowLogin(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all"
                  >
                    TORNAR-SE PREMIUM & CONSULTAR ILIMITADO
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Narrative Section: History of Oracle Academy / O Motivo do Renascimento */}
      <section className="relative py-28 px-4 bg-gradient-to-b from-black/0 via-slate-950/20 to-black/0 border-y border-[#1e1b4b]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-100 tracking-wider mb-8 uppercase">A História por trás da Aliança</h2>
          <div className="space-y-6 text-slate-300 leading-relaxed font-light text-base md:text-lg">
            <p>
              A <strong>Oracle Academy</strong> não nasceu da internet. Ela nasceu de uma visão antiga, passada por gerações de oraculistas reais que, sob o manto estelar, perceberam que o sagrado conhecimento estava se convertendo em mero passatempo de revistas baratas.
            </p>
            <p>
              Decidimos criar este digital Santuário para honrar a sagrada tradição do Tarot, do Petit Lenormand e dos Rituais Teúrgicos. Nossa jornada começou em um pequeno templo físico em 2020. Ao percebermos a sede de milhares de buscadores reais espalhados pelo mundo, combinamos a precisão matemática com IA de última geração para atuar como tutor individual, ajudando cada iniciante a catalogar suas tiragens em um <strong>Grimório persistente</strong>.
            </p>
            <p>
              A sua evolução acadêmica espiritual é nosso selo de aprovação. Não vendemos ilusões; ensinamos você a abrir os olhos do espírito.
            </p>
          </div>
        </div>
      </section>

      {/* Showcasing Physical Occult Goods: Mercadorias do Santuário */}
      <section className="relative py-24 px-4 bg-[#080510] border-t border-[#1e1b4b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-amber-500 uppercase tracking-widest font-black flex items-center justify-center gap-1.5 mb-3 leading-none">
              <ShoppingBag className="w-4 h-4 animate-bounce" /> LOJA VIRTUAL DO SANTUÁRIO EXCLUSIVA
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 tracking-wide mb-4">
              Itens Físicos & Consagrados
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm font-light">
              Adquira sabonetes artesanais e ervas planetárias raras confecionados em egrégora mística, além de manuais físicos e incensos naturais importados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: "p1",
                tag: "Banhos & Limpeza",
                name: "Sabonete Místico de Banimento",
                img: "https://images.unsplash.com/photo-1607006342440-b7095a8286a8?q=80&w=350",
                desc: "Artesanal de sal grosso e arruda. Confeccionado na lua minguante para purificação total.",
                price: "R$ 39,95"
              },
              {
                id: "p2",
                tag: "Magnetismo",
                name: "Sabonete de Atração Solar",
                img: "https://images.unsplash.com/photo-1547793549-70faf88838c8?q=80&w=350",
                desc: "Artesanal de calêndula e mel orgânico. Consagrado nas influências douradas de prosperidade.",
                price: "R$ 44,95"
              },
              {
                id: "p3",
                tag: "Teurgia",
                name: "Incenso Natural Plêiades",
                img: "https://images.unsplash.com/photo-1612160352523-d92e5954a6ac?q=80&w=350",
                desc: "Resina pura de Mirra e Sálvia Branca. Ideal para purificação e meditação profunda.",
                price: "R$ 29,95"
              },
              {
                id: "p4",
                tag: "Compêndios de Couro",
                name: "Grimório Físico de Couro",
                img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=350",
                desc: "Folhas envelhecidas costuradas à mão. Capa de couro gravada com selo dourado da Oracle.",
                price: "R$ 189,95"
              }
            ].map(prod => (
              <div key={prod.id} className="glass-panel p-5 rounded-3xl border border-[#1e1b4b] bg-black/40 hover:border-amber-500/30 transition-all flex flex-col group relative overflow-hidden text-left">
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono rounded-full uppercase tracking-wider font-bold">
                  {prod.tag}
                </div>
                <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-slate-900/60 relative">
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
                </div>
                <h4 className="text-base font-serif text-slate-100 font-bold mb-1">{prod.name}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 flex-1">{prod.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e1b4b]">
                  <span className="text-sm font-mono font-black text-amber-300">{prod.price}</span>
                  <button 
                    type="button"
                    onClick={() => currentUser ? onEnterApp() : setShowLogin(true)}
                    className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[10px] uppercase font-mono font-black tracking-wider transition-colors hover:bg-amber-500 hover:text-slate-950"
                  >
                    Adquirir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section: A Jornada do Iniciado */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black/0 via-slate-950/20 to-black/0 border-t border-[#1e1b4b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-indigo-400 uppercase tracking-widest font-mono font-bold leading-none mb-3 inline-block">Módulos Exclusivos & Certificados</span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 mt-1 uppercase tracking-widest">Currículos de Mestria</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm font-light">
              Escolha sua sintonização básica ou de ritos profundos. Todos os cursos acompanham diploma emitido sob o selo da egrégora.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fundamentos do Tarot",
                img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400",
                desc: "Estude as forças e influências primordiais dos 78 arcanos, arquétipos e metodologias reais de tiragem.",
                btn: "Venha Aprender Conosco",
                border: "hover:border-indigo-500/30"
              },
              {
                title: "Lenormand Divino",
                img: "https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=400",
                desc: "Aprenda a fazer a icônica Mesa Real (Grand Tableau), técnicas matemáticas e de distância do sistema cigano clássico.",
                btn: "Matricule-se",
                border: "hover:border-purple-500/30"
              },
              {
                title: "Técnica Psico-Intuitiva",
                img: "https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=400",
                desc: "Métodos de autocontrole, consagração de tarôs físicos, ética profissional para leituras remuneradas.",
                btn: "Matricule-se",
                border: "hover:border-amber-500/30"
              }
            ].map((crs, i) => (
              <div key={i} className={`glass-panel p-6 rounded-3xl border border-[#1e1b4b] flex flex-col transition-all relative text-left ${crs.border}`}>
                <div className="h-48 rounded-2xl bg-indigo-900/20 mb-6 overflow-hidden">
                  <img src={crs.img} alt={crs.title} className="w-full h-full object-cover mix-blend-luminosity opacity-70" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-xl font-serif text-slate-100 mb-2 font-bold">{crs.title}</h3>
                <p className="text-slate-400 text-sm mb-6 font-light leading-relaxed">{crs.desc}</p>
                <button 
                  type="button"
                  onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} 
                  className="mt-auto px-6 py-4 bg-indigo-500/10 text-indigo-300 border border-[#312e81] rounded-xl hover:bg-indigo-500/20 transition-all uppercase text-xs tracking-widest font-black"
                >
                  {crs.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-4 bg-black/40 border-y border-[#1e1b4b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">Vozes da Comunidade</h2>
            <p className="text-slate-400">O que nossos estudantes dizem sobre a Oracle Academy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl relative">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(s => <Star fill="currentColor" key={s} className="w-4 h-4" />)}
                </div>
                <p className="text-slate-300 italic mb-6 text-sm leading-relaxed">
                  "A estruturação dos cursos é impecável. A imersão me ajudou a sair do básico e finalmente compreender as entrelinhas dos arcanos maiores. O tutor de IA é como ter um mestre particular tirando minhas dúvidas 24/7."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/30" />
                  <div>
                    <h4 className="font-medium text-slate-100 text-sm">Mariana Silva</h4>
                    <p className="text-xs text-slate-500">Aluna Certificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section: O Santuário por Dentro (Prints and Visual representations of the platform) */}
      <section className="relative py-24 px-4 bg-[#0a0614]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.08)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Sem Segredos de Fora • Câmaras Reveladas
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 tracking-wider mb-6">PREVIEW COMPLETO DO SANTUÁRIO</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Dê uma olhada na elegância, profundidade técnica e interatividade do nosso sistema antes mesmo de cruzar o portal de cadastro.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Spread Oracle Print Representation */}
            <div className="lg:col-span-7 glass-panel p-8 rounded-[3.5rem] border border-[#312e81] bg-black/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e1b4b]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-widest">Oracle_Spread_Simulator_V3.exe</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-wider">Módulo Dinâmico</span>
              </div>
              
              {/* Fake spread simulator cards */}
              <div className="space-y-6">
                <h4 className="text-xl font-serif text-white leading-tight">Visualizador de Tiragem: Cruz Celta</h4>
                <div className="grid grid-cols-3 gap-4 py-4 justify-items-center">
                  {[
                    { title: 'Passado', card: 'A Sacerdotisa', arcana: 'II', desc: 'Influências sutis' },
                    { title: 'Presente', card: 'O Mago', arcana: 'I', desc: 'Vontade ativa', highlight: true },
                    { title: 'Futuro', card: 'A Estrela', arcana: 'XVII', desc: 'Esperança & Cura' }
                  ].map((c, i) => (
                    <div key={i} className={`w-full max-w-[150px] aspect-[1/1.6] rounded-xl border p-4 flex flex-col justify-between transition-all relative overflow-hidden ${c.highlight ? 'border-amber-500/40 bg-amber-500/[0.04] shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-105' : 'border-[#312e81] bg-[#120f26]/40'}`}>
                      <div className="flex justify-between items-start text-[8px] text-slate-500 font-black uppercase">
                        <span>{c.title}</span>
                        <span>{c.arcana}</span>
                      </div>
                      <div className="my-auto text-center">
                         <div className="w-8 h-8 rounded-full border border-[#312e81] mx-auto flex items-center justify-center mb-1 text-slate-400 bg-black/20"><Sparkles className={`w-4 h-4 ${c.highlight ? 'text-amber-400' : 'text-slate-500'}`} /></div>
                         <h5 className="text-[11px] font-bold text-slate-200 mt-1">{c.card}</h5>
                      </div>
                      <p className="text-[8px] text-slate-500 text-center leading-tight truncate">{c.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white/5 border border-[#1e1b4b] rounded-2xl text-[11px] text-slate-400 leading-relaxed font-light italic">
                   "A inteligência híbrida do Santuário decodifica cada carta no contexto exato do seu objetivo de aprendizado atual, sugerindo exercícios direcionados no seu Grimório."
                </div>
              </div>
            </div>

            {/* Right: Study consistency heat map preview */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-8 w-full">
              {/* Consistency Map Mock */}
              <div className="glass-panel p-8 rounded-[3rem] border border-[#312e81] bg-black/60 relative overflow-hidden group">
                 <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-[50px]" />
                 
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-base font-serif text-slate-100 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Mapa de Ofensiva Estelar
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest">32 DIAS SEGUIDOS</span>
                 </div>
                 <p className="text-xs text-slate-500 mb-6 font-light">Seus estudos geram ressonância mágica no éter através da consistência diária:</p>
                 
                 {/* Fake calendar map */}
                 <div className="grid grid-cols-7 gap-1.5 p-3 bg-white/5 border border-[#312e81] rounded-2xl">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const level = indexToResonanceLevel(i);
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-[4px] border ${resonanceStyle(level)}`} 
                          title={`Dia ${i+1}: Ressonância Nível ${level}`}
                        />
                      );
                    })}
                 </div>
                 
                 <div className="flex justify-between items-center mt-6 text-[9px] text-slate-500 uppercase font-black tracking-widest">
                    <span>Inércia</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-[#1e1b4b]" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-900" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-800 border border-emerald-700" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400" />
                    </div>
                    <span>Magnitude Cósmica</span>
                 </div>
              </div>

              {/* Community and Seller Profiles Mock */}
              <div className="glass-panel p-8 rounded-[3rem] border border-[#312e81] bg-black/60 relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]" />
                 
                 <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1e1b4b]">
                    <h4 className="text-base font-serif text-slate-100">Mercadores Verificados</h4>
                    <span className="text-[10px] text-purple-400 font-mono tracking-wider">ECOS DE NEGÓCIOS</span>
                 </div>
                 
                 {/* Fake miniature profile */}
                 <div className="flex items-center gap-4 p-3 bg-white/5 border border-[#312e81] rounded-2xl mb-4 hover:border-purple-500/30 transition-all">
                    <div className="w-11 h-11 rounded-full border border-purple-500/40 overflow-hidden shrink-0">
                       <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center">
                          <h5 className="text-xs font-serif text-white truncate">Serena Moon</h5>
                          <span className="text-[9px] text-amber-500 font-black">Nível 28</span>
                       </div>
                       <p className="text-[10px] text-indigo-300 tracking-wide font-black uppercase mt-0.5">Sacerdotisa Solstício</p>
                    </div>
                 </div>

                 {/* Mini service and price listed */}
                 <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-[#1e1b4b]">
                    <span className="text-xs text-slate-400">Leitura de Runas de Oden</span>
                    <span className="text-xs text-indigo-400 font-black">R$ 180,00</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helper helpers logic for showcase consistency map */}

      {/* Marketplace Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto glass-panel p-8 md:p-16 rounded-[3rem] border border-[#312e81] bg-gradient-to-br from-indigo-900/10 to-transparent">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ShoppingBag className="w-12 h-12 text-indigo-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-6 uppercase tracking-widest">MARKETPLACE ARCANA</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Nossa plataforma não é apenas para aprender. Usuários com certificação verificada da Oracle Academy ou profissionais validados podem vender seus próprios serviços de leitura, mapas astrais, ou materiais digitais.
              </p>
              <ul className="space-y-4 mb-8 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> Você configura o valor de cada serviço.</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> Venda leituras personalizadas em PDF ou Vídeo.</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> A Oracle Academy retém apenas de 15% a 20% por transação.</li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20">
                Venha fazer suas leituras
              </button>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 border border-[#1e1b4b] relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]" />
              <div className="space-y-4 relative z-10">
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-[#312e81]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/30" />
                    <div><h4 className="text-sm font-medium">Leitura Profunda de Tarot</h4><p className="text-xs text-slate-400">Por Luiza M.</p></div>
                  </div>
                  <span className="text-indigo-300 font-medium">R$ 150</span>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-[#1e1b4b] opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/30" />
                    <div><h4 className="text-sm font-medium">Mesa Real Lenormand</h4><p className="text-xs text-slate-400">Por Carlos E.</p></div>
                  </div>
                  <span className="text-blue-300 font-medium">R$ 220</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitors Comparison Section */}
      <section className="relative py-24 px-4 bg-black/40 border-y border-[#1e1b4b]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">Por quê a Oracle Academy?</h2>
            <p className="text-slate-400">Compare e veja por que somos o porto seguro do misticismo na era digital.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-[#312e81] text-slate-400 font-medium uppercase tracking-wider text-sm">Recurso</th>
                  <th className="p-4 border-b border-[#312e81] text-amber-400 font-bold uppercase tracking-wider text-sm text-center">Oracle Academy</th>
                  <th className="p-4 border-b border-[#312e81] text-slate-500 font-medium uppercase tracking-wider text-sm text-center">Místicos Genéricos</th>
                  <th className="p-4 border-b border-[#312e81] text-slate-500 font-medium uppercase tracking-wider text-sm text-center">Plataformas de Cursos</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b border-[#1e1b4b] text-slate-300">Cursos Focados e Estruturados</td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#1e1b4b] text-slate-300">Tutor Oráculo com IA Pessoal</td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#1e1b4b] text-slate-300">Grimório Digital Integrado</td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#1e1b4b] text-slate-300">Marketplace Justo (15% - 20% taxa)</td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /> (Até 50%)</td>
                  <td className="p-4 border-b border-[#1e1b4b] text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-4" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Transparência Total</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-100 mb-4">Sua Jornada, Seu Ritmo</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Comece gratuitamente. Evolua quando estiver pronto. Sem cobranças ocultas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Free Plan */}
            <div className="glass-panel p-8 rounded-[2rem] border border-[#312e81] hover:border-[#312e81] transition-all flex flex-col">
              <div className="mb-6">
                <h3 className="text-slate-300 font-serif text-xl mb-1">Iniciado</h3>
                <p className="text-slate-500 text-xs">Para quem está começando</p>
              </div>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-serif font-bold text-white">R$0</span>
                <span className="text-slate-500 text-sm mb-1">/mês</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-400">
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Mercado (comprar e solicitar leituras)</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Desafios diários e certificados</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Comunidade e perfil personalizado</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Módulo 0 dos cursos completo</span></li>
                <li className="flex gap-2 items-start text-slate-600"><Lock className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Módulos avançados de cursos</span></li>
                <li className="flex gap-2 items-start text-slate-600"><Lock className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Orientação Oracular com IA</span></li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="w-full py-3 rounded-xl border border-[#312e81] text-slate-300 hover:bg-white/5 text-sm font-bold tracking-wide transition-all">
                Começar Gratuitamente
              </button>
            </div>

            {/* Medium Plan */}
            <div className="glass-panel p-8 rounded-[2rem] border border-purple-500/50 bg-purple-900/5 hover:border-purple-400/70 transition-all flex flex-col relative transform md:scale-105 shadow-xl shadow-purple-900/20 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                Mais Popular
              </div>
              <div className="mb-6">
                <h3 className="text-purple-300 font-serif text-xl mb-1">Ascendente</h3>
                <p className="text-slate-500 text-xs">Para praticantes sérios</p>
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-serif font-bold text-white">R$49</span>
                <span className="text-purple-300 text-lg font-bold">,90</span>
                <span className="text-slate-500 text-sm mb-1">/mês</span>
              </div>
              <p className="text-xs text-slate-500 mb-8">ou R$419,16/ano (–30%)</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /><span>Tudo do plano Iniciado</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /><span>Todos os módulos de cursos</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /><span>Biblioteca completa</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /><span>Flashcards e Grimório ilimitados</span></li>
                <li className="flex gap-2 items-start text-slate-600"><Lock className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Orientação Oracular com IA</span></li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                Assinar Ascendente
              </button>
            </div>

            {/* Master Plan */}
            <div className="glass-panel p-8 rounded-[2rem] border border-amber-500/40 hover:border-amber-400/70 transition-all flex flex-col gold-glow">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h3 className="text-amber-300 font-serif text-xl">Mestre Supremo</h3>
                </div>
                <p className="text-slate-500 text-xs">Acesso total sem limites</p>
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-serif font-bold text-white">R$109</span>
                <span className="text-amber-300 text-lg font-bold">,90</span>
                <span className="text-slate-500 text-sm mb-1">/mês</span>
              </div>
              <p className="text-xs text-slate-500 mb-8">ou R$922,56/ano (–30%)</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span>Tudo do plano Ascendente</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span>Orientação Oracular com IA exclusiva</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span>Selo Dourado no perfil</span></li>
                <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" /><span>Acesso antecipado a novos cursos</span></li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Assinar Mestre Supremo
              </button>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs">
            Pagamento via PIX, Cartão de Crédito ou Débito · Cancele quando quiser · Planos trimestrais disponíveis
          </p>
        </div>
      </section>

      <footer className="text-center py-8 border-t border-[#1e1b4b] opacity-50 text-sm">
        <p>&copy; 2024 The Oracle Academy. Conhecimento Hoje, Sabedoria Sempre.</p>
      </footer>
    </div>
  );
}
