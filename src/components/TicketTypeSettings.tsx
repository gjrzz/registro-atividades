import { useState } from 'react';
import type { FormEvent } from 'react';

interface TicketTypeSettingsProps {
  ticketTypes: string[];
  onAdd: (type: string) => void;
  onRemove: (type: string) => void;
  onUpdate: (oldType: string, newType: string) => void;
  onClose: () => void;
}

export function TicketTypeSettings({ ticketTypes, onAdd, onRemove, onUpdate, onClose }: TicketTypeSettingsProps) {
  const [newType, setNewType] = useState('');
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (newType.trim()) {
      onAdd(newType.trim());
      setNewType('');
    }
  }

  function startEdit(type: string) {
    setEditingType(type);
    setEditValue(type);
  }

  function saveEdit() {
    if (editingType && editValue.trim()) {
      onUpdate(editingType, editValue.trim());
      setEditingType(null);
      setEditValue('');
    }
  }

  function handleRemove(type: string) {
    if (window.confirm(`Remover "${type}"?`)) {
      onRemove(type);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configurar Tipos de Chamado</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleAdd} className="settings-add-form">
            <input
              type="text"
              value={newType}
              onChange={e => setNewType(e.target.value)}
              placeholder="Novo tipo de chamado"
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </form>

          <ul className="settings-list">
            {ticketTypes.map(type => (
              <li key={type} className="settings-item">
                {editingType === type ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit()}
                      className="form-input"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="btn-inline btn-inline--edit">
                      Salvar
                    </button>
                    <button onClick={() => setEditingType(null)} className="btn-inline">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="settings-item-label">{type}</span>
                    <button onClick={() => startEdit(type)} className="btn-inline btn-inline--edit">
                      Editar
                    </button>
                    <button onClick={() => handleRemove(type)} className="btn-inline btn-inline--delete">
                      Remover
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
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
