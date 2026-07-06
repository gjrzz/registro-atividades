import { describe, it, expect } from 'vitest';
import { escapeCsvField, generateCsv } from './csv';
import type { Ticket } from '../types';

describe('escapeCsvField', () => {
  it('retorna campo simples sem alteração', () => {
    expect(escapeCsvField('Hello World')).toBe('Hello World');
  });

  it('escapa campo com vírgula', () => {
    expect(escapeCsvField('valor1, valor2')).toBe('"valor1, valor2"');
  });

  it('escapa campo com aspas duplas', () => {
    expect(escapeCsvField('João "JS" Silva')).toBe('"João ""JS"" Silva"');
  });

  it('escapa campo com quebra de linha', () => {
    expect(escapeCsvField('linha1\nlinha2')).toBe('"linha1\nlinha2"');
  });

  it('escapa campo com vírgula e aspas', () => {
    expect(escapeCsvField('Solicito instalação do .NET 10. Usuário: João "JS" Silva, Financeiro'))
      .toBe('"Solicito instalação do .NET 10. Usuário: João ""JS"" Silva, Financeiro"');
  });

  it('retorna string vazia para campo vazio', () => {
    expect(escapeCsvField('')).toBe('');
  });

  it('preserva acentuação sem alteração quando não precisa de aspas', () => {
    expect(escapeCsvField('Solicitação de acesso')).toBe('Solicitação de acesso');
  });

  it('preserva acentuação com aspas quando necessário', () => {
    expect(escapeCsvField('Criação, atualização')).toBe('"Criação, atualização"');
  });
});

describe('generateCsv', () => {
  it('inclui BOM UTF-8 no início do output', () => {
    const csv = generateCsv([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('gera cabeçalho correto com 3 colunas', () => {
    const csv = generateCsv([]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('\uFEFFSummary,Description,Reporter');
  });

  it('gera linha de dados corretamente', () => {
    const ticket: Ticket = {
      id: '1',
      summary: 'Instalar VS Code',
      description: 'Preciso do VS Code instalado',
      reporter: 'joao@empresa.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    const csv = generateCsv([ticket]);
    const lines = csv.split('\n');
    expect(lines[1]).toBe('Instalar VS Code,Preciso do VS Code instalado,joao@empresa.com');
  });

  it('escapa description com quebra de linha preservando-a', () => {
    const ticket: Ticket = {
      id: '2',
      summary: 'Teste',
      description: 'Linha 1\nLinha 2\nLinha 3',
      reporter: 'maria@empresa.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    const csv = generateCsv([ticket]);
    expect(csv).toContain('"Linha 1\nLinha 2\nLinha 3"');
  });

  it('escapa campos com caracteres especiais corretamente', () => {
    const ticket: Ticket = {
      id: '3',
      summary: 'Solicitar acesso, urgente',
      description: 'Usuário: João "Admin" Silva',
      reporter: 'teste@empresa.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    const csv = generateCsv([ticket]);
    expect(csv).toContain('"Solicitar acesso, urgente"');
    expect(csv).toContain('"Usuário: João ""Admin"" Silva"');
  });
});
