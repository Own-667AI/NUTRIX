import { useState } from 'react';
import './Journal.css';

// Menus disponibles dans la station NUTRIX
const MENUS_DISPONIBLES = [
  { id: 1, label: 'Menu A — Poulet grillé, riz complet, épinards' },
  { id: 2, label: 'Menu B — Tofu sauté, quinoa, carottes glacées' },
  { id: 3, label: 'Menu C — Boeuf séché, pâtes complètes, haricots verts' },
  { id: 4, label: 'Menu D — Omelette protéinée, pommes de terre, salade' },
  { id: 5, label: 'Menu E — Soupe de légumes, pain complet, fromage' },
  { id: 6, label: 'Menu F — Riz au lait, fruits secs, compote' },
];

// Occupants de la station
const OCCUPANTS = [
  { id: 1, nom: 'Claire Dubois' },
  { id: 2, nom: 'Thomas Moreau' },
  { id: 3, nom: 'Élodie Bertrand' },
  { id: 4, nom: 'Marc Laurent' },
  { id: 5, nom: 'Sophie Benali' },
  { id: 6, nom: 'Antoine Garcia' },
];

interface JournalEntry {
  id: number;
  occupant: string;
  menu: string;
  date: string;
  notes: string;
}

// Historique initial réaliste
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 1,
    occupant: 'Claire Dubois',
    menu: 'Menu A — Poulet grillé, riz complet, épinards',
    date: '2026-09-23 12:30',
    notes: 'Portion complète, bon appétit.',
  },
  {
    id: 2,
    occupant: 'Thomas Moreau',
    menu: 'Menu F — Riz au lait, fruits secs, compote',
    date: '2026-09-23 07:15',
    notes: '',
  },
  {
    id: 3,
    occupant: 'Élodie Bertrand',
    menu: 'Menu E — Soupe de légumes, pain complet, fromage',
    date: '2026-09-22 19:45',
    notes: 'A demandé une portion réduite.',
  },
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [selectedOccupant, setSelectedOccupant] = useState('');
  const [selectedTypeRepas, setSelectedTypeRepas] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState('');

  const isFormValid = selectedOccupant && selectedTypeRepas && selectedMenu && selectedDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newEntry: JournalEntry = {
      id: Date.now(),
      occupant: selectedOccupant,
      menu: selectedMenu,
      date: selectedDate.replace('T', ' '),
      notes: notes,
    };

    setEntries([newEntry, ...entries]);
    setShowSuccess(true);

    // Reset form
    setSelectedOccupant('');
    setSelectedTypeRepas('');
    setSelectedMenu('');
    setSelectedDate('');
    setNotes('');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="journal-page">
      {/* En-tête */}
      <div className="journal-page__header">
        <div>
          <h2 className="journal-page__title">Journal Alimentaire</h2>
          <p className="journal-page__subtitle">
            Saisie des repas consommés et suivi de la consommation réelle de l'équipage
          </p>
        </div>
      </div>

      {/* Contenu : formulaire + historique */}
      <div className="journal-page__content">
        {/* Formulaire */}
        <form className="journal-form" onSubmit={handleSubmit}>
          <h3 className="journal-form__title">Nouvelle entrée</h3>

          {showSuccess && (
            <div className="journal-form__success">
              Entrée enregistrée avec succes.
            </div>
          )}

          <div className="journal-form__row">
            <div className="journal-form__group">
              <label className="journal-form__label" htmlFor="journal-occupant">
                Occupant
              </label>
              <select
                id="journal-occupant"
                className="journal-form__select"
                value={selectedOccupant}
                onChange={(e) => setSelectedOccupant(e.target.value)}
              >
                <option value="">Sélectionner un occupant</option>
                {OCCUPANTS.map((occ) => (
                  <option key={occ.id} value={occ.nom}>
                    {occ.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="journal-form__group">
            <label className="journal-form__label" htmlFor="journal-menu">
              Menu servi
            </label>
            <span className="journal-form__hint">
              Sélectionnez parmi les menus planifiés pour cette période
            </span>
            <select
              id="journal-menu"
              className="journal-form__select"
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
            >
              <option value="">Choisir un menu</option>
              {MENUS_DISPONIBLES.map((menu) => (
                <option key={menu.id} value={menu.label}>
                  {menu.label}
                </option>
              ))}
            </select>
          </div>

          <div className="journal-form__group">
            <label className="journal-form__label" htmlFor="journal-date">
              Date et heure
            </label>
            <input
              id="journal-date"
              type="datetime-local"
              className="journal-form__input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="journal-form__submit"
            disabled={!isFormValid}
          >
            Enregistrer l'entrée
          </button>
        </form>

        {/* Historique */}
        <div className="journal-history">
          <h3 className="journal-history__title">Historique récent</h3>

          {entries.length > 0 ? (
            <div className="journal-history__list">
              {entries.map((entry) => (
                <div className="journal-entry" key={entry.id}>
                  <div className="journal-entry__header">
                    <span className="journal-entry__date">{entry.date}</span>
                  </div>
                  <span className="journal-entry__menu">{entry.menu}</span>
                  <span className="journal-entry__occupant">{entry.occupant}</span>
                  {entry.notes && (
                    <span className="journal-entry__notes">{entry.notes}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="journal-history__empty">
              Aucune entrée enregistrée pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
