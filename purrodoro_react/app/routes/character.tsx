import { useNavigate } from "react-router";
import type { Route } from "./+types/character";
import { characters, useTimer } from "../timer-context";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Choose Your Character | Purrodoro Timer" },
        { name: "description", content: "Choose a character for your Pomodoro session." },
    ];
}

export default function Character() {
    const { characterIndex, setCharacter, start } = useTimer();
    const navigate = useNavigate();
    const character = characters[characterIndex];

    function selectPrevious() {
        setCharacter(characterIndex === 0 ? characters.length - 1 : characterIndex - 1);
    }

    function selectNext() {
        setCharacter((characterIndex + 1) % characters.length);
    }

    function startTimer() {
        start();
        navigate("/timer");
    }

    return (
        <main className="character-menu">
            <section className="character-menu__panel" aria-labelledby="character-menu-heading">
                <h1 id="character-menu-heading">Choose your character:</h1>
                <div className="character-menu__stage">
                    <button
                        className="character-menu__arrow character-menu__arrow--previous"
                        type="button"
                        aria-label="Previous character"
                        onClick={selectPrevious}
                    >
                        <span aria-hidden="true">&larr;</span>
                    </button>
                    <img className="character-menu__image" src={character.src} alt={character.name} />
                    <p className="visually-hidden" aria-live="polite">
                        {character.name}
                    </p>
                    <button
                        className="character-menu__arrow character-menu__arrow--next"
                        type="button"
                        aria-label="Next character"
                        onClick={selectNext}
                    >
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
                <button className="character-menu__ready" type="button" onClick={startTimer}>
                    <span className="character-menu__play" aria-hidden="true" />
                    Ready!
                </button>
                <button
                    className="character-menu__ready"
                    type="button"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
            </section>
        </main>
    );
}