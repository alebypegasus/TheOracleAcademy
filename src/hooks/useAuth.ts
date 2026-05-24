import { useState, useEffect } from 'react';
import { googleSignIn, googleLogout, auth } from '../services/firebase';
import { api, setAuthSession, clearAuthSession } from '../services/api';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as updateFirebaseProfile } from 'firebase/auth';

export interface Profile {
  name: string;
  avatar: string;
  xp: number;
  grau?: string;
  nickname?: string;
  author_title?: string;
  location?: string;
  description?: string;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const userJson = localStorage.getItem('oracle_user');
    return userJson ? JSON.parse(userJson) : null;
  });
  
  const [profile, setProfile] = useState<Profile>({
    name: 'Buscador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    xp: 100
  });

  const [themePreference, setThemePreference] = useState('dark');
  const [colorTheme, setColorTheme] = useState('oracle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync user profile on mount or session change
  useEffect(() => {
    if (!currentUser) {
      setProfile({
        name: 'Buscador',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        xp: 100
      });
      return;
    }

    const fetchSync = async () => {
      setIsLoading(true);
      try {
        const data = await api.auth.syncUserData();
        if (data && !data.error) {
          if (data.profile) setProfile(data.profile);
          if (data.settings) {
            if (data.settings.themePreference) setThemePreference(data.settings.themePreference);
            if (data.settings.colorTheme) setColorTheme(data.settings.colorTheme);
          }
        }
      } catch (err: any) {
        console.warn('Sync offline or error:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSync();
  }, [currentUser]);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        const syncData = await api.auth.syncFirebase({
          email: result.user.email || '',
          name: result.user.displayName || 'Buscador',
          avatar: result.user.photoURL || '',
          firebaseUid: result.user.uid
        });

        if (syncData && syncData.token) {
          setAuthSession(syncData.token, syncData.user);
          setCurrentUser(syncData.user);
          return syncData.user;
        }
      }
      throw new Error('Falha ao autenticar com o servidor.');
    } catch (err: any) {
      setError(err.message || 'Erro no login com Google');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const syncData = await api.auth.syncFirebase({
        email: credential.user.email || '',
        name: credential.user.displayName || email.split('@')[0],
        avatar: credential.user.photoURL || '',
        firebaseUid: credential.user.uid
      });

      if (syncData && syncData.token) {
        setAuthSession(syncData.token, syncData.user);
        setCurrentUser(syncData.user);
        return syncData.user;
      }
      throw new Error('Falha ao sincronizar sessão.');
    } catch (err: any) {
      setError(err.message || 'Erro de email/senha');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(credential.user, { displayName: name });
      const syncData = await api.auth.syncFirebase({
        email,
        name,
        firebaseUid: credential.user.uid
      });

      if (syncData && syncData.token) {
        setAuthSession(syncData.token, syncData.user);
        setCurrentUser(syncData.user);
        return syncData.user;
      }
      throw new Error('Falha ao sincronizar registro.');
    } catch (err: any) {
      setError(err.message || 'Erro no registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await googleLogout();
      clearAuthSession();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (newProfile: Partial<Profile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    if (currentUser) {
      try {
        await api.auth.updateProfile(updated);
      } catch (err) {
        console.error('Failed to sync profile change:', err);
      }
    }
  };

  const updateThemePreference = async (pref: string) => {
    setThemePreference(pref);
    if (currentUser) {
      try {
        await api.auth.updateSettings({ themePreference: pref });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const updateColorTheme = async (theme: string) => {
    setColorTheme(theme);
    if (currentUser) {
      try {
        await api.auth.updateSettings({ colorTheme: theme });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return {
    currentUser,
    setCurrentUser,
    profile,
    setProfile: updateProfile,
    themePreference,
    setThemePreference: updateThemePreference,
    colorTheme,
    setColorTheme: updateColorTheme,
    isLoading,
    error,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout
  };
}
