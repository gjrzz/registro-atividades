import { useState, useEffect, useCallback } from 'react';

export interface Template {
  summary: string;
  description: string;
  reporter: string;
}

export type TemplateMap = Record<string, Template>;

const STORAGE_KEY = 'registro-atividades-templates';

function loadTemplates(): TemplateMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateMap>(loadTemplates);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const saveTemplate = useCallback((ticketType: string, template: Template) => {
    setTemplates(prev => ({ ...prev, [ticketType]: template }));
  }, []);

  const removeTemplate = useCallback((ticketType: string) => {
    setTemplates(prev => {
      const next = { ...prev };
      delete next[ticketType];
      return next;
    });
  }, []);

  const getTemplate = useCallback((ticketType: string): Template | null => {
    return templates[ticketType] ?? null;
  }, [templates]);

  const hasTemplate = useCallback((ticketType: string): boolean => {
    return ticketType in templates;
  }, [templates]);

  return { templates, saveTemplate, removeTemplate, getTemplate, hasTemplate };
}
