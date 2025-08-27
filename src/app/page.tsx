// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Agent } from '@/types/agent';
import { AgentCard } from '@/components/AgentCard';
import { FilterPanel } from '@/components/FilterPanel';

// Helper para SWR. Le dice cómo obtener los datos de una URL.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [filters, setFilters] = useState({ team: 'all', status: 'all' });
  
  // Hook de SWR para obtener los datos de nuestra API
  const { data: agents, error, isLoading } = useSWR<Agent[]>('/api/agents', fetcher);

  // Función para actualizar los filtros de forma segura
  const handleFilterChange = (newFilter: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilter }));
  };

  // Usamos useMemo para que el filtrado solo se re-calcule si los agentes o los filtros cambian.
  // Esto es una optimización de rendimiento.
  const filteredAgents = useMemo(() => {
    if (!agents) return [];

    return agents.filter(agent => {
      const teamMatch = filters.team === 'all' || agent.team === filters.team;
      const statusMatch = filters.status === 'all' || agent.status === filters.status;
      return teamMatch && statusMatch;
    });
  }, [agents, filters]);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Centro de Mando de Agentes IA
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          Monitoriza el rendimiento y estado de tus agentes en tiempo real.
        </p>
      </header>

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {isLoading && <p className="text-center text-gray-500">Cargando agentes...</p>}
      {error && <p className="text-center text-red-500">Error al cargar los datos. Por favor, intenta de nuevo más tarde.</p>}

      {!isLoading && !error && (
        <>
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No se encontraron agentes</h3>
              <p className="text-gray-500 mt-2">Prueba a cambiar o reiniciar los filtros.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}