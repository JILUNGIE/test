import { PropsWithChildren } from "react";
import { Link } from "react-router";

interface ISidebarItem {
  path: string;
  currentPath: string;
}

function SidebarItem({
  children,
  path,
  currentPath,
}: PropsWithChildren<ISidebarItem>) {
  return (
    <div
      className={`not-2xl:mr-5 p-2 hover:dark:bg-[#1A1A1E] hover:bg-[#F5F5F5] rounded-2xl active:opacity-60 ${
        path === currentPath ? "opacity-50" : null
      }`}
    >
      <Link to={path}>{children}</Link>
    </div>
  );
}

export default SidebarItem;
