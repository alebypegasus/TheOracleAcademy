export interface Product {
  id: string;
  userId: number;
  authorName: string;
  authorAvatar?: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  coverImage: string;
  hashtags: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  date: string;
  shippingInfo?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: 'Sparkles', color: 'from-indigo-500 to-purple-600' },
  { id: 'books', label: 'Livros & Grimórios', icon: 'BookOpen', color: 'from-blue-500 to-indigo-600' },
  { id: 'jewelry', label: 'Joias & Amuletos', icon: 'Gem', color: 'from-purple-500 to-pink-600' },
  { id: 'instruments', label: 'Oráculos & Ferramentas', icon: 'Sparkles', color: 'from-amber-500 to-orange-600' },
  { id: 'consultations', label: 'Consultas', icon: 'Star', color: 'from-emerald-500 to-teal-600' },
  { id: 'alchemy', label: 'Perfumes & Alquimia', icon: 'Zap', color: 'from-rose-500 to-pink-600' },
  { id: 'other', label: 'Relíquias', icon: 'Shield', color: 'from-slate-500 to-gray-600' },
];

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'price_asc', label: 'Menor preço' },
  { id: 'price_desc', label: 'Maior preço' },
  { id: 'rating', label: 'Melhor avaliados' },
];

export const PAYMENT_METHODS = [
  { id: 'pix', label: 'PIX', icon: 'QrCode', desc: 'Instantâneo, sem taxas' },
  { id: 'credit', label: 'Cartão de Crédito', icon: 'CreditCard', desc: 'Em até 12x sem juros' },
  { id: 'debit', label: 'Cartão de Débito', icon: 'CreditCard', desc: 'Débito direto na conta' },
];
