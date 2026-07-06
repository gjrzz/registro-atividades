import { useState, useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import type { Ticket } from '../types';
import type { Template } from '../hooks/useTemplates';

interface TicketFormProps {
  ticketTypes: string[];
  reporters: string[];
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  editingTicket: Ticket | null;
  onCancelEdit: () => void;
  onSaveTemplate: (ticketType: string, template: Template) => void;
  getTemplate: (ticketType: string) => Template | null;
  hasTemplate: (ticketType: string) => boolean;
  onRemoveTemplate: (ticketType: string) => void;
  showToast: (message: string) => void;
}

const EMPTY_FORM = {
  summary: '',
  description: '',
  reporter: '',
};

export function TicketForm({
  ticketTypes,
  reporters,
  onSubmit,
  editingTicket,
  onCancelEdit,
  onSaveTemplate,
  getTemplate,
  hasTemplate,
  onRemoveTemplate,
  showToast,
}: TicketFormProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [ticketType, setTicketType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTicket) {
      setForm({
        summary: editingTicket.summary,
        description: editingTicket.description,
        reporter: editingTicket.reporter,
      });
    }
  }, [editingTicket]);

  function handleTypeChange(type: string) {
    setTicketType(type);
    if (type) {
      const template = getTemplate(type);
      if (template) {
        setForm({
          summary: template.summary,
          description: template.description,
          reporter: template.reporter,
        });
      }
    }
  }

  function handleSaveTemplate() {
    if (!ticketType) return;
    onSaveTemplate(ticketType, {
      summary: form.summary,
      description: form.description,
      reporter: form.reporter,
    });
    showToast(`Modelo salvo para "${ticketType}"`);
  }

  function handleRemoveTemplate() {
    if (!ticketType) return;
    if (window.confirm(`Remover o modelo salvo para "${ticketType}"?`)) {
      onRemoveTemplate(ticketType);
      showToast(`Modelo removido para "${ticketType}"`);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.summary.trim()) {
      newErrors.summary = 'O resumo é obrigatório';
    }
    if (!form.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }
    if (!form.reporter) {
      newErrors.reporter = 'Selecione o reporter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      summary: form.summary.trim(),
      description: form.description.trim(),
      reporter: form.reporter,
    });

    setForm(EMPTY_FORM);
    setTicketType('');
    setErrors({});
    summaryRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="card">
      <div className="card-header">
        <h2 className="card-title">
          {editingTicket ? 'Editar Chamado' : 'Novo Chamado'}
        </h2>
      </div>

      <div className="card-body">
        <div className="form-group">
          <label className="form-label">Tipo do chamado</label>
          <div className="type-row">
            <select
              value={ticketType}
              onChange={e => handleTypeChange(e.target.value)}
              className="form-input form-select"
            >
              <option value="">Selecione um tipo (opcional)</option>
              {ticketTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {ticketType && (
              <div className="type-actions">
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="btn btn-template"
                >
                  Salvar modelo
                </button>
                {hasTemplate(ticketType) && (
                  <button
                    type="button"
                    onClick={handleRemoveTemplate}
                    className="btn-inline btn-inline--delete"
                  >
                    Remover modelo
                  </button>
                )}
              </div>
            )}
          </div>
          {ticketType && hasTemplate(ticketType) && (
            <p className="form-hint-inline">Modelo salvo — campos preenchidos automaticamente</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Summary <span className="form-required">*</span>
            </label>
            <input
              ref={summaryRef}
              type="text"
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              className={`form-input ${errors.summary ? 'form-input--error' : ''}`}
              placeholder="Título do chamado"
            />
            {errors.summary && <p className="form-error">{errors.summary}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Reporter <span className="form-required">*</span>
            </label>
            <select
              value={form.reporter}
              onChange={e => setForm(f => ({ ...f, reporter: e.target.value }))}
              className={`form-input form-select ${errors.reporter ? 'form-input--error' : ''}`}
            >
              <option value="">Selecione...</option>
              {reporters.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.reporter && <p className="form-error">{errors.reporter}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Description <span className="form-required">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
            placeholder="Descrição detalhada (aceita múltiplas linhas)"
          />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>
      </div>

      <div className="card-footer">
        <button type="submit" className="btn btn-primary">
          {editingTicket ? 'Salvar alterações' : 'Adicionar chamado'}
        </button>
        {editingTicket && (
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
              setForm(EMPTY_FORM);
              setTicketType('');
              setErrors({});
            }}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        )}
        <span className="form-hint">Ctrl+Enter para adicionar</span>
      </div>
    </form>
  );
}
