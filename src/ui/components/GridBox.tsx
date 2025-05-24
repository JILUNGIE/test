import { PropsWithChildren } from "react";

interface IBox {
  gridInfo: string;
}

function GridBox({ children, gridInfo }: PropsWithChildren<IBox>) {
  return (
    <div
      className={`${gridInfo} dark:bg-[#121214] bg-[#E6E6E6] rounded-2xl p-5`}
    >
      {children}
    </div>
  );
}

export default GridBox;
