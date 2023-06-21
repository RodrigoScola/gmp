import { ComponentProps } from "react";
import { GameData } from "../../shared/src/game/gameUtils";

export default function GameCard(
     props: ComponentProps<"div"> & {
          game: GameData;
          isSelected: boolean;
     }
) {
     return (
          <div
               {...props}
               className={`${
                    props.isSelected ? "bg-blue shadow-lg" : "bg-gray-700"
               } rounded-lg ${
                    props.className ? props.className : ""
               }  max-w-[300px] p-2  border-2 border-white bg-gray-600`}
          >
               <div className=" align-middle items-center gap-1 pb-2">
                    <h3 className="text-white font-whitney font-semibold text-4xl capitalize ">
                         {props.game.name}
                    </h3>
                    <div className="font-thin text-white font-whitney text-left">
                         {props.game.description}
                    </div>
               </div>
          </div>
     );
}
