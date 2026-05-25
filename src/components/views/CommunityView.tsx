import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, MessageSquare, Heart, Share2, Plus, 
  Sparkles, Moon, Star, Image as ImageIcon, Video, 
  Compass, Shield, X, MoreHorizontal, CheckCircle2, 
  Navigation, Award, Book, Globe, Instagram, Send, Lock,
  ChevronRight, Bookmark, MapPin, Zap, Trash2, Eye, 
  RefreshCw, Calendar, Check, AlertCircle, ShoppingBag, 
  MessageCircle, FileText, UserCheck, UserPlus, CornerUpRight, 
  Play, File, Link, BookOpen, Crown, ExternalLink, MoonStar,
  FileCode, Quote, GripVertical, CheckSquare, Sparkle, AlertTriangle, Upload, Clock, Flame,
  HelpCircle, GraduationCap, Settings2
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { CheckoutBrick } from '../payments/CheckoutBrick';

// Base initial group data (Covens)
const DEFAULT_COVENS = [
  { id: 1, name: 'Tarot Avançado', members: 1205, description: 'Estudos profundos de arcanos e tiragens rítmicas.', joined: true, image: 'https://images.unsplash.com/photo-1633519895058-20d04fd2e78d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 2, name: 'Ocultismo Prático', members: 840, description: 'Tradições seculares, rituais herméticos e alta magia astral.', joined: false, image: 'https://images.unsplash.com/photo-1510064295325-1e391b1a45ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Privado' },
  { id: 3, name: 'Astrologia Kármica', members: 2310, description: 'Revolução solar, mapa astral zodiacal e alinhamento celestial.', joined: true, image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 4, name: 'Magia Natural & Ervas', members: 4500, description: 'Conexão elemental com a natureza, chás rituais e botânica espiritual.', joined: false, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
];

// Curated mystic news articles
const MYSTICAL_NEWS = [
  {
    id: 'n1',
    title: 'Portais Celestiais: Alinhamento de Júpiter em Gêmeos abre canais de Intuição Prática',
    summary: 'Astrólogos alertam para aceleração de pensamentos e clareza oracular inédita nas próximas semanas, facilitando leituras rápidas e transmutação mental.',
    date: 'Hoje',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
    content: 'Os céus se preparam para uma conjunção alquímica de profunda ressonância intelectual. Júpiter, o planeta da expansão espiritual e sabedoria, faz um trígono harmônico com os astros regentes na constelação de Gêmeos. Este trânsito específico desperta a agilidade hermética, permitindo que os praticantes de Tarot, Runas e Astrologia conectem conceitos abstratos com assombrosa facilidade empírica.\n\nEspecialistas recomendam consagrar novos baralhos de cartas e manter um bloco de notas ao lado dos altares, pois as revelações akáshicas descerão em fluxos rápidos e contínuos, exigindo registro imediato para preservação ritualística.'
  },
  {
    id: 'n2',
    title: 'Pesquisa Médica e Frequências Vibracionais: Práticas de Meditação Elevam Frequência Cardíaca Sutil',
    summary: 'Estudos de bioenergética demonstram que ritos guiados harmonizam o campo áurico celular, estimulando ressonância intuitiva profunda.',
    date: 'Ontem',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=80',
    content: 'A ciência de ponta continua tateando as fronteiras invisíveis do hermetismo antigo. Novas medições com eletroencefalografia multicanal durante rituais de manifestação lunar expuseram ondas gama coerentes em áreas do lobo frontal ligadas à tomada de decisão e clarividência simbólica.\n\nEsses ensaios clínicos provam que o estado meditativo guiado por incensos, velas coloridas e visualização estimula o nervo vago de maneira singular, justificando as sensações de paz celestial descritas pelos oraculistas tradicionais.'
  },
  {
    id: 'n3',
    title: 'Arqueologia Hermética: Descoberta de Pergaminho de Thoth com fórmulas rituais inéditas no Egito',
    summary: 'Arqueólogos independentes revelaram papiro centenário contendo invocações estelares de cura mental e reequilíbrio energético elemental.',
    date: '3 dias atrás',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1600367163103-93694001cff3?auto=format&fit=crop&w=400&q=80',
    content: 'Próximo das ruínas do templo de Hermópolis Magna, uma expedição resgatou uma série de fragmentos de papiro selados em jarros de argila vulcânica. Traduzido preliminarmente, o texto ensina o uso de velas de azeite e invocações rítmicas dedicadas à inteligência de Mercúrio para restaurar focos perturbados por interferências do éter mundano.\n\nAs fórmulas rituais serão replicadas em workshops ao vivo promovidos por membros de nossa egrégora oracular.'
  }
];

// Rich marketplace catalog for users/profiles
const SELLER_PRODUCTS: Record<string, any[]> = {
  'Elias Thorne': [
    { id: 'p1', title: 'Consultoria Individual Alquímica', price: 380, type: 'Consulta', desc: 'Análise detalhada do seu momento planetário com purificação áurica por elementos vegetais.', icon: Sparkles },
    { id: 'p2', title: 'Manual Prático dos Arcanos Maiores', price: 95, type: 'Livro', desc: 'Livro digital definitivo com interpretações astrológicas e correlações rítmicas de cada arcano.', icon: Book },
    { id: 'p3', title: 'Elixir Vibracional Estelar', price: 120, type: 'Consagrável', desc: 'Preparado homeopático sob a lua cheia focado em purificação mental.', icon: Zap }
  ],
  'Serena Moon': [
    { id: 'p4', title: 'Ritual de Alinhamento Psico-Espiritual', price: 200, type: 'Consulta', desc: 'Alinhamento dos centros de energia em tempo real com invocações e consagração lunar dirigida.', icon: Users },
    { id: 'p5', title: 'Guia de Ervas Sagradas e Chás Ocultos', price: 85, type: 'Livro', desc: 'Compêndio de botânica espiritual prática e fórmulas para feitiços elementais cotidianos.', icon: BookOpen }
  ],
  'Marcus Vane': [
    { id: 'p6', title: 'Estudo Cartográfico da Geometria Sagrada', price: 300, type: 'Consulta', desc: 'Mapeamento das assinaturas físicas e matemáticas de seu destino individualizado.', icon: Compass },
    { id: 'p7', title: 'Curso de Hermetismo Aplicado', price: 500, type: 'Serviço', desc: 'Quatro semanas de mentoria particular com práticas teúrgicas avançadas.', icon: Shield }
  ]
};

const EXTRA_PROFILES_DATA: Record<string, any> = {
  'Elias Thorne': {
    bio: 'Tecendo conexões cristalinas entre o éter e a terra física. Especialista em Alquimia e Trânsitos Kármicos.',
    grau: 'Grau IX - Mestre Ascenso',
    level: 28,
    stats: { ecos: 1420, aura: '5.2k', ritos: 110 },
    location: 'Santuário Urânia',
    socials: { ig: '@elias_thorne_astros', web: 'elias.thorne.com' },
    creds: [
      { title: 'Doutor em Teosofia Hermética', source: 'The Oracle Academy', year: '2025' },
      { title: 'Grão-Mestre Coven Real', source: 'Imperial Coven Brasil', year: '2023' }
    ]
  },
  'Serena Moon': {
    bio: 'Sacerdotisa elemental conectada à Mãe Terra e defensora da gnose vegetal pura. Criadora da escola Trilha Lunar.',
    grau: 'Grau VII - Sacerdotisa Iniciada',
    level: 21,
    stats: { ecos: 890, aura: '3.4k', ritos: 76 },
    location: 'Féretros Sagrados da Mantiqueira',
    socials: { ig: '@serena_moonsoul', web: 'trilhalunar.org' },
    creds: [
      { title: 'Especialista em Fitomedicina Espiritual', source: 'Green Hearth', year: '2024' }
    ]
  },
  'Marcus Vane': {
    bio: 'Fascinado pelos mistérios do Todo Mental. Combino proporção áurea, matemática de Fibonacci e oráculos rítmicos antigos.',
    grau: 'Grau V - Adepto de Linha de Força',
    level: 16,
    stats: { ecos: 410, aura: '1.8k', ritos: 29 },
    location: 'Laboratório Alquímico de Geometria',
    socials: { ig: '@marcus_vane', web: 'vanegeometry.space' },
    creds: [
      { title: 'Iniciador da Tradição Áurea', source: 'Santuário de Sothis', year: '2021' }
    ]
  }
};

export function CommunityView({ currentUser }: { currentUser: any }) {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'feed' | 'covens' | 'ciclo' | 'notificacoes'>('feed');
  const [activeCovenFilter, setActiveCovenFilter] = useState<string | null>(null);
  
  // Persistence elements loads
  const [covens, setCovens] = useState(() => {
    const saved = localStorage.getItem('oracle_community_covens');
    return saved ? JSON.parse(saved) : DEFAULT_COVENS;
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Rich formatted composer box
  const [newPostText, setNewPostText] = useState('');
  const [postAttachmentImage, setPostAttachmentImage] = useState('');
  const [postAttachmentVideo, setPostAttachmentVideo] = useState('');
  const [selectedCovenForPost, setSelectedCovenForPost] = useState('Eter');
  const [postTags, setPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Social cycle (friends, follow states)
  const [socialCycle, setSocialCycle] = useState(() => {
    const key = `oracle_social_cycle_${currentUser?.email || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {
      friends: [],
      following: [],
      covenMembers: []
    };
  });

  // Wallet / Purchases simulation
  const [myTransactions, setMyTransactions] = useState<any[]>(() => {
    const key = `oracle_transactions_${currentUser?.email || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [platformBalance, setPlatformBalance] = useState(() => {
    const key = `oracle_balance_${currentUser?.email || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1250; // default starting simulated capital
  });

  // Selected Profile Modal state
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  // Post Detail with Comments modal
  const [selectedDetailPost, setSelectedDetailPost] = useState<any>(null);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [commentsSortOrder, setCommentsSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Interactive share drawer
  const [sharingPost, setSharingPost] = useState<any>(null);
  const [covenCreationName, setCovenCreationName] = useState('');
  const [covenCreationDesc, setCovenCreationDesc] = useState('');
  const [covenCreationImg, setCovenCreationImg] = useState('');
  const [showCovenCreationModal, setShowCovenCreationModal] = useState(false);

  // Interactive active chat overlay
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>(() => {
    const key = `oracle_chat_messages_${currentUser?.email || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {
      'Elias Thorne': [
        { sender: 'Elias Thorne', text: 'Saudações oraculares, buscador! Como andam suas práticas no grimório?', timestamp: 'Hoje às 14:15' }
      ]
    };
  });
  const [currentChatMessageText, setCurrentChatMessageText] = useState('');

  // Selected News reading modal
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [mysticalNews, setMysticalNews] = useState<any[]>([]);
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  // Load Mystical News from backend API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/community/news');
        if (res.ok) {
          const data = await res.json();
          setMysticalNews(data);
        }
      } catch (err) {
        console.error("Error fetching celestial news:", err);
      } finally {
        setIsLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  const handleGenerateNews = async () => {
    setIsGeneratingNews(true);
    try {
      const res = await fetch('/api/community/news/generate', { method: 'POST' });
      if (res.ok) {
        const newArticle = await res.json();
        setMysticalNews(prev => [newArticle, ...prev]);
        setSelectedNews(newArticle);
      }
    } catch (err) {
      console.error("Error generating mystical news with AI:", err);
    } finally {
      setIsGeneratingNews(false);
    }
  };

  // Purchase overlay
  const [purchasingProduct, setPurchasingProduct] = useState<any>(null);
  const [purchaseStep, setPurchaseStep] = useState<'confirm' | 'statement'>('confirm');
  const [purchaseSuccessReceipt, setPurchaseSuccessReceipt] = useState<any>(null);
  const [checkoutPreferenceId, setCheckoutPreferenceId] = useState<string | null>(null);

  // Ref composer reference
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Google APIs tokens for official Meet/Chat redirection
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isMeetCreating, setIsMeetCreating] = useState<string | null>(null);

  // Save state helpers to local storage
  useEffect(() => {
    localStorage.setItem('oracle_community_covens', JSON.stringify(covens));
  }, [covens]);

  useEffect(() => {
    const key = `oracle_social_cycle_${currentUser?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(socialCycle));
  }, [socialCycle, currentUser]);

  useEffect(() => {
    const key = `oracle_transactions_${currentUser?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(myTransactions));
  }, [myTransactions, currentUser]);

  useEffect(() => {
    const key = `oracle_balance_${currentUser?.email || 'guest'}`;
    localStorage.setItem(key, platformBalance.toString());
  }, [platformBalance, currentUser]);

  useEffect(() => {
    const key = `oracle_chat_messages_${currentUser?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(chatMessages));
  }, [chatMessages, currentUser]);

  // Handle load Google Access Token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { getAccessToken } = await import('../../lib/firebase');
        const token = await getAccessToken();
        setGoogleToken(token);
      } catch (err) {
        console.error("Google Auth Token not resolved:", err);
      }
    };
    fetchToken();
  }, []);

  // Fetch posts from PostgreSQL
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Error loading community posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on active filters and search queries
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCovenFilter) {
      result = result.filter(p => p.coven === activeCovenFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.authorName && p.authorName.toLowerCase().includes(q)) ||
        (p.coven && p.coven.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCovenFilter, searchQuery]);

  // Insert rich formatting tags into Composer textarea
  const insertFormatting = (tagOpen: string, tagClose: string) => {
    const textarea = composerTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = tagOpen + (selected || '') + tagClose;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    setNewPostText(newValue);
    
    // Maintain cursor focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + (selected || '').length);
    }, 10);
  };

  // Submit a post
  const handlePostSubmit = async () => {
    if (!newPostText.trim()) return;
    setIsSubmittingPost(true);
    try {
      let finalContent = newPostText;
      let mediaList: string[] = [];
      if (postAttachmentImage.trim()) {
        mediaList.push(postAttachmentImage.trim());
      }
      if (postAttachmentVideo.trim()) {
        mediaList.push(`[video]${postAttachmentVideo.trim()}`);
      }

      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || '1'
        },
        body: JSON.stringify({
          content: finalContent,
          coven: selectedCovenForPost,
          images: mediaList,
          tags: postTags.length > 0 ? postTags : ['Estilo-Livre']
        })
      });

      if (res.ok) {
        const createdPost = await res.json();
        setPosts([createdPost, ...posts]);
        setNewPostText('');
        setPostAttachmentImage('');
        setPostAttachmentVideo('');
        setPostTags([]);
        setShowAttachmentMenu(false);
      } else {
        alert("Falha de transmissão mágica nas tabelas físicas. Post em cache local!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Like a post natively with visual upgrade
  const handleLikePost = async (id: number) => {
    try {
      const res = await fetch(`/api/community/posts/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: data.likes } : p));
        
        // Also update selectedDetailPost if open
        if (selectedDetailPost && selectedDetailPost.id === id) {
          setSelectedDetailPost(prev => ({ ...prev, likes: data.likes }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open details of a post & load comments
  const handleOpenPostDetails = async (post: any) => {
    setSelectedDetailPost(post);
    setLoadingComments(true);
    setCommentsList([]);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setCommentsList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  // Comment on selected post
  const handleCommentSubmit = async () => {
    if (!newCommentText.trim() || !selectedDetailPost) return;
    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/community/posts/${selectedDetailPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id?.toString() || '1'
        },
        body: JSON.stringify({ content: newCommentText })
      });

      if (res.ok) {
        const newCom = await res.json();
        setCommentsList(prev => [...prev, newCom]);
        setNewCommentText('');
        
        // Update comments count back in the main feed list
        setPosts(prev => prev.map(p => p.id === selectedDetailPost.id ? { ...p, comments: (p.comments || 0) + 1 } : p));
        setSelectedDetailPost(prev => ({ ...prev, comments: (prev.comments || 0) + 1 }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Delete a post natively
  const handleDeletePost = async (id: number) => {
    if (!confirm("Tem certeza que deseja dissipar essa postagem permanentemente do éter cósmico?")) return;
    try {
      const res = await fetch(`/api/community/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser?.id?.toString() || '1'
        }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        if (selectedDetailPost && selectedDetailPost.id === id) {
          setSelectedDetailPost(null);
        }
      } else {
        alert("Efeito astral adverso: Somente o emissor da mensagem original pode dissipá-la.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open User Profile dynamically with detailed services and integrations
  const handleOpenUserProfile = (authorName: string, authorAvatar: string) => {
    const extra = EXTRA_PROFILES_DATA[authorName] || {
      bio: 'Buscador místico apaixonado, partilhando visões sobre oráculos e harmonizações na Oracle Academy.',
      grau: 'Grau II - Iniciado do Templo',
      level: 4,
      stats: { ecos: 18, aura: '350', ritos: 2 },
      location: 'Santuário Comum',
      socials: { ig: '@oraculo_aluno' },
      creds: []
    };

    const isFriend = socialCycle.friends.includes(authorName);
    const isFollowing = socialCycle.following.includes(authorName);

    setSelectedProfile({
      name: authorName,
      avatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      isFriend,
      isFollowing,
      ...extra
    });
  };

  // Follow/Unfollow user toggle
  const handleToggleFollow = (name: string) => {
    const isFollowing = socialCycle.following.includes(name);
    let updatedFollowing = [...socialCycle.following];
    if (isFollowing) {
      updatedFollowing = updatedFollowing.filter(f => f !== name);
    } else {
      updatedFollowing.push(name);
    }
    setSocialCycle({ ...socialCycle, following: updatedFollowing });
    if (selectedProfile && selectedProfile.name === name) {
      setSelectedProfile({ ...selectedProfile, isFollowing: !isFollowing });
    }
  };

  // Friend Add/Remove toggle
  const handleToggleFriend = (name: string) => {
    const isFriend = socialCycle.friends.includes(name);
    let updatedFriends = [...socialCycle.friends];
    if (isFriend) {
      updatedFriends = updatedFriends.filter(f => f !== name);
    } else {
      updatedFriends.push(name);
    }
    setSocialCycle({ ...socialCycle, friends: updatedFriends });
    if (selectedProfile && selectedProfile.name === name) {
      setSelectedProfile({ ...selectedProfile, isFriend: !isFriend });
    }
  };

  // Trigger purchase popup
  const startPurchaseFlow = (product: any, sellerName: string) => {
    setPurchasingProduct({ ...product, sellerName });
    setPurchaseStep('confirm');
    setPurchaseSuccessReceipt(null);
  };

  // Execute buy process with automatic system split calculation
  const executeBuyAndCommission = async () => {
    if (!purchasingProduct) return;
    if (platformBalance < purchasingProduct.price) {
      alert("⚠️ Energia financeira mundana insuficiente no seu saldo oracular da plataforma. Adicione créditos na carteira.");
      return;
    }

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: purchasingProduct.title,
          price: purchasingProduct.price,
          quantity: 1,
          sellerName: purchasingProduct.sellerName
        })
      });
      const data = await res.json();
      
      if (data.preferenceId) {
        setCheckoutPreferenceId(data.preferenceId);
        return; // Pause the simulated execution, rely on the brick callback
      } else if (data.init_point) {
        // Redirecionamento completo funcional para o Mercado Pago
        window.open(data.init_point, '_blank');
      } else {
        alert("Erro na inicialização do Checkout do Mercado Pago.");
        return;
      }
    } catch (e) {
      console.error(e);
      alert("Falha de conexão com a API de Pagamento.");
      return;
    }

    const price = purchasingProduct.price;
    const feePercent = Math.random() < 0.5 ? 15 : 20; // 15% or 20% platform commission fee
    const platformCommission = Math.round((price * feePercent) / 100);
    const hostPayout = price - platformCommission;

    // Deduct from balance
    setPlatformBalance(prev => prev - price);

    const transaction = {
      id: `TX-${Date.now()}`,
      productTitle: purchasingProduct.title,
      price,
      sellerName: purchasingProduct.sellerName,
      platformFeePercent: feePercent,
      platformCommission,
      hostPayout,
      date: new Date().toLocaleDateString('pt-BR'),
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    setMyTransactions(prev => [transaction, ...prev]);
    setPurchaseSuccessReceipt(transaction);
    setPurchaseStep('statement');

    // Quick reactive simulation for group feeds
    const automaticPost = {
      id: Math.round(Math.random() * 99999 + 100000),
      authorName: 'Santuário Oracle Pay',
      authorTitle: 'Sistema Oficial',
      avatar: 'https://images.unsplash.com/photo-1510064295325-1e391b1a45ab?q=80&w=150',
      coven: 'Oracle Pay',
      content: `🌌 **Transmutação de Conhecimento Efetuada!** O buscador adquiriu o item **"${purchasingProduct.title}"** listado por **${purchasingProduct.sellerName}**!\n\n🎓 *Selo de Garantia Oracle Academy de Transferência Justa (Comissão recolhida: ${feePercent}%)*`,
      images: [],
      likes: 1,
      comments: 0,
      time: 'Agora',
      tags: ['Transação', 'Biblioteca', 'Coven-Pay']
    };
    setPosts(prev => [automaticPost, ...prev]);
  };

  // Chat window operations
  const openChatWith = (name: string) => {
    setActiveChatUser(name);
    setSelectedProfile(null); // auto close profile popup for cleaner UX
    if (!chatMessages[name]) {
      setChatMessages({
        ...chatMessages,
        [name]: [
          { sender: name, text: `Saudações teúrgicas! Como posso ajudar você hoje na sua busca pelo portal místico?`, timestamp: 'Agora' }
        ]
      });
    }
  };

  // Send message in floating chat
  const handleSendChatMessage = () => {
    if (!currentChatMessageText.trim() || !activeChatUser) return;
    const msg = {
      sender: 'currentUser',
      text: currentChatMessageText.trim(),
      timestamp: 'Agora'
    };
    
    const updatedMessages = [...(chatMessages[activeChatUser] || []), msg];
    setChatMessages({
      ...chatMessages,
      [activeChatUser]: updatedMessages
    });
    setCurrentChatMessageText('');

    // Trigger reactive dynamic divine answers from the oracle experts
    setTimeout(() => {
      const answers = [
        "As estrelas revelam que seu progresso é excelente. Continue sintonizando seu grimório!",
        "Um magnífico alinhamento na sua casa lunar trará respostas espirituais profundas amanhã.",
        "Recomendo ler o capítulo 3 da nossa biblioteca sagrada para sintonizar a mente profunda.",
        "Saia do ruído cotidiano e consagre 10 minutos para meditação com velas de sândalo hoje."
      ];
      const randomAns = answers[Math.floor(Math.random() * answers.length)];
      setChatMessages(prev => ({
        ...prev,
        [activeChatUser]: [
          ...(prev[activeChatUser] || []),
          { sender: activeChatUser, text: `✨ [Mentor Digital]: ${randomAns}`, timestamp: 'Agora' }
        ]
      }));
    }, 1200);
  };

  // Create a whole custom group coven
  const handleCreateCoven = () => {
    if (!covenCreationName.trim() || !covenCreationDesc.trim()) {
      alert("Indique o nome e o selo da intenção do coven.");
      return;
    }
    const newCov = {
      id: Date.now(),
      name: covenCreationName.trim(),
      members: 1,
      description: covenCreationDesc.trim(),
      joined: true,
      image: covenCreationImg.trim() || 'https://images.unsplash.com/photo-1510064295325-1e391b1a45ab?q=80&w=150',
      type: 'Público'
    };
    setCovens([newCov, ...covens]);
    setCovenCreationName('');
    setCovenCreationDesc('');
    setCovenCreationImg('');
    setShowCovenCreationModal(false);
    alert(`Egrégora "${newCov.name}" estabelecida com sucesso no santuário!`);
  };

  // Google Meet live orchestration via API
  const handleStartGoogleMeet = async (name: string) => {
    try {
      setIsMeetCreating(name);
      const { getAccessToken } = await import('../../lib/firebase');
      const token = await getAccessToken();
      
      if (!token) {
        if (confirm(`⚠️ Conta do Google não integrada ao Workspace oracular para videoconferência direta.\n\nDeseja realizar o checkout espiritual e criar uma sala de atendimento padrão gratuita no Google Meet?`)) {
          window.open('https://meet.google.com/new', '_blank');
        }
        return;
      }

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: `Consulta Oracular: ${name}`,
          description: 'Videoconferência mística agendada e criptografada via Oracle Academy.',
          start: { dateTime: new Date().toISOString() },
          end: { dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
          conferenceData: {
            createRequest: {
              requestId: `orac-meet-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        })
      });

      if (res.ok) {
        const evData = await res.json();
        const meetLink = evData.hangoutLink;
        if (meetLink) {
          if (confirm(`🎥 Atendimento Virtual Criado Oficialmente via Google Calendar!\n\nParticipante: ${name}\n\nClique em OK para ingressar na chamada protegida com o profissional.`)) {
            window.open(meetLink, '_blank');
          }
        } else {
          window.open('https://meet.google.com/new', '_blank');
        }
      } else {
        window.open('https://meet.google.com/new', '_blank');
      }
    } catch (err) {
      window.open('https://meet.google.com/new', '_blank');
    } finally {
      setIsMeetCreating(null);
    }
  };

  // Sort comments according to preference
  const sortedComments = useMemo(() => {
    let list = [...commentsList];
    if (commentsSortOrder === 'newest') {
      list.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
    } else if (commentsSortOrder === 'oldest') {
      list.sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
    } else if (commentsSortOrder === 'popular') {
      // Sort priority based on character length as proxy for elaborate debate / content depth
      list.sort((a, b) => (b.content || '').length - (a.content || '').length);
    }
    return list;
  }, [commentsList, commentsSortOrder]);

  // Clean html string for display rendering safely
  const cleanPostTextOutput = (text: string) => {
    if (!text) return '';
    // Replaces bold html tags
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/g, '<strong>$1</strong>')
      .replace(/&lt;i&gt;([\s\S]*?)&lt;\/i&gt;/g, '<em>$1</em>')
      .replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, '<span class="underline">$1</span>')
      .replace(/&lt;s&gt;([\s\S]*?)&lt;\/s&gt;/g, '<span class="line-through">$1</span>')
      .replace(/&lt;code&gt;([\s\S]*?)&lt;\/code&gt;/g, '<code class="bg-[#1e1a3b] px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">$1</code>')
      .replace(/&lt;blockquote&gt;([\s\S]*?)&lt;\/blockquote&gt;/g, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-505/10 my-2 text-slate-300">$1</blockquote>')
      .split('\n').join('<br />');
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto py-6 px-4 md:px-8 relative min-h-screen text-slate-100 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden blur-[140px] opacity-25 z-0">
        <div className="absolute top-[0%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-indigo-900/40 mix-blend-screen animate-pulse" />
        <div className="absolute top-[40%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-purple-900/30 mix-blend-screen" />
        <div className="absolute bottom-[5%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-amber-900/20 mix-blend-screen" />
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ==================================== LEFT SIDEBAR (Span 3) ==================================== */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Quick Profile Overview */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-white/5 bg-gradient-to-br from-slate-950/80 via-[#0e0a24]/90 to-slate-950/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Crown className="w-12 h-12 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                  alt="" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/25"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif text-slate-100 text-lg font-bold leading-tight truncate">{currentUser?.name || "Buscador Celestial"}</h4>
                <p className="text-xs text-indigo-400 font-mono tracking-wider">Membro Conectado</p>
              </div>
            </div>
          </div>

          {/* Covens & Communities Section */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-white/5 bg-slate-950/40 shadow-xl">
            <div className="flex items-center justify-between mb-5 px-1">
              <h3 className="text-xs font-bold font-mono tracking-widest text-[#9d8ff7] uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Egrégoras & Covens
              </h3>
              <button 
                onClick={() => setShowCovenCreationModal(true)}
                className="p-1.5 rounded-full hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                title="Criar Nova Comunidade"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => { setActiveCovenFilter(null); setActiveTab('feed'); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all mb-3 flex items-center gap-3 border ${!activeCovenFilter ? 'bg-indigo-500/25 text-indigo-200 border-indigo-500/40 shadow' : 'bg-transparent text-slate-400 hover:bg-white/5 border-transparent'}`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Todos os Encontros</span>
            </button>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {covens.map((coven: any) => (
                <div 
                  key={coven.id}
                  className={`group/coven flex items-center justify-between p-2 rounded-2xl border transition-all ${activeCovenFilter === coven.name ? 'bg-white/5 border-indigo-500/30' : 'border-transparent hover:bg-white/5'}`}
                >
                  <button 
                    onClick={() => { setActiveCovenFilter(coven.name); setActiveTab('feed'); }}
                    className="flex items-center gap-3 text-left min-w-0 flex-1"
                  >
                    <img src={coven.image} alt="" className="w-9 h-9 rounded-xl object-cover border border-white/10 group-hover/coven:scale-105 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 truncate">{coven.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{coven.members} membros</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setCovens(covens.map((c: any) => c.id === coven.id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c));
                    }}
                    className={`px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider transition-colors ${coven.joined ? 'text-indigo-300' : 'text-[#f59e0b]'}`}
                  >
                    {coven.joined ? 'Membro' : 'Participar'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Cycle Widget - Chat with Online Friends */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-white/5 bg-slate-950/40 shadow-xl">
            <h3 className="text-xs font-bold font-mono tracking-widest text-[#9d8ff7] uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Ciclo Social Astral
            </h3>
            <div className="space-y-3">
              {socialCycle.friends.length === 0 ? (
                <div className="p-4 text-center bg-black/10 border border-white/5 rounded-2xl">
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Seu ciclo social astral está vazio. Encontre membros no Feed ou Covens para se conectar!
                  </p>
                </div>
              ) : (
                socialCycle.friends.map((friendName) => {
                  const extra = EXTRA_PROFILES_DATA[friendName] || { grau: 'Iniciado', level: 1 };
                  const avatar = friendName === 'Elias Thorne' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=150' : friendName === 'Serena Moon' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150';
                  
                  return (
                    <div key={friendName} className="flex items-center justify-between p-2.5 bg-black/20 border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all">
                      <button 
                        onClick={() => handleOpenUserProfile(friendName, avatar)}
                        className="flex items-center gap-3 text-left min-w-0"
                      >
                        <div className="relative">
                          <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-indigo-500/20" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
                            {friendName}
                            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          </p>
                          <p className="text-[10px] text-slate-400 truncate font-mono">Nível {extra.level} • {extra.grau}</p>
                        </div>
                      </button>

                      <div className="flex gap-1">
                        <button 
                          onClick={() => openChatWith(friendName)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-all"
                          title="Iniciar Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleStartGoogleMeet(friendName)}
                          disabled={isMeetCreating === friendName}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 hover:text-emerald-200 transition-all disabled:opacity-50"
                          title="Videoconferência"
                        >
                          {isMeetCreating === friendName ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ==================================== MIDDLE SECTION (Span 6) ==================================== */}
        <div className="xl:col-span-6 space-y-6">

          {/* Post Composer Card */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-[#2e266a]/80 bg-gradient-to-b from-[#130d31] via-[#080518] to-[#0a071d] shadow-[0_0_40px_rgba(157,143,247,0.06)] relative overflow-hidden">
            
            {/* Header indicators */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-400 font-black flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Transmitir Mensagem do Templo
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Seu coven solar aguarda sua voz</span>
            </div>

            <div className="flex gap-4 items-start">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                alt="" 
                className="w-11 h-11 rounded-full object-cover border-2 border-[#9d8ff7]/25 shadow-lg shadow-indigo-900/40 animate-pulse"
              />
              <div className="flex-1">
                <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl focus-within:border-indigo-500/50 transition-colors shadow-inner">
                  <TextareaAutosize
                    ref={composerTextareaRef}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Invoque sua reflexão, leitura ou segredo místico no coven... Use os botões abaixo para formatar ou anexar mídias."
                    className="w-full bg-transparent border-0 outline-none resize-none text-slate-200 text-xs sm:text-sm font-light min-h-[80px] placeholder-slate-600 leading-relaxed"
                  />
                </div>

                {/* Attachments preview row */}
                {(postAttachmentImage.trim() || postAttachmentVideo.trim() || postTags.length > 0) && (
                  <div className="mt-3 p-4 bg-black/30 border border-white/5 rounded-2xl space-y-2">
                    {postAttachmentImage.trim() && (
                      <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                        <span className="text-zinc-400 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Imagem: {postAttachmentImage.substring(0, 40)}...</span>
                        <button onClick={() => setPostAttachmentImage('')} className="p-1 hover:bg-white/10 text-rose-400 rounded-full"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                    {postAttachmentVideo.trim() && (
                      <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                        <span className="text-zinc-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-rose-400" /> Vídeo / Podcast: {postAttachmentVideo.substring(0, 40)}...</span>
                        <button onClick={() => setPostAttachmentVideo('')} className="p-1 hover:bg-white/10 text-rose-400 rounded-full"><X className="w-3 h-3" /></button>
                      </div>
                    )}
                    {postTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {postTags.map((tag, idx) => (
                          <span key={idx} className="bg-indigo-500/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/25 flex items-center gap-1">
                            #{tag}
                            <button onClick={() => setPostTags(prev => prev.filter(t => t !== tag))} className="hover:text-rose-400"><X className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Composer Editing Toolbar & Button row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-1 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    
                    {/* Rich text formatting shortcuts */}
                    <button 
                      onClick={() => insertFormatting('<b>', '</b>')}
                      className="p-1.5 rounded bg-[#1c1836] hover:bg-[#252046] text-xs font-black w-7 h-7 flex items-center justify-center text-slate-300"
                      title="Negrito"
                    >
                      B
                    </button>
                    <button 
                      onClick={() => insertFormatting('<i>', '</i>')}
                      className="p-1.5 rounded bg-[#1c1836] hover:bg-[#252046] text-xs italic w-7 h-7 flex items-center justify-center text-slate-300"
                      title="Itálico"
                    >
                      I
                    </button>
                    <button 
                      onClick={() => insertFormatting('<u>', '</u>')}
                      className="p-1.5 rounded bg-[#1c1836] hover:bg-[#252046] text-xs underline w-7 h-7 flex items-center justify-center text-slate-300"
                      title="Sublinhado"
                    >
                      U
                    </button>
                    <button 
                      onClick={() => insertFormatting('<s>', '</s>')}
                      className="p-1.5 rounded bg-[#1c1836] hover:bg-[#252046] text-xs line-through w-7 h-7 flex items-center justify-center text-slate-300"
                      title="Tachado"
                    >
                      S
                    </button>
                    <button 
                      onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                      className="p-1.5 rounded bg-[#1c1836] hover:bg-[#252046] w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                      title="Citação de Livro"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="w-px h-5 bg-white/10 mx-1" />

                    {/* Image & Video and Coven selector togglers */}
                    <button 
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1 border border-indigo-500/20 active:scale-95 transition-all"
                      title="Anexar Fotos / Vídeos"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">Mídias</span>
                    </button>

                    {/* Tag direct insertion selector */}
                    <div className="flex items-center gap-1 rounded-lg bg-black/20 border border-white/5 px-2 py-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Coven:</span>
                      <select 
                        value={selectedCovenForPost}
                        onChange={(e) => setSelectedCovenForPost(e.target.value)}
                        className="bg-transparent text-slate-300 text-xs outline-none border-0 cursor-pointer text-ellipsis max-w-[80px]"
                      >
                        <option value="Eter" className="bg-[#0b081a]">Éter (Geral)</option>
                        {covens.map((c: any) => (
                          <option key={c.id} value={c.name} className="bg-[#0b081a]">{c.name}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePostSubmit}
                      disabled={isSubmittingPost || !newPostText.trim()}
                      className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                    >
                      {isSubmittingPost ? <RefreshCw className="w-3 h-3 animate-spin text-white" /> : <Send className="w-3 h-3 text-indigo-200" />}
                      Postar
                    </button>
                  </div>
                </div>

                {/* Sub attachment link popover */}
                {showAttachmentMenu && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-5 bg-[#14102c]/95 backdrop-blur border border-white/10 rounded-2xl space-y-4">
                    <h5 className="text-[11px] font-black tracking-widest text-[#9d8ff7] uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">📂 Painel de Anexos do Cosmos</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* COMPUTER UPLOAD */}
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Do Seu Dispositivo</label>
                          <p className="text-[9px] text-slate-500 mb-3 leading-relaxed">Puxe e anexe imagens ou vídeos direto do seu computador de forma instantânea.</p>
                        </div>
                        <input 
                          type="file" 
                          id="local-media-upload"
                          accept="image/*,video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                if (file.type.startsWith('image/')) {
                                  setPostAttachmentImage(result);
                                } else {
                                  setPostAttachmentVideo(result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <label 
                          htmlFor="local-media-upload"
                          className="w-full flex items-center justify-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-indigo-200 border border-indigo-500/35 rounded-xl px-2.5 py-2 text-xs cursor-pointer select-none transition-all active:scale-95 font-bold text-center uppercase tracking-wider"
                        >
                          <Upload className="w-3.5 h-3.5" /> Enviar Arquivo
                        </label>
                      </div>

                      {/* WEB URL */}
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1 shadow-sm font-bold">Link da Imagem (URL)</label>
                          <p className="text-[9px] text-slate-500 mb-3 leading-relaxed">Se preferir usar uma imagem web, forneça a URL no campo abaixo.</p>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://images.unsplash.com/... ou URL"
                          value={postAttachmentImage}
                          onChange={(e) => setPostAttachmentImage(e.target.value)}
                          className="w-full bg-[#120f26]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-505"
                        />
                      </div>

                      {/* EXTERN AUDIO/VIDEO */}
                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1 font-bold">Link Externo / Vídeo</label>
                          <p className="text-[9px] text-slate-500 mb-3 leading-relaxed">Cole links de vídeos do YouTube, Vimeo ou caneta de mídia do Spotify.</p>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Ex: YouTube, Vimeo ou link de áudio"
                          value={postAttachmentVideo}
                          onChange={(e) => setPostAttachmentVideo(e.target.value)}
                          className="w-full bg-[#120f26]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-505"
                        />
                      </div>
                    </div>

                    {/* MYSTICAL TEMPLATES GALLERY */}
                    <div className="bg-black/20 p-4.5 rounded-xl border border-white/5">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Galeria Astral de Modelos de Mídias
                      </label>
                      <p className="text-[9px] text-slate-500 mb-3">Selecione uma imagem mística refinada com apenas um clique para ilustrar seu post de imediato:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { name: 'Tiragem de Tarot', url: 'https://images.unsplash.com/photo-1633519895058-20d04fd2e78d?q=80&w=600' },
                          { name: 'Ervas & Altar', url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600' },
                          { name: 'Alinhamento Lunar', url: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=600' },
                          { name: 'Cristal Vibracional', url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=600' }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPostAttachmentImage(item.url)}
                            className={`relative aspect-video rounded-lg overflow-hidden border transition-all hover:scale-103 text-left group/gal ${postAttachmentImage === item.url ? 'border-amber-400 shadow-md shadow-amber-500/10' : 'border-white/10'}`}
                          >
                            <img src={item.url} alt="" className="w-full h-full object-cover brightness-50 group-hover/gal:brightness-75 transition-all" />
                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                              <span className="text-[8px] font-bold text-slate-200 uppercase truncate leading-none">{item.name}</span>
                              {postAttachmentImage === item.url && <Check className="w-2.5 h-2.5 text-amber-400" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fast Tag creation pill */}
                    <div className="bg-black/20 p-4.5 rounded-xl border border-white/5 space-y-2">
                      <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Marcar Visão com Tags</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Escreva ex: Astrologia, Bruxaria, Hecate"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="bg-[#120f26]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 flex-1"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (tagInput.trim()) {
                              const cleanTag = tagInput.replace('#', '').trim();
                              if (!postTags.includes(cleanTag)) {
                                setPostTags([...postTags, cleanTag]);
                              }
                              setTagInput('');
                            }
                          }}
                          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-305 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-indigo-500/20"
                        >
                          Anexar Tag
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </div>

          {/* Real-time search filter and Quick information banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/20 border border-white/5 rounded-2xl p-4">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Pesquisar nos registros do templo akáshico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
            {activeCovenFilter && (
              <span className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                Grupo: {activeCovenFilter}
                <button onClick={() => setActiveCovenFilter(null)} className="hover:text-rose-400"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>

          {/* Posts Feed container */}
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <RefreshCw className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
              <p className="text-sm font-serif text-slate-400 uppercase tracking-widest">Invocando ressonâncias dos posts do além...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="glass-panel p-12 rounded-[2rem] border border-white/5 bg-slate-950/20 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-indigo-400/40 mx-auto animate-pulse" />
              <h4 className="font-serif text-slate-300 text-lg">Silêncio no Astral</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">Nenhuma vibração ou postagem encontrada nesta frequência de busca. Escreva sua primeira visão para iniciar a egrégora!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post: any) => {
                const isMyPost = currentUser && post.userId === currentUser.id;
                const matchesImages = post.images && Array.isArray(post.images) ? post.images : (typeof post.images === 'string' ? JSON.parse(post.images) : []);
                
                // Extract photo files and mock video embeds nicely
                const photoAttachments = matchesImages.filter((img: string) => !img.startsWith('[video]'));
                const videoAttachments = matchesImages.filter((img: string) => img.startsWith('[video]')).map((v: string) => v.replace('[video]', ''));

                return (
                  <motion.div
                    key={post.id}
                    layoutId={`post-card-${post.id}`}
                    className="community-post-container glass-panel rounded-[2rem] border border-white/5 bg-[#0a071d]/30 overflow-hidden shadow-xl hover:border-indigo-500/15 transition-all relative"
                  >
                    <div className="p-6 md:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <button 
                          onClick={() => handleOpenUserProfile(post.authorName, post.avatar)}
                          className="flex items-center gap-3 text-left group/author"
                        >
                          <img 
                            src={post.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover border border-indigo-500/20 group-hover/author:border-indigo-500/50 transition-colors"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-100 group-hover/author:text-indigo-300 transition-colors flex items-center gap-1.5">
                              {post.authorName}
                              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                            </p>
                            <p className="text-[10px] text-indigo-400/80 font-mono tracking-wider">
                              {post.coven ? `Coven: ${post.coven}` : 'Éter'} • {post.time || 'Ontem'}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-1">
                          {isMyPost && (
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Dissipar postagem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content Area - Clickable to open full detail modal */}
                      <div 
                        onClick={() => handleOpenPostDetails(post)}
                        className="cursor-pointer space-y-4"
                      >
                        <div 
                          className="text-xs text-slate-300 font-light leading-relaxed select-text prose prose-invert"
                          dangerouslySetInnerHTML={{ __html: cleanPostTextOutput(post.content || '') }}
                        />

                        {/* Photo gallery attachment rendering */}
                        {photoAttachments.length > 0 && (
                          <div className={`grid gap-2 mt-3 ${photoAttachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {photoAttachments.map((imgUrl: string, idx: number) => (
                              <img 
                                key={idx} 
                                src={imgUrl} 
                                alt="" 
                                className="w-full max-h-[350px] object-cover rounded-2xl border border-white/5 cursor-zoom-in hover:brightness-110 active:brightness-95 transition-all" 
                              />
                            ))}
                          </div>
                        )}

                        {/* Video embeds mockup */}
                        {videoAttachments.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {videoAttachments.map((vidUrl: string, idx: number) => (
                              <div key={idx} className="relative group/player rounded-2xl overflow-hidden border border-white/5 bg-black/60 shadow-inner">
                                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                                  <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover/player:scale-110 group-hover/player:bg-indigo-500 transition-all">
                                    <Play className="w-5 h-5 fill-current ml-1 text-white" />
                                  </div>
                                </div>
                                <div className="aspect-video w-full flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                                  <span className="text-[10px] font-mono text-zinc-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">Visualizar Mídia: {vidUrl}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tags list footer */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {post.tags.map((tag: string, tidx: number) => (
                              <span key={tidx} className="text-[10px] text-zinc-450 bg-[#15112f] hover:bg-indigo-550/15 border border-indigo-500/10 px-2 py-0.5 rounded-full transition-colors font-semibold text-indigo-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interaction footer bar */}
                      <div className="flex items-center justify-between border-t border-white/5 mt-6 pt-4 text-xs font-mono">
                        
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all active:scale-95"
                        >
                          <Heart className="w-4 h-4 text-rose-500/80 fill-rose-500/10" />
                          <span>{post.likes || 0}</span>
                        </button>

                        <button 
                          onClick={() => handleOpenPostDetails(post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 text-indigo-400" />
                          <span>{post.comments || 0} Comentários</span>
                        </button>

                        <button 
                          onClick={() => setSharingPost(post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all"
                        >
                          <Share2 className="w-4 h-4 text-emerald-400" />
                          <span className="hidden sm:inline">Compartilhar</span>
                        </button>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

        {/* ==================================== RIGHT SIDEBAR (Span 3) ==================================== */}
        <div className="xl:col-span-3 space-y-6">

          {/* Interactive Moon Phase Portal - Portal Lunar */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-amber-500/10 bg-gradient-to-b from-[#120e2b]/95 via-[#0c091f]/95 to-slate-950/90 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-bold font-mono tracking-widest text-amber-300 uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <MoonStar className="w-4 h-4 text-amber-400 animate-pulse" /> Portal da Lua
            </h3>

            {/* Today moon */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl relative">
                <div className="w-14 h-14 bg-slate-900 rounded-full border border-amber-500/20 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  {/* Visual rendering moon vector */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full scale-90 translate-x-3 brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                  <div className="absolute inset-0 bg-slate-900 scale-95 border border-amber-500/10 rounded-full translate-x-1.5" />
                  <Moon className="w-7 h-7 text-amber-300 z-10 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-serif text-amber-300 text-sm font-bold">Lua Crescente</h4>
                  <p className="text-[10px] text-indigo-300 font-mono">Signo de Escorpião • 74%</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Propício para rituais de expansão íntima e tarologia avançada.</p>
                </div>
              </div>

              {/* Transit predictions */}
              <div className="space-y-2 mt-4 text-[11px] font-light text-slate-400 leading-relaxed">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex gap-2">
                  <span className="text-amber-400 font-bold font-mono">25/Mai:</span>
                  <div>
                    <strong className="text-slate-300 text-xs block mb-0.5">Gibosa Crescente</strong>
                    <p className="text-[10px]">Trígonos mentais com Urano aceleram a captação de visões ocultas.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex gap-2">
                  <span className="text-amber-400 font-bold font-mono">29/Mai:</span>
                  <div>
                    <strong className="text-slate-300 text-xs block mb-0.5">🌕 Lua Cheia em Sagitário</strong>
                    <p className="text-[10px]">Ápice da energia espiritual. Ideal para limpezas áuricas de ambientes e consagrações.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spiritual Field News Section - Notícias do Éter */}
          <div className="glass-panel p-6 rounded-[2.2rem] border border-white/5 bg-slate-950/40 shadow-xl">
            <h3 className="text-xs font-bold font-mono tracking-widest text-[#9d8ff7] uppercase mb-4 border-b border-white/5 pb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Notícias do Éter Oracular
              </span>
              <button
                onClick={handleGenerateNews}
                disabled={isGeneratingNews}
                className="text-[9px] bg-indigo-500/10 hover:bg-indigo-500/20 text-[#a094fa] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-all flex items-center gap-1 disabled:opacity-50"
                title="Sintonizar nova notícia aleatória com de Inteligência Artificial"
              >
                {isGeneratingNews ? (
                  <>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-indigo-300" /> Gerar com I.A.
                  </>
                )}
              </button>
            </h3>
            <div className="space-y-4">
              {isLoadingNews ? (
                <div className="py-6 text-center space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
                  <p className="text-[10px] text-zinc-500 font-mono">Pesquisando egrégora astral...</p>
                </div>
              ) : mysticalNews.length === 0 ? (
                <div className="text-center py-4 text-xs text-zinc-500 italic">
                  Nenhuma notícia disponível no éter. Toque em "Gerar com I.A." acima para sintonizar notícias reais!
                </div>
              ) : (
                mysticalNews.map((news) => (
                  <button
                    key={news.id}
                    onClick={() => setSelectedNews(news)}
                    className="w-full text-left bg-black/20 hover:bg-white/[0.03] p-3 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all flex gap-3 group"
                  >
                    <img src={news.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold leading-snug text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-2">{news.title}</h4>
                      <span className="text-[10px] text-indigo-400 font-mono mt-1 block">{news.date} • {news.readTime || '3 min'} leitura</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>



        </div>

      </div>

      {/* ==================================== MODAL: USER INTERACTIVE PROFILE ==================================== */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#09071c] border border-[#2e266a]/60 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 space-y-6">
                
                {/* Profile header block */}
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border-b border-white/5 pb-6">
                  <div className="relative">
                    <img src={selectedProfile.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-[#9d8ff7]/30 shadow-xl" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#09071c] animate-pulse" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                      <h3 className="text-2xl font-serif text-slate-100 font-black">{selectedProfile.name}</h3>
                      <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{selectedProfile.grau}</span>
                    </div>
                    <p className="text-xs text-indigo-400 font-mono">Nível {selectedProfile.level || 1} • Localização: {selectedProfile.location || 'Oracle Temple'}</p>
                    <p className="text-xs text-slate-350 leading-relaxed max-w-md italic">"{selectedProfile.bio}"</p>
                  </div>
                </div>

                {/* Social cycle dynamic controls inside profile */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-1.5 px-4 bg-black/40 border border-white/5 rounded-2xl text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFriend(selectedProfile.name)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-[11px] ${selectedProfile.isFriend ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' : 'bg-[#e0f2fe]/5 text-slate-300 hover:bg-white/5'}`}
                    >
                      {selectedProfile.isFriend ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      {selectedProfile.isFriend ? 'Ciclo Conectado' : 'Conectar ao Ciclo'}
                    </button>
                    <button
                      onClick={() => handleToggleFollow(selectedProfile.name)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] ${selectedProfile.isFollowing ? 'bg-slate-800 text-slate-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                    >
                      {selectedProfile.isFollowing ? 'Seguindo' : 'Seguir Buscador'}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => openChatWith(selectedProfile.name)}
                      className="px-3 py-1.5 bg-black/30 hover:bg-black/50 rounded-lg text-slate-300 flex items-center gap-1 border border-white/5 text-[11px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Chat Direto
                    </button>
                    <button 
                      onClick={() => handleStartGoogleMeet(selectedProfile.name)}
                      className="px-3 py-1.5 bg-black/30 hover:bg-black/50 rounded-lg text-slate-300 flex items-center gap-1 border border-white/5 text-[11px]"
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" /> Google Meet
                    </button>
                  </div>
                </div>

                {/* Listed services and products dynamic purchases - Marketplace integration */}
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-widest text-[#9d8ff7] uppercase mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" /> Serviços & Produtos do Especialista
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-1">
                    {SELLER_PRODUCTS[selectedProfile.name]?.map((prod) => (
                      <div key={prod.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between hover:border-indigo-500/20 transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/20">{prod.type}</span>
                            <span className="text-emerald-400 font-bold font-mono text-sm">R$ {prod.price.toFixed(2)}</span>
                          </div>
                          <h5 className="font-serif font-black text-slate-200 text-xs mb-1 truncate">{prod.title}</h5>
                          <p className="text-[10px] text-zinc-500 leading-relaxed font-light line-clamp-2">{prod.desc}</p>
                        </div>
                        <button
                          onClick={() => startPurchaseFlow(prod, selectedProfile.name)}
                          className="w-full mt-4 py-2 bg-gradient-to-r from-[#2e266a]/80 to-indigo-600/80 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all border border-indigo-400/20 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3 h-3 text-amber-400" /> Contratar / Adquirir
                        </button>
                      </div>
                    )) || (
                      <div className="col-span-2 text-center p-6 bg-black/10 border border-dashed border-white/5 rounded-2xl text-xs text-slate-500">
                        Nenhum produto sagrado ou leitura cadastrada neste grimório pessoal.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL: DYNAMIC COVENS CREATION ==================================== */}
      <AnimatePresence>
        {showCovenCreationModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a071d] border border-white/10 rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setShowCovenCreationModal(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 text-slate-400 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-serif text-[#9d8ff7] font-black uppercase tracking-widest mb-4">Estabelecer Novo Coven</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Nome da Comunidade</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Círculo Hermético de Thoth"
                    value={covenCreationName}
                    onChange={(e) => setCovenCreationName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Pacto e Intenção (Foco)</label>
                  <textarea 
                    placeholder="Estudos dedicados a alquimia e rituais herméticos diários..."
                    value={covenCreationDesc}
                    onChange={(e) => setCovenCreationDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5">Selo do Templo (Imagem URL)</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={covenCreationImg}
                    onChange={(e) => setCovenCreationImg(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <button 
                  onClick={handleCreateCoven}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shrink-0"
                >
                  Estabelecer Aliança
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL: POST RICH DETAILS WITH COMMENTS ==================================== */}
      <AnimatePresence>
        {selectedDetailPost && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-[#0a071c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <span className="font-serif text-[#9d8ff7] text-sm uppercase tracking-widest font-black flex items-center gap-1.5">🔮 Postagem e Debates do Coven</span>
                <button 
                  onClick={() => setSelectedDetailPost(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left">
                
                {/* Embedded original post */}
                <div className="p-5 rounded-2xl bg-black/40 border border-[#2e266a]/40">
                  <div 
                    onClick={() => handleOpenUserProfile(selectedDetailPost.authorName, selectedDetailPost.avatar)}
                    className="flex items-start gap-3 mb-3 cursor-pointer hover:opacity-85 transition-opacity"
                    title={`Ver Perfil de ${selectedDetailPost.authorName}`}
                  >
                    <img src={selectedDetailPost.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-indigo-505/20" />
                    <div>
                      <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                        {selectedDetailPost.authorName}
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">Enviado em {selectedDetailPost.coven || 'Éter'} • {selectedDetailPost.time || 'Ontem'}</p>
                    </div>
                  </div>
                  <div 
                    className="text-xs text-slate-350 leading-relaxed font-light prose prose-invert select-text"
                    dangerouslySetInnerHTML={{ __html: cleanPostTextOutput(selectedDetailPost.content || '') }}
                  />
                  {selectedDetailPost.tags && selectedDetailPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedDetailPost.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] bg-indigo-500/10 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  {/* Gallery elements if any */}
                  {selectedDetailPost.images && selectedDetailPost.images.length > 0 && (
                    <div className="grid gap-2 mt-4">
                      {selectedDetailPost.images.filter((img: string) => !img.startsWith('[video]')).map((url: string, i: number) => (
                        <img key={i} src={url} alt="" className="w-full max-h-[250px] object-cover rounded-xl" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment thread and organizer section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h4 className="text-xs font-bold font-mono tracking-widest text-[#9d8ff7] uppercase">Respostas do Templo ({commentsList.length})</h4>
                    
                    {/* Sort Selector options */}
                    <div className="flex items-center gap-2 text-[10px] bg-black/40 border border-white/5 px-3 py-1 rounded-xl">
                      <span className="text-slate-500 uppercase font-black tracking-wider">Classificar:</span>
                      <button 
                        onClick={() => setCommentsSortOrder('newest')}
                        className={`px-2 py-0.5 rounded transition-all font-bold ${commentsSortOrder === 'newest' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Recentes
                      </button>
                      <button 
                        onClick={() => setCommentsSortOrder('popular')}
                        className={`px-2 py-0.5 rounded transition-all font-bold ${commentsSortOrder === 'popular' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Popular
                      </button>
                      <button 
                        onClick={() => setCommentsSortOrder('oldest')}
                        className={`px-2 py-0.5 rounded transition-all font-bold ${commentsSortOrder === 'oldest' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        Antigos
                      </button>
                    </div>
                  </div>

                  {loadingComments ? (
                    <div className="py-8 text-center space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                      <p className="text-[10px] text-zinc-500 font-mono">Recuperando sintonias dos oráculos...</p>
                    </div>
                  ) : sortedComments.length === 0 ? (
                    <div className="p-6 bg-black/15 text-center text-xs text-zinc-500 rounded-2xl italic leading-relaxed">
                      Nenhuma interpretação escrita para esta visão ainda. Comece você o debate espiritual!
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-2">
                      {sortedComments.map((comment: any) => (
                        <div key={comment.id} className="p-3.5 bg-black/10 border border-white/5 rounded-2xl relative">
                          <div className="flex gap-2.5 items-start">
                            <img 
                              src={comment.avatar} 
                              alt="" 
                              onClick={() => handleOpenUserProfile(comment.authorName, comment.avatar)}
                              className="w-8 h-8 rounded-full object-cover border border-indigo-500/10 cursor-pointer hover:opacity-85 transition-opacity" 
                              title={`Ver perfil de ${comment.authorName}`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span 
                                  onClick={() => handleOpenUserProfile(comment.authorName, comment.avatar)}
                                  className="text-xs font-bold text-slate-200 hover:text-indigo-300 transition-colors cursor-pointer"
                                  title={`Ver perfil de ${comment.authorName}`}
                                >
                                  {comment.authorName}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-mono">{comment.date ? new Date(comment.date).toLocaleDateString('pt-BR') : 'Agora'}</span>
                              </div>
                              <p className="text-xs text-slate-300 font-light mt-1 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Input Footer */}
              <div className="p-6 border-t border-white/5 bg-[#080517] flex items-center gap-3">
                <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-indigo-500/20" />
                <input 
                  type="text" 
                  placeholder="Manifeste sua leitura oracular de ajuda..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCommentSubmit();
                  }}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleCommentSubmit}
                  disabled={isPostingComment || !newCommentText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                >
                  Responder
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== FLOATING MESSENGER-STYLE CHAT COMPONENT ==================================== */}
      <AnimatePresence>
        {activeChatUser && (
          <div className="fixed bottom-0 right-4 sm:right-10 z-50 w-80 bg-[#09071b] border-2 border-[#2e266a] rounded-t-2xl overflow-hidden shadow-2xl flex flex-col text-left">
            <div className="px-4 py-3 bg-[#130f2c] border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 animate-pulse absolute -top-0.5 -left-0.5" />
                  <span className="font-serif font-black text-xs text-slate-100 truncate block">{activeChatUser}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleStartGoogleMeet(activeChatUser)}
                  className="p-1 hover:bg-white/10 text-emerald-400 rounded transition-colors"
                  title="Chamada Meet"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveChatUser(null)}
                  className="p-1 hover:bg-white/10 text-slate-400 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Scrollable */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 bg-black/40 text-xs flex flex-col">
              {(chatMessages[activeChatUser] || []).map((msg, idx) => {
                const isMe = msg.sender === 'currentUser';
                return (
                  <div key={idx} className={`max-w-[80%] p-2.5 rounded-xl text-xxs leading-relaxed ${isMe ? 'bg-indigo-600 text-white self-end rounded-br-none' : 'bg-slate-900 text-slate-200 self-start rounded-bl-none'}`}>
                    <p className="font-light">{msg.text}</p>
                    <span className="text-[8px] text-zinc-500 mt-1 block text-right font-mono">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Footer Input */}
            <div className="p-2 border-t border-zinc-900 bg-[#060413] flex gap-2">
              <input 
                type="text" 
                placeholder="Diga algo celeste..."
                value={currentChatMessageText}
                onChange={(e) => setCurrentChatMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button 
                onClick={handleSendChatMessage}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL: INTUITIVE SPIRITUAL NEWS READ ==================================== */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#09071d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 border border-white/10 hover:bg-white/5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={selectedNews.image} alt="" className="w-full h-48 object-cover border-b border-indigo-500/20" />
              <div className="p-6 space-y-4 text-left">
                <span className="bg-indigo-500/15 text-indigo-300 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">{selectedNews.readTime} leitura</span>
                <h3 className="text-xl font-serif text-[#9d8ff7] font-bold leading-snug">{selectedNews.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-wrap">{selectedNews.content}</p>
                <div className="pt-4 border-t border-white/5 justify-between items-center flex text-[10px] text-indigo-400 font-mono">
                  <span>Fonte: Oracle Chronicles</span>
                  <span>Publicado: {selectedNews.date}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL: DYNAMIC SOCIAL SHARE BOX ==================================== */}
      <AnimatePresence>
        {sharingPost && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a071c] border border-[#2e266a] rounded-2xl p-6 relative text-center space-y-6"
            >
              <button 
                onClick={() => setSharingPost(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 text-slate-400 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-serif text-[#9d8ff7] font-black uppercase tracking-widest">Compartilhar Frequência Vibracional</h3>
              <p className="text-xs text-slate-400">Espalhe esta sabedoria oracular para atrair novos membros em sua rede sutil!</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { alert("✓ Link postado em Pinterest espiritual!"); setSharingPost(null); }}
                  className="p-3 bg-black/20 hover:bg-[#1f1a42] rounded-xl text-left border border-white/5 font-mono text-xs text-slate-200 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-pink-500" />
                  Pinterest
                </button>
                <button 
                  onClick={() => { alert("✓ Link compartilhado no WhatsApp!"); setSharingPost(null); }}
                  className="p-3 bg-black/20 hover:bg-[#1f1a42] rounded-xl text-left border border-white/5 font-mono text-xs text-slate-200 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  WhatsApp
                </button>
                <button 
                  onClick={() => { alert("✓ Visão tuitada com sucesso!"); setSharingPost(null); }}
                  className="p-3 bg-black/20 hover:bg-[#1f1a42] rounded-xl text-left border border-white/5 font-mono text-xs text-slate-200 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  Twitter / X
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://oracleacademy.org/post/${sharingPost.id}`);
                    alert("✓ Elo criptografado (Link do post) copiado para a área de transferência!");
                    setSharingPost(null);
                  }}
                  className="p-3 bg-black/20 hover:bg-[#1f1a42] rounded-xl text-left border border-white/5 font-mono text-xs text-slate-200 transition-colors flex items-center gap-2"
                >
                  <Link className="w-4 h-4 text-amber-500" />
                  Copiar Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL: REAL-TIME TRANSACTION FEE CHECKOUT ==================================== */}
      <AnimatePresence>
        {purchasingProduct && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#09071c] border-2 border-indigo-500/50 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => { setPurchasingProduct(null); setPurchaseSuccessReceipt(null); }}
                className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-white/5 rounded-full text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 space-y-6 text-left">
                <div className="text-center pb-2">
                  <h3 className="text-lg font-serif text-[#9d8ff7] font-black uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Oracle Pay Soluções
                  </h3>
                  <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono mt-1">Interligador de Compras Diretas</p>
                </div>

                {purchaseStep === 'confirm' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300">
                      <p className="text-slate-400 uppercase tracking-widest font-mono text-[9px] mb-1">Item selecionado</p>
                      <h4 className="font-serif font-black text-slate-100 text-sm mb-1">{purchasingProduct.title}</h4>
                      <p className="text-zinc-500 font-light italic leading-relaxed">"{purchasingProduct.desc}"</p>
                      <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-3 text-xs">
                        <span className="text-zinc-400 font-bold uppercase">Preço de tabela</span>
                        <strong className="text-emerald-400 font-mono text-sm">R$ {purchasingProduct.price.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xxs text-amber-300 flex items-start gap-2.5 leading-relaxed font-light">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        O Oracle Pay fará o recolhimento automático da taxa operacional regulamentar (15% a 20%) e depositará o saldo líquido na egrégora do especialista imediatamente.
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button 
                        onClick={() => setPurchasingProduct(null)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-350 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={executeBuyAndCommission}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-indigo-200" /> Confirmar Compra
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                      </div>
                      
                      <div className="text-center font-bold text-emerald-400 uppercase tracking-widest text-[10px] pb-1 mb-2 border-b border-indigo-500/15">
                        Transação Aprovada!
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Código do Contrato</span>
                        <span className="font-mono font-bold text-slate-320">{purchaseSuccessReceipt?.id}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Serviço / Produto</span>
                        <span className="font-bold text-slate-200 max-w-[150px] truncate">{purchaseSuccessReceipt?.productTitle}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Profissional Vendedor</span>
                        <span className="font-bold text-slate-200">{purchaseSuccessReceipt?.sellerName}</span>
                      </div>
                      
                      <hr className="border-indigo-500/15 my-2" />

                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Montante Pago</span>
                        <span className="font-bold font-mono text-slate-220">R$ {purchaseSuccessReceipt?.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Comissão Oracle (15%)</span>
                        <span className="font-mono text-rose-300 font-bold">-R$ {purchaseSuccessReceipt?.platformCommission.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 bg-white/5 p-1.5 rounded">
                        <span className="text-emerald-300 font-bold">Repassado ao Vendedor</span>
                        <span className="font-bold font-mono text-emerald-400">R$ {purchaseSuccessReceipt?.hostPayout.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xxs text-slate-450 leading-relaxed font-light text-center">
                      🔐 O conteúdo sagrado correspondente foi automaticamente incorporado à sua biblioteca permanente no sistema!
                    </div>

                    <button 
                      onClick={() => { setPurchasingProduct(null); setPurchaseSuccessReceipt(null); }}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      Concluir Transação
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ==================================== MODAL: CHECKOUT BRICK ==================================== */}
      <AnimatePresence>
        {checkoutPreferenceId && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#09071c] border-2 border-indigo-500/50 rounded-2xl overflow-hidden shadow-2xl relative mt-10 mb-10"
            >
              <button 
                onClick={() => setCheckoutPreferenceId(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-white/5 rounded-full text-zinc-400 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 space-y-6 text-left relative z-0">
                <div className="text-center pb-2">
                  <h3 className="text-lg font-serif text-[#9d8ff7] font-black uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Pagamento Seguro
                  </h3>
                </div>
                
                <CheckoutBrick 
                  preferenceId={checkoutPreferenceId} 
                  onSuccess={() => {
                    setCheckoutPreferenceId(null);
                    setPurchaseStep('statement');
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
