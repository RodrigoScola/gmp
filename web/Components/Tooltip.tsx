import { ChildrenType, Direction } from "@/types/types";
import { ComponentProps } from "react";

export type TooltipProps = {
  text: string | ChildrenType;
  children: ChildrenType;
  direction?: Direction;
};
export const Tooltip = (props: TooltipProps & ComponentProps<"div">) => {
  return (
    <div {...props} className="sidebar-icon group">
      {props.children}
      <span className="sidebar-tooltip group-hover:scale-100">
        {props.text}
      </span>
    </div>
  );
};
