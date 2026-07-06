interface CsvPreviewModalProps {
  content: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function CsvPreviewModal({ content, onConfirm, onClose }: CsvPreviewModalProps) {
  const displayContent = content.startsWith('\uFEFF') ? content.slice(1) : content;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Preview do CSV</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="modal-body">
          <pre className="csv-preview">{displayContent}</pre>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            Baixar CSV
          </button>
        </div>
      </div>
    </div>
  );
}
