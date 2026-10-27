import { Goal, GoalFormData, GoalStats } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

export const SAMPLE_GOALS: Goal[] = [
  {
    id: 'sample-1',
    title: 'Dominar Lógica de Programação Básica',
    description: 'Estudar condicionais, laços de repetição (for/while) e funções resolvendo 10 exercícios práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Leitura do Capítulo 3 de Biologia Celular',
    description: 'Fazer fichamento e mapa mental sobre organelas citoplasmáticas e respiração celular.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Vocabulário Essencial de Inglês: Rotina Diária',
    description: 'Aprender 30 verbos mais usados e criar 15 frases de exemplo contextualizadas.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Recupera todos os objetivos salvos no localStorage.
 */
export const getStoredGoals = (): Goal[] => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler objetivos do localStorage:', error);
    return [];
  }
};

/**
 * Salva a lista completa de objetivos no localStorage.
 */
export const saveStoredGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Erro ao salvar objetivos no localStorage:', error);
  }
};

/**
 * Cadastra um novo objetivo no topo da lista.
 */
export const addGoal = (data: GoalFormData): Goal => {
  const newGoal: Goal = {
    id: 'goal_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
    title: data.title.trim(),
    description: data.description.trim(),
    deadline: data.deadline,
    status: data.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const currentGoals = getStoredGoals();
  const updatedGoals = [newGoal, ...currentGoals];
  saveStoredGoals(updatedGoals);
  return newGoal;
};

/**
 * Atualiza um objetivo existente.
 */
export const updateGoal = (id: string, updates: Partial<GoalFormData>): Goal | null => {
  const currentGoals = getStoredGoals();
  const index = currentGoals.findIndex((g) => g.id === id);

  if (index === -1) {
    return null;
  }

  const updated: Goal = {
    ...currentGoals[index],
    ...(updates.title !== undefined ? { title: updates.title.trim() } : {}),
    ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
    ...(updates.deadline !== undefined ? { deadline: updates.deadline } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
    updatedAt: new Date().toISOString(),
  };

  currentGoals[index] = updated;
  saveStoredGoals(currentGoals);
  return updated;
};

/**
 * Remove um objetivo pelo ID.
 */
export const deleteGoal = (id: string): boolean => {
  const currentGoals = getStoredGoals();
  const filtered = currentGoals.filter((g) => g.id !== id);
  if (filtered.length !== currentGoals.length) {
    saveStoredGoals(filtered);
    return true;
  }
  return false;
};

/**
 * Calcula estatísticas dos objetivos.
 */
export const calculateGoalStats = (goals: Goal[]): GoalStats => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;
  const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return {
    total,
    naoIniciados,
    emAndamento,
    concluidos,
    taxaConclusao,
  };
};

/**
 * Carrega os exemplos didáticos no localStorage se o usuário desejar.
 */
export const loadSampleGoals = (): Goal[] => {
  saveStoredGoals(SAMPLE_GOALS);
  return SAMPLE_GOALS;
};
