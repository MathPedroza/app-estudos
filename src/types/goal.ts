export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
  taxaConclusao: number;
}
