"use client";

import React, { useEffect, useState } from "react";

export const TypewriterEffectSmooth = ({
  words,
  className = "",
  cursorClassName = "",
  triggerKey,
  speed = 25, // typing speed in ms
  animate = true,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  triggerKey?: any;
  speed?: number;
  animate?: boolean;
}) => {
  const [visibleCharsCount, setVisibleCharsCount] = useState(animate ? 0 : 999999);

  // Combine words with spaces in between to get the full text length
  const fullText = words.map((w) => w.text).join(" ");

  useEffect(() => {
    if (!animate) {
      setVisibleCharsCount(999999);
      return;
    }

    setVisibleCharsCount(0);
    let currentCount = 0;
    
    const interval = setInterval(() => {
      currentCount += 1;
      setVisibleCharsCount(currentCount);
      if (currentCount >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [triggerKey, fullText, speed, animate]);

  // Track global index of characters rendered so far
  let globalCharIdx = 0;

  return (
    <div className={`inline-flex flex-wrap items-center ${className}`}>
      <div className="flex flex-wrap gap-x-[0.25em] gap-y-0.5 items-center">
        {words.map((word, wordIdx) => {
          const wordText = word.text;
          const wordStartIdx = globalCharIdx;
          globalCharIdx += wordText.length + 1; // +1 accounts for space

          // Calculate visible length for the current word
          const visibleWordLength = Math.max(
            0,
            Math.min(wordText.length, visibleCharsCount - wordStartIdx)
          );

          if (visibleWordLength === 0) return null;

          if (wordText === "\n") {
            return (
              <div 
                key={wordIdx} 
                className={word.className || "basis-full h-0"} 
              />
            );
          }

          return (
            <span key={wordIdx} className={word.className || ""}>
              {wordText.slice(0, visibleWordLength)}
            </span>
          );
        })}
      </div>
    </div>
  );
};
