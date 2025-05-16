import SidebarItems from "../utils/SidebarItems";
import SidebarItem from "./SidebarItem";

function SideBar() {
  return (
    <div className="bg-[#121214] h-full 2xl:w-full box-border p-5 2xl:pt-10">
      <ul className="2xl:flex-col 2xl:justify-center 2xl:gap-10 flex items-center not-2xl:h-full ">
        {SidebarItems.map((value) => (
          <SidebarItem
            className="not-2xl:mr-10"
            key={value.id}
            path={value.path}
          >
            {value.icon}
          </SidebarItem>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
