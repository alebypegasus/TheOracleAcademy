import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../database/pool";
import { JWT_SECRET } from "../middlewares/auth.middleware";

export class AuthService {
  // Hash password securely with bcrypt
  public static async hashPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pwd, salt);
  }

  // Compare passwords
  public static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  // Sign JWT token
  public static generateToken(user: { id: number; email: string; role: string; plan?: string }): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, plan: user.plan || 'free' },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  // Register a new user with secure password hash
  public static async register(userData: any): Promise<any> {
    const { email, password, name, role = "aluno" } = userData;

    const checkExist = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkExist.rows.length > 0) {
      throw new Error("E-mail já está em uso por outro buscador");
    }

    const hashedPassword = await this.hashPassword(password);
    const userRes = await query(
      "INSERT INTO users (email, password, role, plan, is_paid) VALUES ($1, $2, $3, 'free', false) RETURNING id, email, role, plan, plan_expires_at, is_paid",
      [email, hashedPassword, role]
    );
    const userId = userRes.rows[0].id;

    // Create defaults in profiles
    const defaultAvatar = userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';
    
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
        userData.nickname || '', userData.phone || '', userData.zipCode || '', userData.address || '', userData.description || '',
        userData.portfolio || '', userData.website || '', userData.whatsapp || '', userData.telegram || '', userData.facebook || '',
        userData.instagram || '', userData.x_twitter || '', userData.otherNet || '', !!userData.showPhone, !!userData.showAddress,
        userData.authorTitle || 'Busca-Caminhos', userData.grau || 'Grau I - Iniciado', userData.location || 'Santuário Sagrado'
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

    // If role is vendedor, create a seller profile
    if (role === "vendedor") {
      await query(
        "INSERT INTO sellers (user_id, balance, commission_rate) VALUES ($1, 0.00, 15.00) ON CONFLICT DO NOTHING",
        [userId]
      );
    }

    const token = this.generateToken({ id: userId, email: userRes.rows[0].email, role: userRes.rows[0].role, plan: userRes.rows[0].plan });

    const userObj = {
      id: userId,
      email: userRes.rows[0].email,
      role: userRes.rows[0].role,
      plan: userRes.rows[0].plan || 'free',
      planExpiresAt: userRes.rows[0].plan_expires_at || null,
      isPaid: userRes.rows[0].is_paid,
      name,
      avatar: defaultAvatar,
      xp: 100,
      nickname: userData.nickname || '',
      phone: userData.phone || '',
      zipCode: userData.zipCode || '',
      address: userData.address || '',
      description: userData.description || '',
      portfolio: userData.portfolio || '',
      website: userData.website || '',
      whatsapp: userData.whatsapp || '',
      telegram: userData.telegram || '',
      facebook: userData.facebook || '',
      instagram: userData.instagram || '',
      x_twitter: userData.x_twitter || '',
      otherNet: userData.otherNet || '',
      showPhone: !!userData.showPhone,
      showAddress: !!userData.showAddress,
      authorTitle: userData.authorTitle || 'Busca-Caminhos',
      grau: userData.grau || 'Grau I - Iniciado',
      location: userData.location || 'Santuário Sagrado'
    };

    return {
      token,
      ...userObj,
      user: userObj
    };
  }

  // Login a user
  public static async login(credentials: any): Promise<any> {
    const { email, password } = credentials;

    const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) {
      throw new Error("E-mail ou usuário não encontrado na constelação");
    }

    const user = userRes.rows[0];
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid && password !== user.password) {
      throw new Error("Chave mística (senha) incorreta");
    }

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
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role, plan: user.plan });

    const userObj = {
      id: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan || 'free',
      planExpiresAt: user.plan_expires_at || null,
      isPaid: user.is_paid,
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
    };

    return {
      token,
      ...userObj,
      user: userObj
    };
  }

  // Firebase Sync Authentication
  public static async firebaseSync(payload: any): Promise<any> {
    const { email, name, phone, password } = payload;
    let userId: any = null;
    let userObj: any = null;

    if (email) {
      const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);
      if (userRes.rows.length > 0) {
        userObj = userRes.rows[0];
        userId = userObj.id;
      }
    } else if (phone) {
      const profileRes = await query("SELECT user_id FROM profiles WHERE phone = $1", [phone]);
      if (profileRes.rows.length > 0) {
        userId = profileRes.rows[0].user_id;
        const userRes = await query("SELECT * FROM users WHERE id = $1", [userId]);
        if (userRes.rows.length > 0) {
          userObj = userRes.rows[0];
        }
      }
    }

    // Existing user sync
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
      const token = this.generateToken({ id: userObj.id, email: userObj.email, role: userObj.role });
      
      const returnedUser = {
        id: userObj.id,
        email: userObj.email,
        role: userObj.role,
        isPaid: userObj.is_paid,
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
      };

      return {
        token,
        ...returnedUser,
        user: returnedUser
      };
    }

    // Register on the fly
    const targetEmail = email || `phone_${phone.replace(/\D/g, '')}@oracle.academy`;
    const targetName = name || (phone ? `Buscador ${phone}` : 'Novo Buscador');
    const targetPassword = password || 'firebase_federated_pass_placeholder_3812';
    
    return this.register({
      email: targetEmail,
      password: targetPassword,
      name: targetName,
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      description: 'Buscador em sincronia com o éter cósmico.'
    });
  }
}
