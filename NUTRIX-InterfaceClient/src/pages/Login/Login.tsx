import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import './Login.css';

export default function Login() {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(import.meta.env.VITE_NUTRIX_API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifiant, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert('Erreur : ' + (data.message || data.error || response.status));
        return;
      }

      localStorage.setItem('token', data.token);
      alert('Connexion réussie');
    } catch (err) {
      alert('Impossible de joindre le serveur');
      console.error(err);
    }
  }
  return (
    <div className="login">
      <div className="login__card">
        <div className="login__brand">
          <img
            src="/images/Logos/svg/nutrix-logo-transparent-pour-fond-sombre.svg"
            alt="NUTRIX Logo"
            className="login__logo-img"
          />
        </div>
        <p className="login__subtitle">Système autonome de planification alimentaire</p>

        <form className="login__form" onSubmit={handleLogin}>
          <div className="login__field">
            <label htmlFor="login-username">Identifiant</label>
            <input id="login-username" type="text" placeholder="Votre identifiant" autoComplete="username" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} />
          </div>
          <div className="login__field">
            <label htmlFor="login-password">Mot de passe</label>
            <input id="login-password" type="password" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login__btn" id="login-submit">
            Accéder au système
          </button>
          <Link to="/register" className="login__register_btn" id="login-register_btn">
            Créer un compte
          </Link>
        </form>

        <p className="login__version">NUTRIX v1.0 — Autonomie spatiale</p>
      </div>
    </div>
  );
}
