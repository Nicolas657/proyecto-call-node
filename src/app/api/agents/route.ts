// src/app/api/agents/route.ts

import { NextResponse } from 'next/server';
import { Agent } from '@/types/agent'; // Asegúrate de que Agent ya incluye TransferTarget

// Datos de prueba actualizados con los destinos de transferencia.
const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Athena',
    team: 'Éxito Estudiantil',
    status: 'Operativo',
    metrics: { outboundCalls: 1250, transfers: 52, avgHandleTime: 180 },
    jira: { openIssues: 2, backlog: 5 },
    transferTargets: [
      { name: 'Soporte Académico', number: '+1 (800) 555-0101' },
      { name: 'Bienestar Estudiantil', number: '+1 (800) 555-0102' },
    ],
  },
  {
    id: 'agent-002',
    name: 'Helios',
    team: 'Gestión de Matrícula',
    status: 'Operativo',
    metrics: { outboundCalls: 980, transfers: 30, avgHandleTime: 150 },
    jira: { openIssues: 1, backlog: 3 },
    transferTargets: [
      { name: 'Admisiones LATAM', number: '+57 601 345 6789' },
      { name: 'Admisiones México', number: '+52 55 1234 5678' },
    ],
  },
  {
    id: 'agent-003',
    name: 'Orion',
    team: 'Éxito Estudiantil',
    status: 'Advertencia',
    metrics: { outboundCalls: 1500, transfers: 180, avgHandleTime: 240 },
    jira: { openIssues: 8, backlog: 12 },
    transferTargets: [
      { name: 'Soporte Técnico Nivel 1', number: '+1 (888) 555-0103' },
    ],
  },
  {
    id: 'agent-004',
    name: 'Cygnus',
    team: 'Gestión de Matrícula',
    status: 'Crítico',
    metrics: { outboundCalls: 200, transfers: 95, avgHandleTime: 300 },
    jira: { openIssues: 15, backlog: 25 },
    // Este agente no tiene destinos fijos, por eso el array está vacío.
    transferTargets: [],
  },
];

export async function GET() {
  // Simulamos una demora de red para ver el estado de carga
  await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(mockAgents);
}