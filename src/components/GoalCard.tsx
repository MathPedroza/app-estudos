import React from 'react';
import { 
  Calendar, 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  Pencil, 
  Trash2, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Goal, GoalStatus } from '../types/goal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onRequestDelete: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onStatusChange,
}) => {
  // Configurações visuais por status
  const statusConfig: Record<
    GoalStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    nao_iniciado: {
      label: 'Não iniciado',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    em_andamento: {
      label: 'Em andamento',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200/80',
      icon: <Hourglass className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
    },
    concluido: {
      label: 'Concluído',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
  };

  const currentStatusInfo = statusConfig[goal.status];

  // Cálculo e formatação amigável do prazo
  const getDeadlineBadge = (deadlineStr: string, isCompleted: boolean) => {
    if (!deadlineStr) return null;

    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Formatação em pt-BR
    const formattedDate = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Prazo: {formattedDate}
        </span>
      );
    }

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          Atrasado ({formattedDate})
        </span>
      );
    }

    if (diffDays === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Vence hoje ({formattedDate})
        </span>
      );
    }

    if (diffDays === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          Vence amanhã ({formattedDate})
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        Vence em {diffDays} dias ({formattedDate})
      </span>
    );
  };

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        goal.status === 'concluido'
          ? 'border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Faixa superior com Status e Ações */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Badge de Status Atual */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${currentStatusInfo.bg} ${currentStatusInfo.text} ${currentStatusInfo.border}`}
          >
            {currentStatusInfo.icon}
            {currentStatusInfo.label}
          </span>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar este objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRequestDelete(goal)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir este objetivo"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 tracking-tight leading-snug ${
            goal.status === 'concluido' ? 'text-slate-700 line-through decoration-emerald-500/50' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        {goal.description ? (
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-2">Sem descrição adicional.</p>
        )}
      </div>

      {/* Faixa inferior: Prazo e Seletor Rápido de Status */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Prazo */}
        <div className="flex-1">
          {getDeadlineBadge(goal.deadline, goal.status === 'concluido')}
        </div>

        {/* Atalho de Mudança Rápida de Status */}
        <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
          <label htmlFor={`status-select-${goal.id}`} className="sr-only">
            Alterar status de {goal.title}
          </label>
          <select
            id={`status-select-${goal.id}`}
            value={goal.status}
            onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
          >
            <option value="nao_iniciado">Não iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>
    </article>
  );
};
