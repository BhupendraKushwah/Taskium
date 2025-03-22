import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const toggleTheme = () => {
        let newTheme = theme == 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme)
        setTheme(newTheme);
    }
    useEffect(() => {
        document.documentElement.classList.remove(
            theme !== 'dark' ? 'dark' : 'light'
        );
        document.documentElement.classList.add(
            theme == 'dark' ? 'dark' : 'light'
        );
    }, [theme]);
    return (<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>)
}
export default ThemeContextProvider;