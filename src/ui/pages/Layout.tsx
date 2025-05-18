import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import useSerial from "../hooks/useSerial";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

function Layout() {
  const portManager = useSerial();

  useEffect(() => {
    window.electron.subscribeErrorMessage((msg) => {
      msg.map((value) => toast(value));
    });
  }, []);

  return (
    <div className="bg-[#1A1A1E] w-screen h-screen grid grid-cols-24 grid-rows-10 ">
      <aside className="2xl:row-start-1 2xl:row-span-full 2xl:col-start-1 2xl:col-span-1 h-full row-start-1 row-span-1 col-start-1 col-span-full">
        <SideBar />
      </aside>
      <main className="2xl:row-start-1 2xl:row-span-full 2xl:col-start-2 2xl:col-span-full row-start-2 row-span-full col-start-1 col-span-full box-border p-5">
        <Outlet context={portManager} />
      </main>
      <ToastContainer
        position="bottom-right"
        limit={5}
        theme="dark"
        pauseOnHover={false}
        autoClose={1500}
      />
    </div>
  );
}

export default Layout;
