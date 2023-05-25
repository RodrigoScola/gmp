import { userSocket } from "@/lib/socket";
import { IUser } from "../../../shared/src/types/users";

export const AddFiendComponent = ({ friend }: { friend: IUser }) => {
  const handleAccept = () => {
    if (userSocket.connected) {
      userSocket.emit("add_friend_answer", friend, "accepted");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {friend.username} wants to be your friend
        </div>
      </div>
      <div>
        <button onClick={handleAccept}>accept</button>
        <button>decline</button>
      </div>
    </div>
  );
};
