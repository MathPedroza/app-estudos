/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredGoals, 
  addGoal, 
  updateGoal, 
  deleteGoal, 
  calculateGoalStats, 
  loadSampleGoals 
} from './services/storageService';
import { Goal, GoalFormData, GoalStatus } from './types/goal';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { FilterBar } from './components/FilterBar';
import { GoalList } from './components/GoalList';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Check, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // Estados de busca, filtros e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('deadline_asc');

  // Notificação toast de feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  // Carregar dados iniciais do localStorage
  useEffect(() => {
    const stored = getStoredGoals();
    setGoals(stored);
    setIsLoaded(true);
  }, []);

  // Estatísticas calculadas
  const stats = useMemo(() => calculateGoalStats(goals), [goals]);

  // Lista filtrada e ordenada
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (statusFilter !== 'todos' && goal.status !== statusFilter) {
          return false;
        }

        // Filtro por texto de pesquisa (título e descrição)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchesTitle = goal.title.toLowerCase().includes(query);
          const matchesDesc = goal.description.toLowerCase().includes(query);
          return matchesTitle || matchesDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline_asc') {
          return (a.deadline || '').localeCompare(b.deadline || '');
        }
        if (sortBy === 'deadline_desc') {
          return (b.deadline || '').localeCompare(a.deadline || '');
        }
        if (sortBy === 'created_desc') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [goals, statusFilter, searchTerm, sortBy]);

  // Abertura de modal para criar
  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  // Abertura de modal para editar
  const handleOpenEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  // Submissão do formulário (Criar ou Atualizar)
  const handleSubmitGoalForm = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const newGoal = addGoal(formData);
      setGoals((prev) => [newGoal, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Mudança rápida de status direta pelo card
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      const statusLabels: Record<GoalStatus, string> = {
        nao_iniciado: 'Não iniciado',
        em_andamento: 'Em andamento',
        concluido: 'Concluído',
      };
      showToast(`Status alterado para "${statusLabels[newStatus]}".`);
    }
  };

  // Pedir confirmação para excluir
  const handleRequestDelete = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  // Confirmar exclusão após modal
  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const success = deleteGoal(goalToDelete.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast(`Objetivo "${goalToDelete.title}" excluído.`);
    }

    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  // Carregar exemplos de objetivos
  const handleLoadSamples = () => {
    const loaded = loadSampleGoals();
    setGoals(loaded);
    showToast('Exemplos práticos carregados no seu StudyFlow!');
  };

  // Limpar filtros de busca
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Carregando StudyFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        onOpenNewGoalModal={handleOpenCreateModal}
        onLoadSamples={handleLoadSamples}
        hasGoals={goals.length > 0}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Painel de Estatísticas e Total de Objetivos Cadastrados */}
        {goals.length > 0 && (
          <StatsSummary
            stats={stats}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {goals.length > 0 && (
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            filteredCount={filteredAndSortedGoals.length}
            totalCount={goals.length}
          />
        )}

        {/* Listagem de Objetivos em Cartões ou Empty State */}
        <GoalList
          goals={filteredAndSortedGoals}
          allGoalsCount={goals.length}
          searchTerm={searchTerm}
          selectedFilter={statusFilter}
          onEdit={handleOpenEditModal}
          onRequestDelete={handleRequestDelete}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
          onLoadSamples={handleLoadSamples}
          onClearFilters={handleClearFilters}
        />
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">StudyFlow</span>
            <span>— Seu espaço para organizar o que deseja aprender.</span>
          </div>
          <p className="text-slate-400">
            Dados salvos automaticamente no navegador (sem necessidade de cadastro).
          </p>
        </div>
      </footer>

      {/* Modal de Cadastro e Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitGoalForm}
        goalToEdit={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Objetivo de Estudo"
        message="Tem certeza de que deseja remover este objetivo de estudo? Ele será apagado do seu histórico."
        targetName={goalToDelete?.title}
        confirmLabel="Sim, excluir objetivo"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
