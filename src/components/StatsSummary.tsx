import React from 'react';
import { Target, CheckCircle2, Clock, Hourglass } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface StatsSummaryProps {
  stats: GoalStats;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  stats,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
              Painel Geral
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              {stats.total === 1 ? '1 objetivo registrado' : `${stats.total} objetivos registrados`}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Resumo de Aprendizagem
          </h2>
        </div>

        {/* Barra de Progresso de Conclusão */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[240px]">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Progresso Geral</span>
            <span className="text-indigo-600 font-bold">{stats.taxaConclusao}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.taxaConclusao}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 text-right">
            {stats.concluidos} de {stats.total} concluídos
          </p>
        </div>
      </div>

      {/* Cartões de Contagem / Filtros Rápidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
        {/* Total */}
        <button
          onClick={() => onFilterChange('todos')}
          className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedFilter === 'todos'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/50'
              : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total cadastrados</p>
            <p className="text-xl font-extrabold text-slate-900">{stats.total}</p>
          </div>
        </button>

        {/* Não Iniciados */}
        <button
          onClick={() => onFilterChange('nao_iniciado')}
          className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedFilter === 'nao_iniciado'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200/50'
              : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Não iniciados</p>
            <p className="text-xl font-extrabold text-slate-900">{stats.naoIniciados}</p>
          </div>
        </button>

        {/* Em Andamento */}
        <button
          onClick={() => onFilterChange('em_andamento')}
          className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedFilter === 'em_andamento'
              ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-200/50'
              : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Em andamento</p>
            <p className="text-xl font-extrabold text-slate-900">{stats.emAndamento}</p>
          </div>
        </button>

        {/* Concluídos */}
        <button
          onClick={() => onFilterChange('concluido')}
          className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedFilter === 'concluido'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200/50'
              : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Concluídos</p>
            <p className="text-xl font-extrabold text-emerald-600">{stats.concluidos}</p>
          </div>
        </button>
      </div>
    </section>
  );
};
