import { useEffect, useRef } from "react";

function useTheme() {
  const dark = useRef<boolean>(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const getTheme = async () => {
      const result = await window.electron.theme({ event: "getTheme" });
      if (result.dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        dark.current = true;
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        dark.current = false;
      }
    };

    getTheme();
  }, []);

  const toggleDark = async () => {
    await window.electron.theme({ event: "toggle" });
    if (dark.current) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      dark.current = false;
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      dark.current = true;
    }
  };

  return { dark, toggleDark };
}

export default useTheme;
