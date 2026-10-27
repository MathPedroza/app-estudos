import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoalModal: () => void;
  onLoadSamples: () => void;
  hasGoals: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewGoalModal,
  onLoadSamples,
  hasGoals,
}) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo e Título */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">StudyFlow</h1>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Iniciante
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Organize seus objetivos de estudo com clareza e ritmo
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {!hasGoals && (
            <button
              onClick={onLoadSamples}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Carregar exemplos para ver o aplicativo em funcionamento"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ver Exemplos</span>
            </button>
          )}

          <button
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-200 transition-all transform active:scale-98 cursor-pointer flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
