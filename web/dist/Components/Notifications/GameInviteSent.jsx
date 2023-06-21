export const GameInviteSent = ({ user }) => {
    return (<div className="bg-gray-800 shadow-sm rounded-lg p-2">
               <h5 className="text-lg font-whitney ">
                    Game Invite Sent to{" "}
                    <span className="font-whitney">{user?.username}</span>
               </h5>
          </div>);
};
