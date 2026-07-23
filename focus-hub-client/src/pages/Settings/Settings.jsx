import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../providers/themeProvider/ThemeContext";
import useTitle from "../../hooks/useTittle";

export default function Settings() {
    // const { toggleTheme, theme } = useContext(ThemeContext)

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useTitle("Settings")

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center transition-colors">
            <div className="card w-80 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Settings</h2>

                    <div className="flex items-center justify-between mt-4">
                        <span className="font-medium">
                            {theme === "light" ? "Light Mode" : "Dark Mode"}
                        </span>

                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={theme === "dark"}
                            onChange={toggleTheme}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
