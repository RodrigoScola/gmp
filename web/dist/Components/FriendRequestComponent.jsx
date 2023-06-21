export const FriendRequestNotification = ({ friend, }) => {
    return (<div className="bg-gray-800 shadow-sm rounded-lg p-2">
               <h5 className="text-lg font-whitney ">
                    Friend invite Sent To{" "}
                    <span className="font-whitney">{friend?.username}</span>
               </h5>
          </div>);
};
