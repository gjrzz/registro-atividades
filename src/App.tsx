import { useState, useCallback } from 'react';
import { TicketForm } from './components/TicketForm';
import { TicketTable } from './components/TicketTable';
import { SettingsModal } from './components/SettingsModal';
import { CsvPreviewModal } from './components/CsvPreviewModal';
import { Toast } from './components/Toast';
import { useTickets } from './hooks/useTickets';
import { useTicketTypes } from './hooks/useTicketTypes';
import { useReporters } from './hooks/useReporters';
import { useTemplates } from './hooks/useTemplates';
import { generateCsv, downloadCsv } from './utils/csv';
import type { Ticket } from './types';

export default function App() {
  const { tickets, addTicket, updateTicket, removeTicket, clearAll } = useTickets();
  const { ticketTypes, addType, removeType, updateType } = useTicketTypes();
  const { reporters, addReporter, removeReporter, updateReporter } = useReporters();
  const { saveTemplate, removeTemplate, getTemplate, hasTemplate } = useTemplates();

  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  function handleSubmit(ticket: Omit<Ticket, 'id' | 'createdAt'>) {
    if (editingTicket) {
      updateTicket(editingTicket.id, ticket);
      setEditingTicket(null);
      showToast('Chamado atualizado com sucesso');
    } else {
      addTicket(ticket);
      showToast('Chamado adicionado com sucesso');
    }
  }

  function handleExport() {
    if (tickets.length === 0) return;
    const csv = generateCsv(tickets);
    setCsvPreview(csv);
  }

  function handleConfirmExport() {
    if (csvPreview) {
      downloadCsv(csvPreview);
      setCsvPreview(null);
      showToast('CSV exportado com sucesso');
    }
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="header-wordmark">montebravo</span>
            <span className="header-separator"></span>
            <span className="header-tool-name">Registro de Atividades</span>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-ghost"
            >
              Configurações
            </button>
            <button
              onClick={handleExport}
              disabled={tickets.length === 0}
              className="btn btn-primary-sm"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TicketForm
          ticketTypes={ticketTypes}
          reporters={reporters}
          onSubmit={handleSubmit}
          editingTicket={editingTicket}
          onCancelEdit={() => setEditingTicket(null)}
          onSaveTemplate={saveTemplate}
          getTemplate={getTemplate}
          hasTemplate={hasTemplate}
          onRemoveTemplate={removeTemplate}
          showToast={showToast}
        />

        <TicketTable
          tickets={tickets}
          onEdit={setEditingTicket}
          onRemove={removeTicket}
          onClearAll={clearAll}
        />
      </main>

      {showSettings && (
        <SettingsModal
          ticketTypes={ticketTypes}
          onAddType={addType}
          onRemoveType={removeType}
          onUpdateType={updateType}
          reporters={reporters}
          onAddReporter={addReporter}
          onRemoveReporter={removeReporter}
          onUpdateReporter={updateReporter}
          onClose={() => setShowSettings(false)}
        />
      )}

      {csvPreview && (
        <CsvPreviewModal
          content={csvPreview}
          onConfirm={handleConfirmExport}
          onClose={() => setCsvPreview(null)}
        />
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </div>
  );
}
