import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'registro-atividades-reporters';

const DEFAULT_REPORTERS = [
  'gabriel.juarez@montebravo.com.br',
];

function loadReporters(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_REPORTERS;
  } catch {
    return DEFAULT_REPORTERS;
  }
}

export function useReporters() {
  const [reporters, setReporters] = useState<string[]>(loadReporters);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reporters));
  }, [reporters]);

  const addReporter = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && !reporters.includes(trimmed)) {
      setReporters(prev => [...prev, trimmed]);
    }
  }, [reporters]);

  const removeReporter = useCallback((email: string) => {
    setReporters(prev => prev.filter(r => r !== email));
  }, []);

  const updateReporter = useCallback((oldEmail: string, newEmail: string) => {
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed) {
      setReporters(prev => prev.map(r => (r === oldEmail ? trimmed : r)));
    }
  }, []);

  return { reporters, addReporter, removeReporter, updateReporter };
}
