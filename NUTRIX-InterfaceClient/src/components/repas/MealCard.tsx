import React from 'react';
import './MealCard.css';

export interface Meal {
    id: string | number;
    label: string;
    calories: number;
    Proteines: number;
    Glucides: number;
    Lipides: number;
    listeAliments: string[];
    listeAllergènes: string[];
    disponible: boolean;
}

interface MealCardProps {
    meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const {
        label,
        calories,
        Proteines,
        Glucides,
        Lipides,
        listeAliments,
        listeAllergènes,
        disponible,
    } = meal;

    return (
        <div className="meal-card">
            {/* En-tête de la Card : Nom du menu & Statut de disponibilité */}
            <div className="meal-card__header">
                <h3 className="meal-card__label">{label}</h3>
                <span
                    className={`meal-card__status-pill ${disponible ? 'status--optimal' : 'status--danger'
                        }`}
                >
                    <span className="status-dot">●</span>
                    {disponible ? 'Disponible' : 'Indisponible'}
                </span>
            </div>

            {/* Grille des Valeurs Nutritionnelles */}
            <div className="meal-card__metrics-grid">
                <div className="metric-box">
                    <div className="metric-box__info">
                        <span className="metric-box__label">Calories</span>
                        <span className="metric-box__value">{calories} kcal</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-box__info">
                        <span className="metric-box__label">Protéines</span>
                        <span className="metric-box__value">{Proteines} g</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-box__info">
                        <span className="metric-box__label">Glucides</span>
                        <span className="metric-box__value">{Glucides} g</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-box__info">
                        <span className="metric-box__label">Lipides</span>
                        <span className="metric-box__value">{Lipides} g</span>
                    </div>
                </div>
            </div>

            {/* Composition du menu */}
            <div className="meal-card__section">
                <span className="meal-card__section-title">Composition</span>
                <div className="meal-card__tags">
                    {listeAliments.map((aliment) => (
                        <span key={aliment} className="meal-tag">
                            {aliment}
                        </span>
                    ))}
                </div>
            </div>

            {/* Allergènes présents dans le menu */}
            {listeAllergènes.length > 0 && (
                <div className="meal-card__section">
                    <span className="meal-card__section-title">Allergènes</span>
                    <div className="meal-card__tags">
                        {listeAllergènes.map((allergene) => (
                            <span key={allergene} className="meal-tag meal-tag--allergene">
                                {allergene}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealCard;