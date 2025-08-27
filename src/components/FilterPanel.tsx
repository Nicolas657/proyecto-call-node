// src/components/FilterPanel.tsx
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Filters {
  team: string;
  status: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleTeamChange = (value: string) => {
    onFilterChange({ team: value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border">
      <div className="flex-1">
        <Label htmlFor="team-filter" className="text-sm font-medium">Filtrar por Equipo</Label>
        <Select
          value={filters.team}
          onValueChange={handleTeamChange}
        >
          <SelectTrigger id="team-filter" className="mt-1">
            <SelectValue placeholder="Seleccionar equipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los equipos</SelectItem>
            <SelectItem value="Éxito Estudiantil">Éxito Estudiantil</SelectItem>
            <SelectItem value="Gestión de Matrícula">Gestión de Matrícula</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="status-filter" className="text-sm font-medium">Filtrar por Estado</Label>
        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status-filter" className="mt-1">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Operativo">Operativo</SelectItem>
            <SelectItem value="Advertencia">Advertencia</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}