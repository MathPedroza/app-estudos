import React from 'react';
import { Goal, GoalStatus } from '../types/goal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';

interface GoalListProps {
  goals: Goal[];
  allGoalsCount: number;
  searchTerm: string;
  selectedFilter: string;
  onEdit: (goal: Goal) => void;
  onRequestDelete: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
  onClearFilters: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  allGoalsCount,
  searchTerm,
  selectedFilter,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onOpenCreateModal,
  onLoadSamples,
  onClearFilters,
}) => {
  // Se não há objetivos cadastrados no app no total
  if (allGoalsCount === 0) {
    return (
      <EmptyState
        type="no-goals-at-all"
        onOpenCreateModal={onOpenCreateModal}
        onLoadSamples={onLoadSamples}
        onClearFilters={onClearFilters}
      />
    );
  }

  // Se há objetivos no total, mas nenhum corresponde ao filtro/busca
  if (goals.length === 0) {
    return (
      <EmptyState
        type="no-filtered-results"
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
        onOpenCreateModal={onOpenCreateModal}
        onLoadSamples={onLoadSamples}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onRequestDelete={onRequestDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
