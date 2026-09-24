import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  BarChart,
} from 'recharts';
import './Previsionnel.css';
import {
  IoLeafOutline,
  IoWarningOutline,
  IoTimeOutline,
  IoRestaurantOutline,
  IoNutritionOutline,
} from 'react-icons/io5';

// Couleurs de la charte NUTRIX (valeurs figées pour Recharts, cf. CSS vars équivalentes)
const COLOR_SEA_GREEN = '#40916C';
const COLOR_MINT_LEAF = '#74C69D';
const COLOR_WARNING = '#E9C46A';
const COLOR_GRID = 'rgba(216, 243, 220, 0.1)';
const COLOR_AXIS = 'rgba(216, 243, 220, 0.55)';

// --- Données fictives : projection hebdomadaire sur 8 semaines ------------

const STOCK_INITIAL_KG = 520;

const APPORTS_HEBDO = [
  { semaine: 'S1', recolte: 60, consommation: 92 },
  { semaine: 'S2', recolte: 55, consommation: 90 },
  { semaine: 'S3', recolte: 40, consommation: 94 },
  { semaine: 'S4', recolte: 70, consommation: 91 },
  { semaine: 'S5', recolte: 35, consommation: 93 },
  { semaine: 'S6', recolte: 50, consommation: 95 },
  { semaine: 'S7', recolte: 65, consommation: 92 },
  { semaine: 'S8', recolte: 45, consommation: 96 },
];

// Stock cumulé + solde hebdo, calculés à partir du stock initial
let stockCourant = STOCK_INITIAL_KG;
const PREVISIONNEL_DATA = APPORTS_HEBDO.map((semaine) => {
  const solde = semaine.recolte - semaine.consommation;
  stockCourant += solde;
  return {
    ...semaine,
    stock: Math.round(stockCourant),
    solde,
  };
});

const TOTAL_RECOLTE = APPORTS_HEBDO.reduce((acc, s) => acc + s.recolte, 0);
const TOTAL_CONSOMMATION = APPORTS_HEBDO.reduce((acc, s) => acc + s.consommation, 0);
const SOLDE_NET = TOTAL_RECOLTE - TOTAL_CONSOMMATION;
const STOCK_FINAL = STOCK_INITIAL_KG + SOLDE_NET;
const CONSO_MOYENNE_JOUR = TOTAL_CONSOMMATION / (APPORTS_HEBDO.length * 7);
const SOLDE_MOYEN_JOUR = SOLDE_NET / (APPORTS_HEBDO.length * 7);

// Autonomie restante : nombre de jours avant rupture si la tendance se maintient
const JOURS_AUTONOMIE =
  SOLDE_MOYEN_JOUR < 0
    ? Math.max(Math.round(STOCK_FINAL / Math.abs(SOLDE_MOYEN_JOUR)), 0)
    : null;

// --- Données fictives : consommation du mois en cours ---------------------

const TOP_ALIMENTS = [
  { id: 1, nom: 'Riz complet', qteKg: 86 },
  { id: 2, nom: 'Poulet lyophilisé', qteKg: 74 },
  { id: 3, nom: 'Pâtes complètes', qteKg: 68 },
  { id: 4, nom: 'Épinards lyophilisés', qteKg: 51 },
  { id: 5, nom: 'Quinoa', qteKg: 44 },
  { id: 6, nom: 'Pommes de terre flocons', qteKg: 39 },
].sort((a, b) => b.qteKg - a.qteKg);

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
            Projection sur 8 semaines du stock, des récoltes et de la consommation de la station
          </p>
        </div>
      </div>

      {/* KPIs de synthèse */}
      <div className="previsionnel-page__stats">
        <div className="stat-card">
          <IoLeafOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{TOTAL_RECOLTE} kg</span>
            <span className="stat-card__label">Récolte totale prévue</span>
          </div>
        </div>

        <div className="stat-card">
          <IoRestaurantOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{CONSO_MOYENNE_JOUR.toFixed(1)} kg/j</span>
            <span className="stat-card__label">Consommation moyenne quotidienne</span>
          </div>
        </div>

        <div className="stat-card">
          <IoWarningOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">
              {SOLDE_NET >= 0 ? '+' : ''}
              {SOLDE_NET} kg
            </span>
            <span className="stat-card__label">Solde net projeté (8 sem.)</span>
          </div>
        </div>

        <div className="stat-card">
          <IoTimeOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">
              {JOURS_AUTONOMIE !== null ? `${JOURS_AUTONOMIE} j` : 'Stable'}
            </span>
            <span className="stat-card__label">Autonomie avant rupture</span>
          </div>
        </div>
      </div>

      {/* Graphique + tableau prévisionnel */}
      <div className="forecast-panel">
        <div className="forecast-panel__header">
          <h3 className="forecast-panel__title">Stock, récoltes & consommation</h3>
          <div className="forecast-panel__legend">
            <span className="legend-dot" style={{ background: COLOR_MINT_LEAF }} />
            Stock projeté
            <span className="legend-dot" style={{ background: COLOR_SEA_GREEN }} />
            Récolte
            <span className="legend-dot" style={{ background: COLOR_WARNING }} />
            Consommation
          </div>
        </div>

        <div className="forecast-panel__chart">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={PREVISIONNEL_DATA} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={COLOR_GRID} vertical={false} />
              <XAxis dataKey="semaine" stroke={COLOR_AXIS} fontSize={12} tickLine={false} />
              <YAxis stroke={COLOR_AXIS} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0d2a1f',
                  border: '1px solid rgba(116, 198, 157, 0.25)',
                  borderRadius: 8,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#D8F3DC' }}
              />
              <Bar dataKey="recolte" name="Récolte (kg)" fill={COLOR_SEA_GREEN} radius={[4, 4, 0, 0]} barSize={18} />
              <Bar
                dataKey="consommation"
                name="Consommation (kg)"
                fill={COLOR_WARNING}
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              <Line
                type="monotone"
                dataKey="stock"
                name="Stock projeté (kg)"
                stroke={COLOR_MINT_LEAF}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLOR_MINT_LEAF }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="forecast-panel__table-wrapper">
          <table className="previsionnel-table">
            <thead>
              <tr>
                <th>Semaine</th>
                <th>Stock projeté</th>
                <th>Récolte</th>
                <th>Consommation</th>
                <th>Solde hebdo</th>
              </tr>
            </thead>
            <tbody>
              {PREVISIONNEL_DATA.map((semaine) => (
                <tr key={semaine.semaine}>
                  <td>{semaine.semaine}</td>
                  <td>{semaine.stock} kg</td>
                  <td>{semaine.recolte} kg</td>
                  <td>{semaine.consommation} kg</td>
                  <td>
                    <span
                      className={`previsionnel-table__delta ${semaine.solde >= 0
                        ? 'previsionnel-table__delta--positive'
                        : 'previsionnel-table__delta--negative'
                        }`}
                    >
                      {semaine.solde >= 0 ? '+' : ''}
                      {semaine.solde} kg
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques de consommation du mois en cours */}
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