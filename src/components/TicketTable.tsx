import type { Ticket } from '../types';

interface TicketTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function TicketTable({ tickets, onEdit, onRemove, onClearAll }: TicketTableProps) {
  function handleRemove(id: string) {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      onRemove(id);
    }
  }

  function handleClearAll() {
    if (window.confirm('Tem certeza que deseja remover TODOS os chamados? Esta ação não pode ser desfeita.')) {
      onClearAll();
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Chamados registrados
          <span className="card-count">{tickets.length}</span>
        </h2>
        {tickets.length > 0 && (
          <button onClick={handleClearAll} className="btn btn-danger-text">
            Limpar tudo
          </button>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="card-empty">
          Nenhum chamado registrado. Adicione um acima.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Summary</th>
                <th>Reporter</th>
                <th className="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="td-summary" title={ticket.summary}>
                    {ticket.summary}
                  </td>
                  <td>{ticket.reporter}</td>
                  <td className="td-actions">
                    <button
                      onClick={() => onEdit(ticket)}
                      className="btn-inline btn-inline--edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemove(ticket.id)}
                      className="btn-inline btn-inline--delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
