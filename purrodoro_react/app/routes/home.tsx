import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useTimer } from "../timer-context";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Purrodoro Timer" },
    { name: "description", content: "A Pomodoro timer." },
  ];
}

export default function Home() {
  const { durations, setDurations } = useTimer();
  const navigate = useNavigate();
  const isStandardPreset = durations.focus === 25 * 60 && durations.shortBreak === 5 * 60;
  const isExtendedPreset = durations.focus === 50 * 60 && durations.shortBreak === 10 * 60;

  function choosePreset(focus: number, shortBreak: number) {
    setDurations({ focus, shortBreak });
    navigate("/character");
  }

  return (
    <main className="timer-menu">
      <section className="timer-menu__panel" aria-labelledby="timer-menu-heading">
        <h1 id="timer-menu-heading">Choose your timer:</h1>
        <div className="timer-menu__choices" aria-label="Timer presets">
          <button
            className="timer-preset timer-preset--standard"
            type="button"
            aria-pressed={isStandardPreset}
            onClick={() => choosePreset(25 * 60, 5 * 60)}
          >
            <span>25 minute work</span>
            <span>5 minute break</span>
          </button>
          <button
            className="timer-preset timer-preset--extended"
            type="button"
            aria-pressed={isExtendedPreset}
            onClick={() => choosePreset(50 * 60, 10 * 60)}
          >
            <span>50 minute work</span>
            <span>10 minute break</span>
          </button>
        </div>
      </section>
    </main>
  );
}
