"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

function getRandomFruit(): string {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  // Check win condition directly in render
  const hasWon = () => {
    // Rows
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) return grid[r][0];
    }
    // Columns
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) return grid[0][c];
    }
    return null;
  };

  useEffect(() => {
    if (!spinning) {
      const winner = hasWon();
      setWin(winner);
    }
  }, [grid, spinning]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // Shift each column down
        for (let c = 0; c < 3; c++) {
          newGrid[2][c] = newGrid[1][c];
          newGrid[1][c] = newGrid[0][c];
          newGrid[0][c] = getRandomFruit();
        }
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            width={64}
            height={64}
            className="border rounded"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {win && (
        <div className="mt-4 text-green-600">
          <p>Congratulations! You won with {win}s!</p>
          <Share text={`I just won with ${win}s in the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
