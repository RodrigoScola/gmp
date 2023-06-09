export const PointsComponent = ({ player1, player2, }) => {
    return (<div className="grid grid-cols-5 mx-12 items-center ">
               <p className="text-3xl font-ginto  col-span-2 text-right drop-shadow-sm font-semibold capitalize">
                    {player1?.username}
               </p>
               <div className="mb-2 flex justify-center">
                    <div className="text-5xl flex flex-row shadow-md">
                         <span className="p-4 -skew-x-12 bg-blue ">
                              <p className="skew-x-12 font-whitney font-semibold drop-shadow-md">
                                   {player1?.score}
                              </p>
                         </span>
                         <div className="h-fit pt-8 -skew-x-12 text-transparent bg-white w-1">
                              a
                         </div>
                         <span className="p-4 shadow-inner  -skew-x-12  bg-red-500">
                              <p className="skew-x-12 font-whitney drop-shadow-md  font-semibold ">
                                   {player2?.score}
                              </p>
                         </span>
                    </div>
               </div>
               <p className="text-3xl font-ginto font-semibold capitalize col-span-2 text-left drop-shadow-sm">
                    {player2?.username}
               </p>
          </div>);
};
