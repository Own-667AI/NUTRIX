import { useState } from 'react';
import OccupantCard, { type Occupant } from '../../components/occupants/OccupantCard';
import './OccupantsList.css';
import { IoAccessibilityOutline, IoFitnessOutline, IoPodiumOutline } from "react-icons/io5";

// Données fictives réalistes des occupants de la station NUTRIX
const INITIAL_OCCUPANTS: Occupant[] = [
  {
    id: 1,
    nom: 'Dubois',
    prenom: 'Claire',
    age: 34,
    sexe: 'Femme',
    poids: 61.5,
    apportsKcal: 2150,
    apportsActuelsKcal: 1980,
    role: 'Commandante de Bord',
  },
  {
    id: 2,
    nom: 'Moreau',
    prenom: 'Thomas',
    age: 38,
    sexe: 'Homme',
    poids: 78.0,
    apportsKcal: 2700,
    apportsActuelsKcal: 2550,
    role: 'Ingénieur Agronome',
  },
  {
    id: 3,
    nom: 'Bertrand',
    prenom: 'Élodie',
    age: 29,
    sexe: 'Femme',
    poids: 57.0,
    apportsKcal: 2000,
    apportsActuelsKcal: 1650,
    role: 'Médecin Nutritionniste',
  },
  {
    id: 4,
    nom: 'Laurent',
    prenom: 'Marc',
    age: 45,
    sexe: 'Homme',
    poids: 84.2,
    apportsKcal: 2850,
    apportsActuelsKcal: 2800,
    role: 'Spécialiste Systèmes Support',
  },
  {
    id: 5,
    nom: 'Benali',
    prenom: 'Sophie',
    age: 35,
    sexe: 'Femme',
    poids: 64.0,
    apportsKcal: 2300,
    apportsActuelsKcal: 2100,
    role: 'Chercheuse en Biologie',
  },
  {
    id: 6,
    nom: 'Garcia',
    prenom: 'Antoine',
    age: 31,
    sexe: 'Homme',
    poids: 73.8,
    apportsKcal: 2550,
    apportsActuelsKcal: 2200,
    role: 'Pilote & Logistique',
  },
];

export default function OccupantsList() {
  const [occupants] = useState<Occupant[]>(INITIAL_OCCUPANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'Tous' | 'Homme' | 'Femme'>('Tous');

  // Filtrage dynamique
  const filteredOccupants = occupants.filter((occ) => {
    const matchesSearch =
      occ.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (occ.role && occ.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGender = selectedGender === 'Tous' || occ.sexe === selectedGender;

    return matchesSearch && matchesGender;
  });

  // KPIs de synthèse
  const totalOccupants = occupants.length;
  const avgAge = Math.round(occupants.reduce((acc, occ) => acc + occ.age, 0) / totalOccupants);
  const totalKcalTarget = occupants.reduce((acc, occ) => acc + occ.apportsKcal, 0);

  return (
    <div className="occupants-page">
      {/* En-tête principal */}
      <div className="occupants-page__header">
        <div>
          <h2 className="occupants-page__title">Liste des Occupants</h2>
          <p className="occupants-page__subtitle">
            Suivi physiologique et des besoins énergétiques de l'équipage
          </p>
        </div>
      </div>

      {/* Cartes de Statistiques Clés */}
      <div className="occupants-page__stats">
        <div className="stat-card">
          <IoAccessibilityOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{totalOccupants}</span>
            <span className="stat-card__label">Occupants inscrits</span>
          </div>
        </div>

        <div className="stat-card">
          <IoPodiumOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{avgAge} ans</span>
            <span className="stat-card__label">Âge moyen équipage</span>
          </div>
        </div>

        <div className="stat-card">
          <IoFitnessOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{totalKcalTarget.toLocaleString()} kcal</span>
            <span className="stat-card__label">Besoin quotidien total</span>
          </div>
        </div>
      </div>

      {/* Barre d'outils et de filtres */}
      <div className="occupants-page__toolbar">
        <div className="toolbar__search">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou rôle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar__filters">
          <button
            type="button"
            className={`filter-btn ${selectedGender === 'Tous' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedGender('Tous')}
          >
            Tous ({occupants.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedGender === 'Homme' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedGender('Homme')}
          >
            Hommes ({occupants.filter((o) => o.sexe === 'Homme').length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedGender === 'Femme' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedGender('Femme')}
          >
            Femmes ({occupants.filter((o) => o.sexe === 'Femme').length})
          </button>
        </div>
      </div>

      {/* Grille des OccupantCards */}
      {filteredOccupants.length > 0 ? (
        <div className="occupants-page__grid">
          {filteredOccupants.map((occupant) => (
            <OccupantCard
              key={occupant.id}
              occupant={occupant}
            />
          ))}
        </div>
      ) : (
        <div className="occupants-page__empty">
          <h3>Aucun occupant trouvé</h3>
          <p>Aucun résultat ne correspond à votre recherche "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
}
