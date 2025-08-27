// src/components/TransferTargets.tsx
import { TransferTarget } from "@/types/agent";
import { PhoneForwarded } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TransferTargetsProps {
  targets: TransferTarget[];
}

export function TransferTargets({ targets }: TransferTargetsProps) {
  // Si no hay destinos, no renderizamos nada para mantener la tarjeta limpia.
  if (!targets || targets.length === 0) {
    return null;
  }

  return (
    <div>
      <Separator className="my-4" />
      <h4 className="text-sm font-medium text-gray-500 mb-2">Destinos de Transferencia</h4>
      <div className="space-y-2 text-sm">
        {targets.map((target) => (
          <div key={target.name} className="flex items-center justify-between">
            <span className="flex items-center">
              <PhoneForwarded className="w-4 h-4 mr-2 text-gray-400" />
              {target.name}:
            </span>
            <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
              {target.number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}