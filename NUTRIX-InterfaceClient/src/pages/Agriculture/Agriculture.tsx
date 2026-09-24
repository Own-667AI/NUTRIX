import { useState } from 'react';
import './Agriculture.css';
import {
  IoLeafOutline,
  IoWarningOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
} from 'react-icons/io5';

// --- Types ------------------------------------------------------------

type Priorite = 'urgente' | 'moyenne' | 'faible';

interface BesoinPlantation {
  id: number;
  aliment: string;
  consommationMoisKg: number;
  stockActuelKg: number;
}

// Nombre de jours d'autonomie considéré comme confortable (jauge à 100%)
const AUTONOMIE_CIBLE_JOURS = 45;

// --- Données fictives : habitudes de consommation vs stock actuel ------

const BESOINS_PLANTATION: BesoinPlantation[] = [
  { id: 1, aliment: 'Riz complet', consommationMoisKg: 86, stockActuelKg: 120 },
  { id: 2, aliment: 'Blé (pour pâtes)', consommationMoisKg: 68, stockActuelKg: 15 },
  { id: 3, aliment: 'Épinards', consommationMoisKg: 51, stockActuelKg: 18 },
  { id: 4, aliment: 'Quinoa', consommationMoisKg: 44, stockActuelKg: 30 },
  { id: 5, aliment: 'Pommes de terre', consommationMoisKg: 39, stockActuelKg: 95 },
  { id: 6, aliment: 'Haricots verts', consommationMoisKg: 22, stockActuelKg: 9 },
  { id: 7, aliment: 'Tomates', consommationMoisKg: 30, stockActuelKg: 25 },
];

function getJoursAutonomie(besoin: BesoinPlantation): number {
  const consommationJourKg = besoin.consommationMoisKg / 30;
  return Math.round(besoin.stockActuelKg / consommationJourKg);
}

function getPriorite(joursAutonomie: number): Priorite {
  if (joursAutonomie < 15) return 'urgente';
  if (joursAutonomie < 30) return 'moyenne';
  return 'faible';
}

const PRIORITE_LABEL: Record<Priorite, string> = {
  urgente: 'Planter en priorité',
  moyenne: 'À renforcer',
  faible: 'Stock suffisant',
};

const BESOINS = BESOINS_PLANTATION.map((besoin) => {
  const joursAutonomie = getJoursAutonomie(besoin);
  return {
    ...besoin,
    joursAutonomie,
    priorite: getPriorite(joursAutonomie),
    gaugePercent: Math.min(
      Math.round((joursAutonomie / AUTONOMIE_CIBLE_JOURS) * 100),
      100
    ),
  };
}).sort((a, b) => a.joursAutonomie - b.joursAutonomie);

export default function Agriculture() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorite, setSelectedPriorite] = useState<'Toutes' | Priorite>('Toutes');

  const filteredBesoins = BESOINS.filter((besoin) => {
    const matchesSearch = besoin.aliment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriorite = selectedPriorite === 'Toutes' || besoin.priorite === selectedPriorite;
    return matchesSearch && matchesPriorite;
  });

  const besoinsUrgents = BESOINS.filter((b) => b.priorite === 'urgente').length;
  const autonomieMoyenne = Math.round(
    BESOINS.reduce((acc, b) => acc + b.joursAutonomie, 0) / BESOINS.length
  );
  const alimentLePlusCritique = BESOINS[0];

  return (
    <div className="agriculture-page">
      {/* En-tête */}
      <div className="agriculture-page__header">
        <div>
          <h2 className="agriculture-page__title">Agriculture & Récoltes</h2>
          <p className="agriculture-page__subtitle">
            Ce qu'il faudra planter, déduit des habitudes de consommation et du stock actuel
          </p>
        </div>
      </div>

      {/* KPIs de synthèse */}
      <div className="agriculture-page__stats">
        <div className="stat-card">
          <IoLeafOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{BESOINS.length}</span>
            <span className="stat-card__label">Aliments suivis</span>
          </div>
        </div>

        <div className="stat-card">
          <IoWarningOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{besoinsUrgents}</span>
            <span className="stat-card__label">Besoins urgents</span>
          </div>
        </div>

        <div className="stat-card">
          <IoTimeOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{autonomieMoyenne} j</span>
            <span className="stat-card__label">Autonomie moyenne</span>
          </div>
        </div>

        <div className="stat-card">
          <IoAlertCircleOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{alimentLePlusCritique.joursAutonomie} j</span>
            <span className="stat-card__label">{alimentLePlusCritique.aliment} — le plus critique</span>
          </div>
        </div>
      </div>

      {/* Barre d'outils et de filtres */}
      <div className="agriculture-page__toolbar">
        <div className="toolbar__search">
          <input
            type="text"
            placeholder="Rechercher un aliment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar__filters">
          <button
            type="button"
            className={`filter-btn ${selectedPriorite === 'Toutes' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedPriorite('Toutes')}
          >
            Toutes ({BESOINS.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedPriorite === 'urgente' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedPriorite('urgente')}
          >
            Urgent ({BESOINS.filter((b) => b.priorite === 'urgente').length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedPriorite === 'moyenne' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedPriorite('moyenne')}
          >
            À renforcer ({BESOINS.filter((b) => b.priorite === 'moyenne').length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedPriorite === 'faible' ? 'filter-btn--active' : ''}`}
            onClick={() => setSelectedPriorite('faible')}
          >
            Suffisant ({BESOINS.filter((b) => b.priorite === 'faible').length})
          </button>
        </div>
      </div>

      {/* Liste des besoins de plantation */}
      {filteredBesoins.length > 0 ? (
        <div className="besoins-panel">
          <div className="besoins-panel__list">
            {filteredBesoins.map((besoin) => (
              <div key={besoin.id} className="besoin-row">
                <div className="besoin-row__info">
                  <span className="besoin-row__nom">{besoin.aliment}</span>
                  <span className="besoin-row__detail">
                    {besoin.stockActuelKg} kg en stock · {besoin.consommationMoisKg} kg/mois
                    consommés
                  </span>
                </div>

                <div className="besoin-row__gauge">
                  <div className="besoin-gauge__track">
                    <div
                      className={`besoin-gauge__bar besoin-gauge__bar--${besoin.priorite}`}
                      style={{ width: `${besoin.gaugePercent}%` }}
                    />
                  </div>
                  <span className="besoin-row__percent">
                    {besoin.joursAutonomie} j d'autonomie restants
                  </span>
                </div>

                <span className={`besoin-row__badge besoin-row__badge--${besoin.priorite}`}>
                  {besoin.priorite === 'urgente' && <IoAlertCircleOutline />}
                  {PRIORITE_LABEL[besoin.priorite]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="agriculture-page__empty">
          <h3>Aucun aliment trouvé</h3>
          <p>Aucun résultat ne correspond à votre recherche "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
}