// src/components/AgentCard.tsx

import { Agent } from "@/types/agent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneOutgoing, ArrowRightLeft, Clock, FileWarning, BookCopy } from "lucide-react";
import { TransferTargets } from "./TransferTargets"; // Importa el nuevo componente

// Estilos para cambiar el color del badge según el estado
const statusStyles = {
  Operativo: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  Advertencia: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  Crítico: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
};

// Estilos para el punto de color
const statusDotStyles = {
  Operativo: "bg-green-500",
  Advertencia: "bg-yellow-500",
  Crítico: "bg-red-500",
};

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="flex flex-col h-full"> {/* Clases para que todas las tarjetas tengan la misma altura */}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{agent.name}</CardTitle>
            <CardDescription>{agent.team}</CardDescription>
          </div>
          <Badge variant="outline" className={statusStyles[agent.status]}>
            <span className={`w-2 h-2 rounded-full mr-2 ${statusDotStyles[agent.status]}`}></span>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow"> {/* flex-grow para que el contenido ocupe el espacio disponible */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Métricas de Actividad</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center"><PhoneOutgoing className="w-4 h-4 mr-2" />Llamadas Salientes:</span>
              <span className="font-semibold">{agent.metrics.outboundCalls}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" />Transferencias:</span>
              <span className="font-semibold">{agent.metrics.transfers}</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />T. Promedio (seg):</span>
               <span className="font-semibold">{agent.metrics.avgHandleTime}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Issues Jira</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center"><FileWarning className="w-4 h-4 mr-2" />Issues Abiertos:</span>
              <Badge variant="secondary">{agent.jira.openIssues}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center"><BookCopy className="w-4 h-4 mr-2" />Backlog:</span>
              <Badge variant="secondary">{agent.jira.backlog}</Badge>
            </div>
          </div>
        </div>

        {/* Aquí es donde se añade el nuevo componente */}
        <TransferTargets targets={agent.transferTargets} />
        
      </CardContent>
    </Card>
  );
}