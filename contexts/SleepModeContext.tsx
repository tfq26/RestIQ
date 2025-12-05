import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type SleepModeContextType = {
    isSleepMode: boolean;
    setSleepMode: Dispatch<SetStateAction<boolean>>;
    toggleSleepMode: () => void;
};

const SleepModeContext = createContext<SleepModeContextType | null>(null);

export const SleepModeProvider = ({ children }: { children: ReactNode }) => {
    const [isSleepMode, setSleepMode] = useState(false);

    const toggleSleepMode = () => setSleepMode((prev) => !prev);

    return (
        <SleepModeContext.Provider value={{ isSleepMode, setSleepMode, toggleSleepMode }}>
            {children}
        </SleepModeContext.Provider>
    );
};

export const useSleepMode = () => {
    const context = useContext(SleepModeContext);
    if (!context) {
        throw new Error("useSleepMode must be used within a SleepModeProvider");
    }
    return context;
};
