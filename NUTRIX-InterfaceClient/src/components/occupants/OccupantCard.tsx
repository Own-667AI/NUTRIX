import React from 'react';
import './OccupantCard.css';

export interface Occupant {
  id: string | number;
  nom: string;
  prenom: string;
  age: number;
  sexe: 'Homme' | 'Femme' | 'Autre';
  poids: number; // en kg
  apportsKcal: number; // objectif journalier en kcal
  apportsActuelsKcal?: number; // consommé aujourd'hui en kcal
  role?: string;
  avatarUrl?: string;
}

interface OccupantCardProps {
  occupant: Occupant;
}

export const OccupantCard: React.FC<OccupantCardProps> = ({ occupant }) => {
  const {
    nom,
    prenom,
    age,
    sexe,
    poids,
    apportsKcal,
    apportsActuelsKcal = Math.round(apportsKcal * 0.88),
    role = 'Occupant Station',
    avatarUrl,
  } = occupant;

  // Calcul du pourcentage d'apports kcal consommés
  const kcalPercent = Math.min(Math.round((apportsActuelsKcal / apportsKcal) * 100), 100);

  // Initiales pour l'avatar de secours
  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  // Couleur & icône du sexe
  const genderIcon = sexe === 'Homme' ? '♂' : sexe === 'Femme' ? '♀' : '⚥';
  const genderClass = sexe === 'Homme' ? 'gender--male' : sexe === 'Femme' ? 'gender--female' : 'gender--other';

  return (
    <div className="occupant-card">
      {/* En-tête de la Card : Avatar, Noms, Rôle & Statut */}
      <div className="occupant-card__header">
        <div className="occupant-card__avatar-wrapper">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${prenom} ${nom}`} className="occupant-card__avatar-img" />
          ) : (
            <div className={`occupant-card__avatar-fallback ${genderClass}`}>
              {initials}
            </div>
          )}
          <span className={`occupant-card__gender-badge ${genderClass}`} title={`Sexe: ${sexe}`}>
            {genderIcon}
          </span>
        </div>

        <div className="occupant-card__identity">
          <div className="occupant-card__name-group">
            <h3 className="occupant-card__fullname">
              <span className="occupant-card__prenom">{prenom}</span>{' '}
              <span className="occupant-card__nom">{nom}</span>
            </h3>
          </div>
          <p className="occupant-card__role">{role}</p>
        </div>
      </div>

      {/* Grille des Métriques Physiques : Âge, Sexe, Poids */}
      <div className="occupant-card__metrics-grid">
        <div className="metric-box">
          <div className="metric-box__info">
            <span className="metric-box__label">Sexe</span>
            <span className="metric-box__value">{sexe}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box__info">
            <span className="metric-box__label">Âge</span>
            <span className="metric-box__value">{age} ans</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box__info">
            <span className="metric-box__label">Poids</span>
            <span className="metric-box__value">{poids} kg</span>
          </div>
        </div>
      </div>

      {/* Section Apports Kcal avec Jauge de progression */}
      <div className="occupant-card__kcal-section">
        <div className="kcal-section__header">
          <span className="kcal-section__title">
            Apport Énergétique
          </span>
          <span className="kcal-section__count">
            <strong>{apportsActuelsKcal.toLocaleString()}</strong> / {apportsKcal.toLocaleString()} kcal
          </span>
        </div>

        <div className="kcal-progress">
          <div className="kcal-progress__track">
            <div
              className="kcal-progress__bar"
              style={{ width: `${kcalPercent}%` }}
            />
          </div>
          <div className="kcal-progress__meta">
            <span className="kcal-progress__percent">{kcalPercent}% atteint</span>
            <span className="kcal-progress__target">Cible: {apportsKcal} kcal/j</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupantCard;
