import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OperatorRegion } from "@/types";

interface OperatorRegionFilterProps {
  selectedRegion: OperatorRegion | "all";
  onRegionChange: (region: OperatorRegion | "all") => void;
}

export function OperatorRegionFilter({ selectedRegion, onRegionChange }: OperatorRegionFilterProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="region-filter">Région de l'opérateur</Label>
      <Select
        value={selectedRegion}
        onValueChange={(value) => onRegionChange(value as OperatorRegion | "all")}
      >
        <SelectTrigger id="region-filter" className="w-[180px]">
          <SelectValue placeholder="Toutes les régions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les régions</SelectItem>
          <SelectItem value={OperatorRegion.KINSHASA}>
            Kinshasa
          </SelectItem>
          <SelectItem value={OperatorRegion.DUBAI}>
            Dubaï
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}