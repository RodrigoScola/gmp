import { ChildrenType } from "@/types";
import { Direction } from "../../shared/src/types/types";
import { ComponentProps } from "react";
export type TooltipProps = {
    text: string | ChildrenType;
    children: ChildrenType;
    direction?: Direction;
};
export declare const Tooltip: (props: TooltipProps & ComponentProps<"div">) => JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map