import { createContext, useContext, useEffect, useReducer } from "react";

export type TimerPhase = "focus" | "shortBreak" | "longBreak";

export type TimerDurations = Record<TimerPhase, number>;

export const DEFAULT_DURATIONS: TimerDurations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

type TimerState = {
    completedFocusSessions: number;
    durations: TimerDurations;
    isRunning: boolean;
    phase: TimerPhase;
    remainingSeconds: number;
};

type TimerAction =
    | { type: "pause" }
    | { type: "reset" }
    | { type: "setDurations"; durations: Partial<TimerDurations> }
    | { type: "start" }
    | { type: "tick" }
    | { type: "toggle" };

type TimerContextValue = TimerState & {
    pause: () => void;
    reset: () => void;
    setDurations: (durations: Partial<TimerDurations>) => void;
    start: () => void;
    toggle: () => void;
};

const TimerContext = createContext<TimerContextValue | null>(null);

const initialState: TimerState = {
    completedFocusSessions: 0,
    durations: DEFAULT_DURATIONS,
    isRunning: false,
    phase: "focus",
    remainingSeconds: DEFAULT_DURATIONS.focus,
};

function nextPhase(state: TimerState): TimerState {
    if (state.phase === "focus") {
        const completedFocusSessions = state.completedFocusSessions + 1;
        const phase = completedFocusSessions % 4 === 0 ? "longBreak" : "shortBreak";

        return {
            ...state,
            completedFocusSessions,
            phase,
            remainingSeconds: state.durations[phase],
        };
    }

    return {
        ...state,
        phase: "focus",
        remainingSeconds: state.durations.focus,
    };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case "start":
            return { ...state, isRunning: true };
        case "pause":
            return { ...state, isRunning: false };
        case "toggle":
            return { ...state, isRunning: !state.isRunning };
        case "reset":
            return {
                ...state,
                isRunning: false,
                remainingSeconds: state.durations[state.phase],
            };
        case "setDurations": {
            const durations = { ...state.durations, ...action.durations };

            return {
                ...state,
                durations,
                remainingSeconds: durations[state.phase],
            };
        }
        case "tick":
            if (!state.isRunning) {
                return state;
            }

            if (state.remainingSeconds > 1) {
                return { ...state, remainingSeconds: state.remainingSeconds - 1 };
            }

            return nextPhase(state);
    }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(timerReducer, initialState);

    useEffect(() => {
        if (!state.isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => dispatch({ type: "tick" }), 1000);

        return () => window.clearInterval(intervalId);
    }, [state.isRunning]);

    const value: TimerContextValue = {
        ...state,
        pause: () => dispatch({ type: "pause" }),
        reset: () => dispatch({ type: "reset" }),
        setDurations: (durations) => dispatch({ type: "setDurations", durations }),
        start: () => dispatch({ type: "start" }),
        toggle: () => dispatch({ type: "toggle" }),
    };

    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
    const timer = useContext(TimerContext);

    if (!timer) {
        throw new Error("useTimer must be used within a TimerProvider");
    }

    return timer;
}
