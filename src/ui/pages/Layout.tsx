import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import { ToastContainer } from "react-toastify";
import useTheme from "../hooks/useTheme";

function Layout() {
  const { toggleDark } = useTheme();

  return (
    <div className="dark:bg-[#1A1A1E] bg-[#F5F5F5] dark:text-white text-black w-screen h-screen grid grid-cols-24 grid-rows-10 ">
      <aside className="2xl:row-start-1 2xl:row-span-full 2xl:col-start-1 2xl:col-span-1 h-full row-start-1 row-span-1 col-start-1 col-span-full">
        <SideBar toggleDark={toggleDark} />
      </aside>
      <main className="2xl:row-start-1 2xl:row-span-full 2xl:col-start-2 2xl:col-span-full row-start-2 row-span-full col-start-1 col-span-full box-border p-5">
        <Outlet />
      </main>
      <ToastContainer
        position="bottom-right"
        limit={5}
        theme="dark"
        pauseOnHover={false}
        autoClose={1000}
      />
    </div>
  );
}

export default Layout;
