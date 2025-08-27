// src/types/agent.ts

// NUEVO TIPO: Define cómo se ve un destino de transferencia
export type TransferTarget = {
  name: string;      // Ej: "Soporte LATAM"
  number: string;    // Ej: "+57 601 1234567"
};

export type Agent = {
  id: string;
  name: string;
  team: 'Éxito Estudiantil' | 'Gestión de Matrícula';
  status: 'Operativo' | 'Advertencia' | 'Crítico';
  metrics: {
    outboundCalls: number;
    transfers: number;
    avgHandleTime: number; // en segundos
  };
  jira: {
    openIssues: number;
    backlog: number;
  };
  // NUEVA PROPIEDAD: Un array de destinos de transferencia
  transferTargets: TransferTarget[];
};