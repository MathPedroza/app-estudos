import React from 'react';
import { Plus, Sparkles, SearchX, Compass } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-goals-at-all' | 'no-filtered-results';
  searchTerm?: string;
  selectedFilter?: string;
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchTerm,
  selectedFilter,
  onOpenCreateModal,
  onLoadSamples,
  onClearFilters,
}) => {
  if (type === 'no-filtered-results') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {searchTerm
            ? `Não encontramos nenhum objetivo correspondente a "${searchTerm}".`
            : 'Não há objetivos cadastrados para o filtro selecionado no momento.'}
        </p>
        <div className="mt-5">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
          >
            Limpar busca e filtros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-2xl border border-dashed border-indigo-200 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
        <Compass className="w-8 h-8 stroke-[2]" />
      </div>

      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
        Seja bem-vindo ao StudyFlow
      </span>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 tracking-tight">
        Qual é o seu primeiro objetivo de estudo?
      </h3>

      <p className="text-sm text-slate-600 mt-2.5 max-w-md mx-auto leading-relaxed">
        Grandes conquistas começam com metas simples e bem organizadas. Cadastre o que você quer estudar agora, defina um prazo e dê o primeiro passo!
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Meu Primeiro Objetivo</span>
        </button>

        <button
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Carregar Exemplos de Estudo</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-3 bg-white/70 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-800">1. Defina um Título</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Seja específico no que aprenderá.</p>
        </div>
        <div className="p-3 bg-white/70 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-800">2. Estabeleça o Prazo</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Crie um compromisso com você mesmo.</p>
        </div>
        <div className="p-3 bg-white/70 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-800">3. Acompanhe o Ritmo</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Mude o status conforme avança.</p>
        </div>
      </div>
    </div>
  );
};
