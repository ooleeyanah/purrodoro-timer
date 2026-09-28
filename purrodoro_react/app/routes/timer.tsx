import type { Route } from "./+types/timer";
import { useNavigate } from "react-router";
import { characters, useTimer } from "../timer-context";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Timer | Purrodoro Timer" },
        { name: "description", content: "A running Pomodoro timer." },
    ];
}

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
}

export default function Timer() {
    const { characterIndex, isRunning, pause, remainingSeconds, reset, skip, start } = useTimer();
    const character = characters[characterIndex];
    const navigate = useNavigate();

    function toggleTimer() {
        if (isRunning) {
            pause();
        } else {
            start();
        }
    }

    return (
        <main className="timer-screen">
            <section className="timer-screen__panel" aria-labelledby="timer-heading">
                <h1 id="timer-heading">Time remaining:</h1>
                <div className="timer-screen__clock" role="timer" aria-live="polite">
                    {formatTime(remainingSeconds)}
                </div>
                <div className="timer-screen__character">
                    <img src={character.src} alt={character.name} />
                </div>
                <div className="timer-screen__actions">
                    <button className="timer-screen__button" type="button" onClick={reset}>
                        <span className="timer-screen__reset-icon" aria-hidden="true">&#8634;</span>
                        Reset
                    </button>
                    <button className="timer-screen__button" type="button" onClick={toggleTimer}>
                        <span className="timer-screen__pause-icon" aria-hidden="true" />
                        {isRunning ? "Pause" : "Resume"}
                    </button>
                    <button
                        className="timer-screen__button timer-screen__back"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                    <button className="timer-screen__button" type="button" onClick={skip}>
                        Skip
                    </button>
                </div>
            </section>
        </main>
    );
}
