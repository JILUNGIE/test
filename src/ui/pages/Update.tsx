import { useEffect } from "react";
import ReactLogo from "../components/svg/ReactLogo";

function Update() {
  useEffect(() => {
    window.electron.sendTest();
    window.electron.subscribeAppVersion((ver) => {
      console.log(ver);
    });
  }, []);
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <ReactLogo />
      <span className="font-bold">updating... chekc</span>
      <input
        type="range"
        className="w-60 mt-2 pointer-events-none"
        min="0"
        max="100"
        value={10}
      />
    </main>
  );
}

export default Update;
