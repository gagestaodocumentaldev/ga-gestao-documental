"use client";

import { StatusType } from "@/types/document-status";

interface Summary {
  expired: number;
  critical: number;
  warning: number;
  ok: number;
}

interface SummaryCardsProps {
  summary: Summary;
  activeStatus: StatusType | null;
  onStatusClick: (status: StatusType | null) => void;
}

const cards = [
  {
    key: "expired" as StatusType,
    label: "Vencidos",
    description: "Documentos já expirados",
    bgIcon: "bg-red-100",
    textIcon: "text-red-500",
    icon: "pi pi-times-circle",
    countColor: "text-red-600",
    highlightClass: "border-red-400",
  },
  {
    key: "critical" as StatusType,
    label: "Críticos",
    description: "Vencem em até 30 dias",
    bgIcon: "bg-orange-100",
    textIcon: "text-orange-500",
    icon: "pi pi-exclamation-circle",
    countColor: "text-orange-600",
    highlightClass: "border-orange-400",
  },
  {
    key: "warning" as StatusType,
    label: "A vencer",
    description: "Vencem em até 90 dias",
    bgIcon: "bg-yellow-100",
    textIcon: "text-yellow-500",
    icon: "pi pi-calendar",
    countColor: "text-yellow-600",
    highlightClass: "border-yellow-400",
  },
  {
    key: "ok" as StatusType,
    label: "Válidos",
    description: "Dentro do prazo",
    bgIcon: "bg-green-100",
    textIcon: "text-green-500",
    icon: "pi pi-check-circle",
    countColor: "text-green-600",
    highlightClass: "border-green-400",
  },
];

export default function SummaryCards({
  summary,
  activeStatus,
  onStatusClick,
}: SummaryCardsProps) {
  function handleClick(key: StatusType) {
    onStatusClick(activeStatus === key ? null : key);
  }

  return (
    <div className="grid mb-3">
      {cards.map((card) => {
        const isActive = activeStatus === card.key;
        const count = summary[card.key as keyof Summary];

        return (
          <div key={card.key} className="col-12 lg:col-6 xl:col-3">
            <div
              className={`card mb-0 cursor-pointer transition-all border-2 ${
                isActive ? card.highlightClass : "border-transparent"
              }`}
              style={{ opacity: isActive ? 1 : 0.9 }}
              onClick={() => handleClick(card.key)}
            >
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    {card.label}
                  </span>
                  <div className={`font-medium text-xl ${card.countColor}`}>
                    {count}
                  </div>
                </div>
                <div
                  className={`flex align-items-center justify-content-center ${card.bgIcon} border-round`}
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className={`${card.icon} ${card.textIcon} text-xl`} />
                </div>
              </div>
              <span className="text-500 text-sm">{card.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
