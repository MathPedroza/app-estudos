import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, Clock, Hourglass, AlertCircle } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const isEditing = Boolean(goalToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description);
      setDeadline(goalToEdit.deadline);
      setStatus(goalToEdit.status);
      setErrors({});
    } else {
      // Valor padrão para novo objetivo: data de hoje + 7 dias
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const formattedDate = defaultDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setDeadline(formattedDate);
      setStatus('nao_iniciado');
      setErrors({});
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const setShortcutDeadline = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    setDeadline(target.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione um prazo de conclusão.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize os dados e o ritmo do seu plano de aprendizado'
                : 'Defina o que você quer aprender e estabeleça um prazo claro'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-sm font-semibold text-slate-800 mb-1">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Dominar funções em JavaScript ou Ler capítulo de História"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 bg-white'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="goal-description" className="block text-sm font-semibold text-slate-800">
                Descrição e anotações <span className="text-slate-400 text-xs font-normal">(opcional)</span>
              </label>
              <span className="text-[11px] text-slate-400">{description.length}/300 caracteres</span>
            </div>
            <textarea
              id="goal-description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhe o que você precisa fazer, links de aulas, listas de exercícios ou passos práticos..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <label htmlFor="goal-deadline" className="block text-sm font-semibold text-slate-800 mb-1">
              Prazo de conclusão <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition-all ${
                  errors.deadline
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.deadline}
              </p>
            )}

            {/* Atalhos rápidos de prazo */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Atalhos:
              </span>
              <button
                type="button"
                onClick={() => setShortcutDeadline(0)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setShortcutDeadline(3)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Em 3 dias
              </button>
              <button
                type="button"
                onClick={() => setShortcutDeadline(7)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Em 1 semana
              </button>
              <button
                type="button"
                onClick={() => setShortcutDeadline(30)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Em 1 mês
              </button>
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Status inicial do objetivo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Não Iniciado */}
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                  status === 'nao_iniciado'
                    ? 'bg-amber-50/80 border-amber-300 text-amber-900 ring-2 ring-amber-200/50'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="nao_iniciado"
                  checked={status === 'nao_iniciado'}
                  onChange={() => setStatus('nao_iniciado')}
                  className="sr-only"
                />
                <Clock className={`w-4 h-4 shrink-0 ${status === 'nao_iniciado' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>Não iniciado</span>
              </label>

              {/* Em Andamento */}
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                  status === 'em_andamento'
                    ? 'bg-sky-50/80 border-sky-300 text-sky-900 ring-2 ring-sky-200/50'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="em_andamento"
                  checked={status === 'em_andamento'}
                  onChange={() => setStatus('em_andamento')}
                  className="sr-only"
                />
                <Hourglass className={`w-4 h-4 shrink-0 ${status === 'em_andamento' ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>Em andamento</span>
              </label>

              {/* Concluído */}
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                  status === 'concluido'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 ring-2 ring-emerald-200/50'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="concluido"
                  checked={status === 'concluido'}
                  onChange={() => setStatus('concluido')}
                  className="sr-only"
                />
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${status === 'concluido' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Concluído</span>
              </label>
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer"
            >
              {isEditing ? 'Atualizar Objetivo' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
