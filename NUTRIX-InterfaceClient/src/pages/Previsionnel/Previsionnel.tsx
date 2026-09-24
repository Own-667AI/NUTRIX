import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import './Previsionnel.css';
import {
  IoBasketOutline,
  IoWarningOutline,
  IoTrendingUpOutline,
  IoRestaurantOutline,
  IoAlertCircleOutline,
  IoNutritionOutline,
} from 'react-icons/io5';

// Couleurs de la charte NUTRIX (valeurs figées pour Recharts, cf. CSS vars équivalentes)
const COLOR_SEA_GREEN = '#40916C';
const COLOR_MINT_LEAF = '#74C69D';
const COLOR_GRID = 'rgba(216, 243, 220, 0.1)';
const COLOR_AXIS = 'rgba(216, 243, 220, 0.55)';

// --- Types --------------------------------------------------------------

type Priorite = 'urgente' | 'moyenne' | 'faible';

interface ObjectifProduction {
  id: number;
  aliment: string;
  consommationHebdoKg: number;
  stockActuelKg: number;
}

const HORIZON_SEMAINES = 8;

// --- Données fictives : besoin sur 8 semaines vs stock actuel -----------
// Basé sur les habitudes de consommation (comme sur Agriculture), mais ici
// on projette le besoin TOTAL sur 8 semaines pour en déduire un objectif
// de production chiffré, plutôt qu'une simple alerte de rupture.

const OBJECTIFS_PRODUCTION: ObjectifProduction[] = [
  { id: 1, aliment: 'Riz complet', consommationHebdoKg: 20, stockActuelKg: 120 },
  { id: 2, aliment: 'Blé (pour pâtes)', consommationHebdoKg: 16, stockActuelKg: 15 },
  { id: 3, aliment: 'Épinards', consommationHebdoKg: 12, stockActuelKg: 18 },
  { id: 4, aliment: 'Quinoa', consommationHebdoKg: 10, stockActuelKg: 30 },
  { id: 5, aliment: 'Pommes de terre', consommationHebdoKg: 9, stockActuelKg: 95 },
  { id: 6, aliment: 'Haricots verts', consommationHebdoKg: 5, stockActuelKg: 9 },
  { id: 7, aliment: 'Tomates', consommationHebdoKg: 7, stockActuelKg: 25 },
];

function getPriorite(couverturePercent: number): Priorite {
  if (couverturePercent < 25) return 'urgente';
  if (couverturePercent < 60) return 'moyenne';
  return 'faible';
}

const PRIORITE_LABEL: Record<Priorite, string> = {
  urgente: 'Production prioritaire',
  moyenne: 'À planifier',
  faible: 'Stock suffisant',
};

const PLAN_PRODUCTION = OBJECTIFS_PRODUCTION.map((o) => {
  const besoinTotalKg = o.consommationHebdoKg * HORIZON_SEMAINES;
  const aProduireKg = Math.max(besoinTotalKg - o.stockActuelKg, 0);
  const couverturePercent = Math.min(Math.round((o.stockActuelKg / besoinTotalKg) * 100), 100);
  return {
    ...o,
    besoinTotalKg,
    aProduireKg,
    couverturePercent,
    priorite: getPriorite(couverturePercent),
  };
}).sort((a, b) => b.aProduireKg - a.aProduireKg);

const TOTAL_A_PRODUIRE = PLAN_PRODUCTION.reduce((acc, p) => acc + p.aProduireKg, 0);
const TOTAL_BESOIN = PLAN_PRODUCTION.reduce((acc, p) => acc + p.besoinTotalKg, 0);
const ALIMENTS_EN_TENSION = PLAN_PRODUCTION.filter((p) => p.priorite !== 'faible').length;
const ALIMENT_PRIORITAIRE = PLAN_PRODUCTION[0];

// Données pour le graphique groupé Besoin vs Stock
const CHART_DATA = [...PLAN_PRODUCTION].sort((a, b) => a.couverturePercent - b.couverturePercent);

// --- Données fictives : aliments les plus consommés ce mois-ci ----------

const TOP_ALIMENTS = [
  { id: 1, nom: 'Riz complet', qteKg: 86 },
  { id: 2, nom: 'Poulet lyophilisé', qteKg: 74 },
  { id: 3, nom: 'Pâtes complètes', qteKg: 68 },
  { id: 4, nom: 'Épinards lyophilisés', qteKg: 51 },
  { id: 5, nom: 'Quinoa', qteKg: 44 },
  { id: 6, nom: 'Pommes de terre flocons', qteKg: 39 },
].sort((a, b) => b.qteKg - a.qteKg);

// --- Données fictives : menus les plus servis ce mois-ci ----------------

const TOP_MENUS = [
  { id: 1, nom: 'Menu A — Poulet grillé', fois: 18 },
  { id: 2, nom: 'Menu D — Omelette protéinée', fois: 15 },
  { id: 3, nom: 'Menu F — Riz au lait', fois: 13 },
  { id: 4, nom: 'Menu C — Boeuf séché', fois: 11 },
  { id: 5, nom: 'Menu B — Tofu sauté', fois: 9 },
].sort((a, b) => b.fois - a.fois);

export default function Previsionnel() {
  return (
    <div className="previsionnel-page">
      {/* En-tête */}
      <div className="previsionnel-page__header">
        <div>
          <h2 className="previsionnel-page__title">Prévisionnel</h2>
          <p className="previsionnel-page__subtitle">
            Objectifs de production pour les {HORIZON_SEMAINES} prochaines semaines, selon les
            habitudes de consommation et le stock actuel
          </p>
        </div>
      </div>

      {/* KPIs de synthèse */}
      <div className="previsionnel-page__stats">
        <div className="stat-card">
          <IoBasketOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{TOTAL_A_PRODUIRE} kg</span>
            <span className="stat-card__label">Total à produire (8 sem.)</span>
          </div>
        </div>

        <div className="stat-card">
          <IoTrendingUpOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{TOTAL_BESOIN} kg</span>
            <span className="stat-card__label">Besoin total prévu (8 sem.)</span>
          </div>
        </div>

        <div className="stat-card">
          <IoWarningOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{ALIMENTS_EN_TENSION}</span>
            <span className="stat-card__label">Aliments en tension</span>
          </div>
        </div>

        <div className="stat-card">
          <IoAlertCircleOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{ALIMENT_PRIORITAIRE.aProduireKg} kg</span>
            <span className="stat-card__label">{ALIMENT_PRIORITAIRE.aliment} — priorité n°1</span>
          </div>
        </div>
      </div>

      {/* Graphique Besoin vs Stock */}
      <div className="forecast-panel">
        <div className="forecast-panel__header">
          <h3 className="forecast-panel__title">Besoin sur 8 semaines vs stock actuel</h3>
          <div className="forecast-panel__legend">
            <span className="legend-dot" style={{ background: COLOR_MINT_LEAF }} />
            Stock actuel
            <span className="legend-dot" style={{ background: COLOR_SEA_GREEN }} />
            Besoin total (8 sem.)
          </div>
        </div>

        <div className="forecast-panel__chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={CHART_DATA}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={COLOR_GRID} horizontal={false} />
              <XAxis type="number" stroke={COLOR_AXIS} fontSize={12} tickLine={false} />
              <YAxis
                type="category"
                dataKey="aliment"
                stroke={COLOR_AXIS}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  background: '#0d2a1f',
                  border: '1px solid rgba(116, 198, 157, 0.25)',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#D8F3DC' }}
                formatter={(value) => [`${value} kg`, undefined]}
              />
              <Bar dataKey="besoinTotalKg" name="Besoin total (8 sem.)" fill={COLOR_SEA_GREEN} radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="stockActuelKg" name="Stock actuel" fill={COLOR_MINT_LEAF} radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Détail par aliment : objectif de production */}
        <div className="besoins-panel__list">
          {PLAN_PRODUCTION.map((item) => (
            <div key={item.id} className="besoin-row">
              <div className="besoin-row__info">
                <span className="besoin-row__nom">{item.aliment}</span>
                <span className="besoin-row__detail">
                  {item.stockActuelKg} kg en stock · {item.besoinTotalKg} kg nécessaires sur{' '}
                  {HORIZON_SEMAINES} semaines
                </span>
              </div>

              <div className="besoin-row__gauge">
                <div className="besoin-gauge__track">
                  <div
                    className={`besoin-gauge__bar besoin-gauge__bar--${item.priorite}`}
                    style={{ width: `${item.couverturePercent}%` }}
                  />
                </div>
                <span className="besoin-row__percent">
                  {item.aProduireKg > 0
                    ? `${item.aProduireKg} kg à produire`
                    : 'Stock suffisant, rien à produire'}
                </span>
              </div>

              <span className={`besoin-row__badge besoin-row__badge--${item.priorite}`}>
                {item.priorite === 'urgente' && <IoAlertCircleOutline />}
                {PRIORITE_LABEL[item.priorite]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Aliments et menus les plus consommés, pour contextualiser la demande */}
      <div className="previsionnel-page__rankings">
        <div className="ranking-panel">
          <div className="ranking-panel__header">
            <IoNutritionOutline className="ranking-panel__icon" />
            <h3 className="ranking-panel__title">Aliments les plus consommés</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={TOP_ALIMENTS}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={COLOR_GRID} horizontal={false} />
              <XAxis type="number" stroke={COLOR_AXIS} fontSize={12} tickLine={false} />
              <YAxis
                type="category"
                dataKey="nom"
                stroke={COLOR_AXIS}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <Tooltip
                contentStyle={{
                  background: '#0d2a1f',
                  border: '1px solid rgba(116, 198, 157, 0.25)',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#D8F3DC' }}
                formatter={(value) => [`${value} kg`, 'Consommé']}
              />
              <Bar dataKey="qteKg" fill={COLOR_MINT_LEAF} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ranking-panel">
          <div className="ranking-panel__header">
            <IoRestaurantOutline className="ranking-panel__icon" />
            <h3 className="ranking-panel__title">Menus les plus servis ce mois-ci</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={TOP_MENUS}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={COLOR_GRID} horizontal={false} />
              <XAxis type="number" stroke={COLOR_AXIS} fontSize={12} tickLine={false} />
              <YAxis
                type="category"
                dataKey="nom"
                stroke={COLOR_AXIS}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={170}
              />
              <Tooltip
                contentStyle={{
                  background: '#0d2a1f',
                  border: '1px solid rgba(116, 198, 157, 0.25)',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#D8F3DC' }}
                formatter={(value) => [`${value} fois`, 'Servi']}
              />
              <Bar dataKey="fois" fill={COLOR_SEA_GREEN} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}