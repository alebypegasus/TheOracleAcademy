-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'aluno', -- admin, aluno, vendedor
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table
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

-- 3. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_preference TEXT DEFAULT 'auto',
  color_theme TEXT DEFAULT 'oracle'
);

-- 4. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_quiz BOOLEAN DEFAULT FALSE,
  flashcard_count INT DEFAULT 0,
  flashcard_completed BOOLEAN DEFAULT FALSE,
  completed_journal BOOLEAN DEFAULT FALSE,
  lenormand_completed BOOLEAN DEFAULT FALSE,
  lenormand_early BOOLEAN DEFAULT FALSE
);

-- 5. Grimoire Entries Table
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

-- 6. Community News Table
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

-- 7. Community Posts Table
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

-- 8. Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Birth Charts Table
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

-- 11. Study Plans Table
CREATE TABLE IF NOT EXISTS study_plans (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plan JSONB NOT NULL
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL
);

-- 14. User Course Progress Table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INT NOT NULL,
  completed_lessons JSONB DEFAULT '[]',
  score INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 15. Marketplace Items Table
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

-- 16. Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, user_id)
);

-- 17. Sellers Table
CREATE TABLE IF NOT EXISTS sellers (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(10,2) DEFAULT 0.00,
  commission_rate NUMERIC(5,2) DEFAULT 15.00
);

-- 18. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'compra', 'saque', 'venda'
  amount NUMERIC(10,2) NOT NULL,
  commission_platform NUMERIC(10,2) DEFAULT 0.00,
  amount_seller NUMERIC(10,2) DEFAULT 0.00,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente', -- 'pendente', 'concluído'
  pix_key TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Purchases Table
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
