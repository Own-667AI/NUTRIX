import { useState } from 'react';
import './StockList.css';
import {
  IoNutritionOutline,
  IoLeafOutline,
  IoFishOutline,
  IoWaterOutline,
  IoCubeOutline,
  IoFlaskOutline,
} from 'react-icons/io5';

// Types
interface StockItem {
  name: string;
  qty: string;
}

interface StockCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  items: StockItem[];
  capacityPercent: number;
}

// Données fictives réalistes du stock de la station NUTRIX
const STOCK_CATEGORIES: StockCategory[] = [
  {
    id: 1,
    name: 'Viandes & Protéines',
    icon: <IoFishOutline />,
    capacityPercent: 62,
    items: [
      { name: 'Poulet lyophilisé', qty: '4.2 kg' },
      { name: 'Boeuf séché', qty: '4 kg' },
      { name: 'Tofu concentré', qty: '3.1 kg' },
      { name: 'Oeufs en poudre', qty: '0.4 kg' },
    ],
  },
  {
    id: 2,
    name: 'Légumes',
    icon: <IoLeafOutline />,
    capacityPercent: 78,
    items: [
      { name: 'Carottes déshydratées', qty: '2.5 kg' },
      { name: 'Épinards lyophilisés', qty: '1.2 kg' },
      { name: 'Haricots verts', qty: '0.9 kg' },
      { name: 'Pommes de terre flocons', qty: '3.8 kg' },
    ],
  },
  {
    id: 3,
    name: 'Fruits',
    icon: <IoNutritionOutline />,
    capacityPercent: 45,
    items: [
      { name: 'Pommes séchées', qty: '0.8 kg' },
      { name: 'Bananes lyophilisées', qty: '0.5 kg' },
      { name: 'Fruits rouges mix', qty: '1.1 kg' },
      { name: 'Compote en tube', qty: '12 unités' },
    ],
  },
  {
    id: 4,
    name: 'Féculents & Céréales',
    icon: <IoCubeOutline />,
    capacityPercent: 85,
    items: [
      { name: 'Riz long grain', qty: '6.0 kg' },
      { name: 'Pâtes complètes', qty: '4.5 kg' },
      { name: 'Quinoa', qty: '2.2 kg' },
      { name: 'Pain de mie sous vide', qty: '8 sachets' },
    ],
  },
  {
    id: 5,
    name: 'Produits Laitiers',
    icon: <IoWaterOutline />,
    capacityPercent: 34,
    items: [
      { name: 'Lait en poudre', qty: '1.5 kg' },
      { name: 'Fromage à pâte dure', qty: '0.6 kg' },
      { name: 'Yaourt lyophilisé', qty: '0.9 kg' },
    ],
  },
  {
    id: 6,
    name: 'Compléments & Condiments',
    icon: <IoFlaskOutline />,
    capacityPercent: 71,
    items: [
      { name: 'Sel iodé', qty: '0.3 kg' },
      { name: 'Huile d\'olive', qty: '1.2 L' },
      { name: 'Vitamines B12 + D', qty: '45 comprimés' },
      { name: 'Épices mélangées', qty: '0.2 kg' },
    ],
  },
];

function getGaugeClass(percent: number): string {
  if (percent >= 60) return 'stock-gauge__bar--ok';
  if (percent >= 35) return 'stock-gauge__bar--low';
  return 'stock-gauge__bar--critical';
}

export default function StockList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState<StockCategory[]>(STOCK_CATEGORIES);

  // Filtrage par recherche
  const filteredCategories = categories.filter((cat) => {
    const matchesCategory = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesItem = cat.items.some((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory || matchesItem;
  });

  // KPIs
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const avgCapacity = Math.round(
    categories.reduce((acc, cat) => acc + cat.capacityPercent, 0) / categories.length
  );

  return (
    <div className="stock-page">
      {/* En-tête */}
      <div className="stock-page__header">
        <div>
          <h2 className="stock-page__title">Stock Alimentaire</h2>
          <p className="stock-page__subtitle">
            Inventaire des ressources alimentaires disponibles à bord de la station
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="stock-page__stats">
        <div className="stat-card">
          <IoCubeOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{totalItems}</span>
            <span className="stat-card__label">Produits en stock</span>
          </div>
        </div>

        <div className="stat-card">
          <IoNutritionOutline />
          <div className="stat-card__content">
            <span className="stat-card__value">{avgCapacity}%</span>
            <span className="stat-card__label">Capacité moyenne</span>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="stock-page__toolbar">
          <div className="toolbar__search">
            <input
              type="text"
              placeholder="Rechercher un ingrédient ou une catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grille des catégories */}
      {filteredCategories.length > 0 ? (
        <div className="stock-page__grid">
          {filteredCategories.map((category) => (
            <div className="stock-category-card" key={category.id}>
              {/* Header */}
              <div className="stock-category-card__header">
                <div className="stock-category-card__icon">{category.icon}</div>
                <div className="stock-category-card__identity">
                  <h3 className="stock-category-card__name">{category.name}</h3>
                  <span className="stock-category-card__count">
                    {category.items.length} produit{category.items.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Liste ingrédients */}
              <div className="stock-category-card__items">
                {category.items.map((item, idx) => (
                  <div className="stock-item" key={idx}>
                    <span className="stock-item__name">{item.name}</span>
                    <div className="stock-item__details">
                      <span className="stock-item__qty">{item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Jauge de stock */}
              <div className="stock-category-card__gauge">
                <div className="stock-gauge__header">
                  <span className="stock-gauge__title">Niveau global</span>
                  <span className="stock-gauge__value">
                    <strong>{category.capacityPercent}%</strong> de la capacité
                  </span>
                </div>
                <div className="stock-gauge__track">
                  <div
                    className={`stock-gauge__bar ${getGaugeClass(category.capacityPercent)}`}
                    style={{ width: `${category.capacityPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stock-page__empty">
          <h3>Aucun résultat</h3>
          <p>Aucune catégorie ou ingrédient ne correspond à "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
}
