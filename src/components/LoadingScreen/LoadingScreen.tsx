import { useEffect, useState } from "react";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  accentColor: string;
  words?: string[];
}

type LoadStage = "spin" | "ready" | "exit" | "done";

const WORD_INTERVAL_MS = 480;
const READY_DELAY_MS = 1500;
const EXIT_DELAY_MS = 1750;
const DONE_DELAY_MS = 2250;

export const LoadingScreen = ({
  accentColor,
  words = ["Developing", "Scanning", "Uploading"],
}: LoadingScreenProps) => {
  const [stage, setStage] = useState<LoadStage>("spin");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const wordTimer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, WORD_INTERVAL_MS);

    const readyTimer = window.setTimeout(() => {
      window.clearInterval(wordTimer);
      setStage("ready");
    }, READY_DELAY_MS);

    const exitTimer = window.setTimeout(() => setStage("exit"), EXIT_DELAY_MS);
    const doneTimer = window.setTimeout(() => setStage("done"), DONE_DELAY_MS);

    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [words.length]);

  if (stage === "done") return null;

  const isSpinning = stage === "spin";

  return (
    <div className={`loading-screen ${stage === "exit" ? "loading-screen--exit" : ""}`}>
      <div className="loading-screen__spinner">
        <div className="loading-screen__ring" />
        <div
          className="loading-screen__pulse"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="loading-screen__word-stack">
        <div className={`loading-screen__words ${isSpinning ? "" : "loading-screen__words--hidden"}`}>
          {words.map((word, index) => (
            <div
              key={word}
              className="loading-screen__word"
              style={{ transform: `rotateX(${index === wordIndex ? 0 : 90}deg)` }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
