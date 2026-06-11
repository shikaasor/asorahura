"use client";

import { QuestionCard } from "./QuestionCard";
import { SECTORS, isValidSector, type Sector } from "@/lib/assessment";

interface Props {
  selectedSector?: Sector;
  onSelect: (sector: Sector) => void;
}

/**
 * Sector router rendered as the first step of both assessment shells.
 * Reuses QuestionCard's UI so it visually matches the rest of the flow.
 */
export function SectorPicker({ selectedSector, onSelect }: Props) {
  return (
    <QuestionCard
      question={{ id: 0, text: "Which sector best describes your organisation?" }}
      options={[...SECTORS]}
      selectedAnswer={selectedSector}
      onAnswer={(answer) => {
        if (isValidSector(answer)) onSelect(answer);
      }}
    />
  );
}
