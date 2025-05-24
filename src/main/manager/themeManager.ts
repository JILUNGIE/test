class themeManager {
  private nativeTheme: Electron.NativeTheme;
  private isDark: boolean;

  constructor(nativeTheme: Electron.NativeTheme) {
    this.nativeTheme = nativeTheme;
    this.nativeTheme.themeSource = "system";
    this.isDark = nativeTheme.shouldUseDarkColors;
  }

  public getCurTheme() {
    return this.isDark;
  }

  public toggleTheme() {
    if (this.isDark) {
      this.nativeTheme.themeSource = "light";
      this.isDark = false;
    } else {
      this.nativeTheme.themeSource = "dark";
      this.isDark = true;
    }
  }
}

export default themeManager;
