import SidebarItems from "../utils/SidebarItems";
import SidebarItem from "./SidebarItem";
import MoonIcon from "../assets/svg/MoonIcon";
import SunIcon from "../assets/svg/SunIcon";
import { useLocation } from "react-router";
import useTheme from "../hooks/useTheme";

function SideBar() {
  const { getTheme, toggleDark } = useTheme();

  const { pathname } = useLocation();

  return (
    <div className="dark:bg-[#121214] bg-[#ECECEC] h-full 2xl:w-full box-border p-5 2xl:pt-10">
      <ul className="2xl:flex-col 2xl:gap-10 flex items-center h-full justify-between">
        <div className="flex 2xl:flex-col 2xl:gap-10 justify-between ">
          {SidebarItems.map((value) => (
            <SidebarItem
              currentPath={pathname}
              key={value.id}
              path={value.path}
            >
              {value.icon}
            </SidebarItem>
          ))}
        </div>
        <li
          className="hover:dark:bg-[#1A1A1E] p-2 hover:bg-[#F5F5F5] rounded-2xl active:opacity-60 cursor-pointer"
          onClick={toggleDark}
        >
          {getTheme() ? <MoonIcon /> : <SunIcon />}
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
