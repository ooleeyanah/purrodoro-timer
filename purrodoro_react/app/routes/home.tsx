import type { Route } from "./+types/home";
import { useTimer } from "../timer-context";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Purrodoro Timer" },
    { name: "description", content: "A Pomodoro timer." },
  ];
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const { isRunning, pause, remainingSeconds, reset, start } = useTimer();

  return (
    <main>
      <div id="bg_img" aria-hidden="true" />
      <section id="box" aria-labelledby="timer-heading">
        <div id="overlay">
          <h1 id="timer-heading">Time Remaining:</h1>
        </div>
        <div id="progress" aria-live="polite">
          <p>{formatTime(remainingSeconds)}</p>
        </div>
        <div id="functions">
          <button id="reset" type="button" onClick={reset}>
            Reset
          </button>
          <button id="pause" type="button" onClick={isRunning ? pause : start}>
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </section>
    </main>
  );
}
