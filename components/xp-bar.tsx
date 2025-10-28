"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

interface XpBarProps {
  currentXp?: number;
  maxXpPerLevel?: number;
  compact?: boolean;
}

export const XpBar = ({
  currentXp = 750,
  maxXpPerLevel = 1000,
  compact = false,
}: XpBarProps) => {
  const [level, setLevel] = useState(1);
  const [xpInLevel, setXpInLevel] = useState(currentXp);

  useEffect(() => {
    // Calculer le niveau basé sur l'XP total
    const calculatedLevel = Math.floor(currentXp / maxXpPerLevel) + 1;
    const xpInCurrentLevel = currentXp % maxXpPerLevel;
    setLevel(calculatedLevel);
    setXpInLevel(xpInCurrentLevel);
  }, [currentXp, maxXpPerLevel]);

  const xpPercentage = (xpInLevel / maxXpPerLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-bold text-gray-700">Lvl {level}</span>
          </div>
          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-0.5">
            {xpInLevel}/{maxXpPerLevel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Niveau {level}</span>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-600 whitespace-nowrap">
        {xpInLevel}/{maxXpPerLevel} XP
      </span>
    </div>
  );
};
