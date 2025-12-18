import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../../styles/login.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setRepeatPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Успішний вхід!");
        setMessageType('success');
        clearFields();
        setTimeout(() => navigate('/'), 500);
      } catch (error) {
        setMessage(error.message);
        setMessageType('error');
      }
    } else {
      if (password !== repeatPassword) {
        setMessage("Паролі не співпадають.");
        setMessageType('error');
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      
        setMessage("Успішна реєстрація!");
        setMessageType('success');
        clearFields();
        setTimeout(() => navigate('/'), 500);
      } catch (error) {
        setMessage(error.message);
        setMessageType('error');
      }      
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    setMessageType('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
  
      setMessage("Успішний вхід через Google!");
      setMessageType('success');
      clearFields();
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };  

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Вхід" : "Реєстрація"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Повторіть пароль"
            required
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        )}
        <button type="submit" className="auth-submit-btn">
          {isLogin ? "Увійти" : "Зареєструватися"}
        </button>
      </form>

      <button onClick={handleGoogleLogin} className="google-btn">
        Увійти через Google
      </button>

      <p className="auth-switch">
        {isLogin ? "Ще не маєте акаунта?" : "Вже маєте акаунт?"}
        <button onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
          setMessageType('');
        }}>
          {isLogin ? "Зареєструватися" : "Увійти"}
        </button>
      </p>

      {message && (
        <p className={`auth-message ${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthForm;
