import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Register.css';

export default function Register() {

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {

    const response = await fetch(import.meta.env.VITE_NUTRIX_API + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        prenom,
        identifiant,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Compte créé avec succès');
    } else {
      alert('Erreur : ' + data.error);
    }
  }

  return (
    <div className="register">
      <div className="register__card">
        <div className="register__brand">
          <img
            src="/images/Logos/svg/nutrix-logo-transparent-pour-fond-sombre.svg"
            alt="NUTRIX Logo"
            className="register__logo-img"
          />
        </div>
        <p className="register__subtitle">Création de profil occupant / système</p>

        <form className="register__form" onSubmit={handleRegister}>
          <div className="register__field">
            <label htmlFor="register-nom">Nom</label>
            <input
              id="register-nom"
              type="text"
              placeholder="Votre nom"
              autoComplete="family-name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="register__field">
            <label htmlFor="register-prenom">Prénom</label>
            <input
              id="register-prenom"
              type="text"
              placeholder="Votre prénom"
              autoComplete="given-name"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="register__field">
            <label htmlFor="register-username">Identifiant</label>
            <input
              id="register-username"
              type="text"
              placeholder="Votre identifiant"
              autoComplete="username"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
            />
          </div>
          <div className="register__field">
            <label htmlFor="register-password">Mot de passe</label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="register__btn" id="register-submit">
            Créer mon compte
          </button>
          <Link to="/" className="register__back_btn" id="register-back_btn">
            Retour à la connexion
          </Link>
        </form>

        <p className="register__version">NUTRIX v1.0 — Autonomie spatiale</p>
      </div>
    </div>
  );
}
