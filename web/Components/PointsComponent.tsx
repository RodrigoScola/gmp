import { IUser } from "../../shared/src/types/users";

type Player = Omit<IUser, "created_at" | "email"> & { score: number };
export const PointsComponent = ({
     player1,
     player2,
}: {
     player1: Player;
     player2: Player;
}) => {
     return (
          <div className="grid grid-cols-5 mx-12 items-center ">
               <p className="text-3xl font-ginto  p-2 rounded-lg   col-span-2 text-right drop-shadow-sm font-semibold capitalize">
                    {player1?.username}
               </p>
               <div className="mb-2 flex justify-center">
                    <div className="text-5xl flex flex-row ">
                         <span className="p-4 shadow-md -skew-x-12 bg-blue ">
                              <p className="skew-x-12 font-whitney font-semibold drop-shadow-md">
                                   {player1?.score}
                              </p>
                         </span>
                         <div className="h-fit pt-8 -skew-x-12 text-transparent bg-white w-1">
                              a
                         </div>
                         <span className="p-4  shadow-md -skew-x-12  bg-red-500">
                              <p className="skew-x-12 font-whitney drop-shadow-md  font-semibold ">
                                   {player2?.score}
                              </p>
                         </span>
                    </div>
               </div>
               <p className="text-3xl font-ginto  p-2 rounded-lg   col-span-2 text-left drop-shadow-sm font-semibold capitalize">
                    {player2?.username}
               </p>
          </div>
     );
};
