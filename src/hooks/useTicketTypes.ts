import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'registro-atividades-ticket-types';

const DEFAULT_TYPES = [
  'Onboarding',
  'Offboarding',
  'Instalar/Atualizar Software',
  'Hardware',
  'Criação de Usuário',
  'Criação de Banco de Dados',
  'Recursos AWS',
  'CI/CD & Deploy',
  'Outros',
];

function loadTypes(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TYPES;
  } catch {
    return DEFAULT_TYPES;
  }
}

export function useTicketTypes() {
  const [ticketTypes, setTicketTypes] = useState<string[]>(loadTypes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticketTypes));
  }, [ticketTypes]);

  const addType = useCallback((type: string) => {
    const trimmed = type.trim();
    if (trimmed && !ticketTypes.includes(trimmed)) {
      setTicketTypes(prev => [...prev, trimmed]);
    }
  }, [ticketTypes]);

  const removeType = useCallback((type: string) => {
    setTicketTypes(prev => prev.filter(t => t !== type));
  }, []);

  const updateType = useCallback((oldType: string, newType: string) => {
    const trimmed = newType.trim();
    if (trimmed) {
      setTicketTypes(prev => prev.map(t => (t === oldType ? trimmed : t)));
    }
  }, []);

  return { ticketTypes, addType, removeType, updateType };
}
