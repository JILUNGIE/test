import { useEffect, useState } from "react";
import themeStore from "../store/themeStore";

function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(themeStore.getTheme());

  const getTheme = () => {
    return themeStore.getTheme();
  };

  useEffect(() => {
    const getNativeTheme = async () => {
      const result = await window.electron.theme({ event: "getTheme" });

      if (result.dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        themeStore.setTheme(true);
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        themeStore.setTheme(false);
      }
    };

    getNativeTheme();
  }, []);

  const toggleDark = async () => {
    await window.electron.theme({ event: "toggle" });

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      themeStore.setTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      themeStore.setTheme(true);
    }
  };

  useEffect(() => {
    const unsubscribe = themeStore.subscribe(() => {
      setIsDark(themeStore.getTheme());
    });

    return unsubscribe;
  });

  return { isDark, getTheme, toggleDark };
}

export default useTheme;
