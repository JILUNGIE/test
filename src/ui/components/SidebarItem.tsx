import { PropsWithChildren } from "react";
import { Link } from "react-router";

interface ISidebarItem {
  path: string;
}

function SidebarItem({ children, path }: PropsWithChildren<ISidebarItem>) {
  return (
    <div>
      <Link to={path}>{children}</Link>
    </div>
  );
}

export default SidebarItem;
