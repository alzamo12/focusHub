import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";


// export const ThemeContext = createContext("null");
const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });


    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const themeInfo = {
        toggleTheme,
        theme
    };

    return <ThemeContext.Provider value={themeInfo}>
        {children}
    </ThemeContext.Provider>
};

export default ThemeProvider;