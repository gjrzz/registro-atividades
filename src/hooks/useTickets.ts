import { useState, useEffect, useCallback } from 'react';
import type { Ticket } from '../types';

const STORAGE_KEY = 'registro-atividades-tickets';

function loadTickets(): Ticket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Record<string, unknown>[];
    // Normaliza dados antigos que podem ter campos extras
    return parsed.map((item) => ({
      id: String(item.id ?? crypto.randomUUID()),
      summary: String(item.summary ?? ''),
      description: String(item.description ?? ''),
      reporter: String(item.reporter ?? ''),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = useCallback((ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => [...prev, newTicket]);
  }, []);

  const updateTicket = useCallback((id: string, ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, ...ticket } : t))
    );
  }, []);

  const removeTicket = useCallback((id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setTickets([]);
  }, []);

  return { tickets, addTicket, updateTicket, removeTicket, clearAll };
}
