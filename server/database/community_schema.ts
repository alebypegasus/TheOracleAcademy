import { PoolClient } from "pg";

export async function createCommunitySchema(client: PoolClient) {
  // 1. Egrégoras (Community Groups)
  await client.query(`
    CREATE TABLE IF NOT EXISTS community_groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      cover_image TEXT,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      members_count INTEGER DEFAULT 1,
      is_private BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Membros das Egrégoras (Group Members)
  await client.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES community_groups(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50) DEFAULT 'member', -- 'member', 'admin', 'owner'
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_id, user_id)
    );
  `);

  // 3. Modificação nos posts da comunidade para pertencer a grupos e usar formatação HTML
  await client.query(`
    ALTER TABLE community_posts 
    ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES community_groups(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS format VARCHAR(20) DEFAULT 'text',
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
  `);

  // 4. Amizades (Friendships)
  await client.query(`
    CREATE TABLE IF NOT EXISTS friendships (
      id SERIAL PRIMARY KEY,
      user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user1_id, user2_id)
    );
  `);

  // 5. Mensagens Diretas (Direct Messages) - Chat 1x1 multi-mídia
  await client.query(`
    CREATE TABLE IF NOT EXISTS direct_messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      format VARCHAR(20) DEFAULT 'text', -- 'text', 'html', 'image', 'video', 'audio', 'gif'
      media_url TEXT,
      read BOOLEAN DEFAULT false,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("[Database] Community advanced schema (Egregoras, Friends, DMs) initialized.");
}
