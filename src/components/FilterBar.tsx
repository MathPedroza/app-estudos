import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { GoalStatus } from '../types/goal';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 px-1 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filtros de Status (Tabs) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onStatusFilterChange('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onStatusFilterChange('nao_iniciado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'nao_iniciado'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/70 bg-amber-50'
            }`}
          >
            Não iniciados
          </button>
          <button
            onClick={() => onStatusFilterChange('em_andamento')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'em_andamento'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-700 hover:bg-sky-100/70 bg-sky-50'
            }`}
          >
            Em andamento
          </button>
          <button
            onClick={() => onStatusFilterChange('concluido')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'concluido'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100/70 bg-emerald-50'
            }`}
          >
            Concluídos
          </button>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="deadline_asc">Prazo: Mais próximo primeiro</option>
            <option value="deadline_desc">Prazo: Mais distante primeiro</option>
            <option value="created_desc">Mais recentes primeiro</option>
            <option value="title_asc">Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Indicador de resultados filtrados */}
      {(searchTerm || statusFilter !== 'todos') && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> objetivos
          </span>
          <button
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('todos');
            }}
            className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
