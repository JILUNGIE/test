import { PropsWithChildren } from "react";
import { Link } from "react-router";

interface ISidebarItem {
  path: string;
  className: string;
}

function SidebarItem({
  children,
  path,
  className,
}: PropsWithChildren<ISidebarItem>) {
  return (
    <div className={className}>
      <Link to={path}>{children}</Link>
    </div>
  );
}

export default SidebarItem;
