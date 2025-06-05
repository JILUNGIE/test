class ThemeStore {
  private isDark: boolean = localStorage.getItem("theme") === "dark";
  private listener: (() => void)[] = [];

  public getTheme() {
    return this.isDark;
  }

  public setTheme(curTheme: boolean) {
    this.isDark = curTheme;
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listener.push(listener);
    return () => {
      this.listener.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listener.forEach((listener) => listener());
  }
}

const themeStore = new ThemeStore();

export default themeStore;
