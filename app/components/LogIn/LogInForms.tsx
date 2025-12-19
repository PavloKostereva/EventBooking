'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import '../../styles/login.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const router = useRouter();

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setRepeatPassword('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (isLogin) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage('Успішний вхід!');
        setMessageType('success');
        clearFields();
        setTimeout(() => router.push('/'), 500);
      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = (error as Error).message || 'Помилка входу';
        
        if (errorMessage.includes('Firebase') || errorMessage.includes('firebase')) {
          errorMessage = 'Помилка налаштування авторизації. Перевірте налаштування Supabase.';
        }
        
        setMessage(errorMessage);
        setMessageType('error');
      }
    } else {
      if (password !== repeatPassword) {
        setMessage('Паролі не співпадають.');
        setMessageType('error');
        return;
      }
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { error: userError } = await supabase.from('users').insert([
            {
              id: data.user.id,
              email: data.user.email,
              created_at: new Date().toISOString(),
            },
          ]);

          if (userError) {
            console.error('Error creating user profile:', userError);
          }
        }

        setMessage('Успішна реєстрація!');
        setMessageType('success');
        clearFields();
        setTimeout(() => router.push('/'), 500);
      } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = (error as Error).message || 'Помилка реєстрації';
        
        if (errorMessage.includes('Firebase') || errorMessage.includes('firebase')) {
          errorMessage = 'Помилка налаштування авторизації. Перевірте налаштування Supabase.';
        }
        
        setMessage(errorMessage);
        setMessageType('error');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    setMessageType('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        setMessage(`Помилка авторизації через Google: ${error.message}`);
        setMessageType('error');
        return;
      }
      
    } catch (error) {
      console.error('Unexpected error during Google login:', error);
      setMessage(`Помилка: ${(error as Error).message || 'Невідома помилка'}`);
      setMessageType('error');
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Повторіть пароль"
            required
            value={repeatPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
          />
        )}
        <button type="submit" className="auth-submit-btn">
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>

      <button onClick={handleGoogleLogin} className="google-btn">
        Увійти через Google
      </button>

      <p className="auth-switch">
        {isLogin ? 'Ще не маєте акаунта?' : 'Вже маєте акаунт?'}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setMessageType('');
          }}>
          {isLogin ? 'Зареєструватися' : 'Увійти'}
        </button>
      </p>

      {message && <p className={`auth-message ${messageType}`}>{message}</p>}
    </div>
  );
};

export default AuthForm;

