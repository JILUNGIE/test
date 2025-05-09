import SidebarItems from "../utils/SidebarItems";
import SidebarItem from "./SidebarItem";

function SideBar() {
  return (
    <div className="bg-[#121214] h-full w-full box-border 2xl:p-5 2xl:pt-10">
      <ul className="2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:gap-10 flex">
        {SidebarItems.map((value) => (
          <SidebarItem key={value.id} path={value.path}>
            {value.icon}
          </SidebarItem>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
