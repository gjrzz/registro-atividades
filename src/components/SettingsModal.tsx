import { useState } from 'react';
import type { FormEvent } from 'react';

interface SettingsModalProps {
  ticketTypes: string[];
  onAddType: (type: string) => void;
  onRemoveType: (type: string) => void;
  onUpdateType: (oldType: string, newType: string) => void;
  reporters: string[];
  onAddReporter: (email: string) => void;
  onRemoveReporter: (email: string) => void;
  onUpdateReporter: (oldEmail: string, newEmail: string) => void;
  onClose: () => void;
}

type Tab = 'tipos' | 'reporters';

export function SettingsModal({
  ticketTypes,
  onAddType,
  onRemoveType,
  onUpdateType,
  reporters,
  onAddReporter,
  onRemoveReporter,
  onUpdateReporter,
  onClose,
}: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>('tipos');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configurações</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${tab === 'tipos' ? 'settings-tab--active' : ''}`}
            onClick={() => setTab('tipos')}
          >
            Tipos de Chamado
          </button>
          <button
            className={`settings-tab ${tab === 'reporters' ? 'settings-tab--active' : ''}`}
            onClick={() => setTab('reporters')}
          >
            Reporters
          </button>
        </div>

        <div className="modal-body">
          {tab === 'tipos' ? (
            <EditableList
              items={ticketTypes}
              onAdd={onAddType}
              onRemove={onRemoveType}
              onUpdate={onUpdateType}
              placeholder="Novo tipo de chamado"
              inputType="text"
            />
          ) : (
            <EditableList
              items={reporters}
              onAdd={onAddReporter}
              onRemove={onRemoveReporter}
              onUpdate={onUpdateReporter}
              placeholder="novo.reporter@empresa.com"
              inputType="email"
              validate={isValidEmail}
              errorMessage="Formato de e-mail inválido"
            />
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

interface EditableListProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  onUpdate: (oldItem: string, newItem: string) => void;
  placeholder: string;
  inputType: 'text' | 'email';
  validate?: (value: string) => boolean;
  errorMessage?: string;
}

function EditableList({ items, onAdd, onRemove, onUpdate, placeholder, inputType, validate, errorMessage }: EditableListProps) {
  const [newValue, setNewValue] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (validate && !validate(trimmed)) {
      setError(errorMessage || 'Valor inválido');
      return;
    }
    onAdd(trimmed);
    setNewValue('');
    setError('');
  }

  function startEdit(item: string) {
    setEditingItem(item);
    setEditValue(item);
  }

  function saveEdit() {
    if (editingItem && editValue.trim()) {
      if (validate && !validate(editValue.trim())) return;
      onUpdate(editingItem, editValue.trim());
      setEditingItem(null);
      setEditValue('');
    }
  }

  function handleRemove(item: string) {
    if (window.confirm(`Remover "${item}"?`)) {
      onRemove(item);
    }
  }

  return (
    <>
      <form onSubmit={handleAdd} className="settings-add-form">
        <input
          type={inputType}
          value={newValue}
          onChange={e => { setNewValue(e.target.value); setError(''); }}
          placeholder={placeholder}
          className="form-input"
        />
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>
      {error && <p className="form-error settings-error">{error}</p>}

      <ul className="settings-list">
        {items.map(item => (
          <li key={item} className="settings-item">
            {editingItem === item ? (
              <>
                <input
                  type={inputType}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  className="form-input"
                  autoFocus
                />
                <button onClick={saveEdit} className="btn-inline btn-inline--edit">
                  Salvar
                </button>
                <button onClick={() => setEditingItem(null)} className="btn-inline">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="settings-item-label">{item}</span>
                <button onClick={() => startEdit(item)} className="btn-inline btn-inline--edit">
                  Editar
                </button>
                <button onClick={() => handleRemove(item)} className="btn-inline btn-inline--delete">
                  Remover
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
