import { useState } from 'react';
import MealCard, { type Meal } from '../../components/repas/MealCard';
import './Planificateur.css';

type Allergene = {
  id: number;
  nom: string;
};

// Données fictives réalistes des repas de la station NUTRIX
const INITIAL_MEALS: Meal[] = [
  {
    id: 1,
    label: 'Menu A — Poulet grillé, riz complet, épinards',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Poulet grillé', 'Riz complet', 'Épinards'],
    listeAllergènes: ['Gluten', 'Lactose'],
    disponible: true,
  },
  {
    id: 2,
    label: 'Menu B — Tofu sauté, quinoa, carottes glacées',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Tofu sauté', 'Quinoa', 'Carottes glacées'],
    listeAllergènes: ['Gluten', 'Lactose'],
    disponible: false,
  },
  {
    id: 3,
    label: 'Menu C — Boeuf séché, pâtes complètes, haricots verts',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Boeuf séché', 'Pâtes complètes', 'Haricots verts'],
    listeAllergènes: ['Gluten', 'Lactose'],
    disponible: true,
  },
  {
    id: 4,
    label: 'Menu D — Omelette protéinée, pommes de terre, salade',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Omelette protéinée', 'Pommes de terre', 'Salade'],
    listeAllergènes: ['Gluten', 'Lactose'],
    disponible: true,
  },
  {
    id: 5,
    label: 'Menu E — Soupe de légumes, pain complet, fromage',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Soupe de légumes', 'Pain complet', 'Fromage'],
    listeAllergènes: ['Gluten', 'Lactose'],
    disponible: false,
  },
  {
    id: 6,
    label: 'Menu F — Riz au lait, fruits secs, compote',
    calories: 2150,
    Proteines: 45,
    Glucides: 50,
    Lipides: 15,
    listeAliments: ['Riz au lait', 'Fruits secs', 'Compote'],
    listeAllergènes: ['Arachides'],
    disponible: true,
  },
];

const ALLERGENES: Allergene[] = [
  { id: 1, nom: 'Gluten' },
  { id: 2, nom: 'Lactose' },
  { id: 3, nom: 'Arachides' },
];

export default function Planificateur() {
  const [meals] = useState<Meal[]>(INITIAL_MEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisponibility, setSelectedDisponibility] = useState<
    'Tous' | 'Disponible' | 'Non disponible'
  >('Tous');
  const [selectedAllergene, setSelectedAllergene] = useState<string>('');

  // filtrage dynamique
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDisponibility =
      selectedDisponibility === 'Tous' ||
      (selectedDisponibility === 'Disponible' && meal.disponible) ||
      (selectedDisponibility === 'Non disponible' && !meal.disponible);

    const matchesAllergene =
      selectedAllergene === '' ||
      !meal.listeAllergènes.includes(selectedAllergene);

    return matchesSearch && matchesDisponibility && matchesAllergene;
  });

  const totalMeals = meals.length;
  const totalDisponibles = meals.filter((m) => m.disponible).length;

  return (
    <div className="planificateur-page">
      {/* En-tête principal */}
      <div className="planificateur-page__header">
        <div>
          <h2 className="planificateur-page__title">Planificateur de repas</h2>
          <p className="planificateur-page__subtitle">
            Génération de menus sous contraintes (stock, allergies, péremption,
            réserves) — à implémenter.
          </p>
        </div>
      </div>

      {/* Barre d'outils et de filtres */}
      <div className="planificateur-page__toolbar">
        <div className="toolbar__search">
          <input
            type="text"
            placeholder="Rechercher par nom de menu, ingrédients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar__filters">
          <button
            type="button"
            className={`filter-btn ${selectedDisponibility === 'Tous' ? 'filter-btn--active' : ''
              }`}
            onClick={() => setSelectedDisponibility('Tous')}
          >
            Tous ({totalMeals})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedDisponibility === 'Disponible' ? 'filter-btn--active' : ''
              }`}
            onClick={() => setSelectedDisponibility('Disponible')}
          >
            Disponible ({totalDisponibles})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedDisponibility === 'Non disponible'
              ? 'filter-btn--active'
              : ''
              }`}
            onClick={() => setSelectedDisponibility('Non disponible')}
          >
            Non disponible ({totalMeals - totalDisponibles})
          </button>

          {/* defilant pour suprimer les plat suivant les allergie cocher par l'utilisateur */}
          <select
            value={selectedAllergene}
            onChange={(e) => setSelectedAllergene(e.target.value)}
          >
            <option value="">Tous les allergènes</option>
            {ALLERGENES.map((allergene) => (
              <option key={allergene.id} value={allergene.nom}>
                Sans {allergene.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grille des MealCards */}
      {filteredMeals.length > 0 ? (
        <div className="planificateur-page__grid">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="planificateur-page__empty">
          <h3>Aucun menu trouvé</h3>
          <p>
            Aucun résultat ne correspond à votre recherche "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
}