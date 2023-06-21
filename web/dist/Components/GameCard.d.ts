import { ComponentProps } from "react";
import { GameData } from "../../shared/src/game/gameUtils";
export default function GameCard(props: ComponentProps<"div"> & {
    game: GameData;
    isSelected: boolean;
}): JSX.Element;
//# sourceMappingURL=GameCard.d.ts.map