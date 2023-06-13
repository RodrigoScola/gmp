import { IFriend, IUser } from "@/../shared/src/types/users";

export type GameInviteSent = {
     user: IUser;
};
export const GameInviteSent = ({ user }: { user: IFriend | null }) => {
     return (
          <div className="bg-gray-800 shadow-sm rounded-lg p-2">
               <h5 className="text-lg font-wh ">
                    Game Invite Sent to{" "}
                    <span className="font-whitney">{user?.username}</span>
               </h5>
          </div>
     );
};
