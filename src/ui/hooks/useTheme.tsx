import { useEffect, useState } from "react";

function useTheme() {
  const [dark, setDark] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const getTheme = async () => {
      const result = await window.electron.theme({ event: "getTheme" });
      if (result.dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setDark(false);
      }
    };

    getTheme();
  }, []);

  const toggleDark = async () => {
    await window.electron.theme({ event: "toggle" });
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return { dark, toggleDark };
}

export default useTheme;
