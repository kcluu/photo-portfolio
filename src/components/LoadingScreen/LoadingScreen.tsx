import { useEffect, useState } from "react";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  accentColor: string;
  words?: string[];
  // Whether whatever this screen is masking (e.g. photo preloading) has
  // finished. The screen never exits before MIN_VISIBLE_MS regardless, but
  // stays up past that floor for as long as this is false.
  imagesReady: boolean;
}

type LoadStage = "spin" | "ready" | "exit" | "done";

const WORD_INTERVAL_MS = 480;
const READY_DELAY_MS = 1500;
const MIN_VISIBLE_MS = 1750;
const EXIT_TRANSITION_MS = 500;

export const LoadingScreen = ({
  accentColor,
  words = ["Developing", "Scanning", "Uploading"],
  imagesReady,
}: LoadingScreenProps) => {
  const [stage, setStage] = useState<LoadStage>("spin");
  const [wordIndex, setWordIndex] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const wordTimer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, WORD_INTERVAL_MS);

    const readyTimer = window.setTimeout(() => {
      window.clearInterval(wordTimer);
      setStage("ready");
    }, READY_DELAY_MS);

    const minTimer = window.setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);

    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(minTimer);
    };
  }, [words.length]);

  // Only leaves "ready" once both the minimum display time has passed and
  // the photos have finished loading — whichever takes longer.
  useEffect(() => {
    if (stage !== "ready" || !minTimeElapsed || !imagesReady) return;

    setStage("exit");
    const doneTimer = window.setTimeout(() => setStage("done"), EXIT_TRANSITION_MS);
    return () => window.clearTimeout(doneTimer);
  }, [stage, minTimeElapsed, imagesReady]);

  if (stage === "done") return null;

  const isSpinning = stage === "spin";

  return (
    <div className={`loading-screen ${stage === "exit" ? "loading-screen-exit" : ""}`}>
      <div className="loading-screen-spinner">
        <div className="loading-screen-ring" />
        <div
          className="loading-screen-pulse"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="loading-screen-word-stack">
        <div className={`loading-screen-words ${isSpinning ? "" : "loading-screen-words-hidden"}`}>
          {words.map((word, index) => (
            <div
              key={word}
              className="loading-screen-word"
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
