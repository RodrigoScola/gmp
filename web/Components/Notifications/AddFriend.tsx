import { userSocket } from "@/lib/socket";
import { NotificationProps } from "@/types";
import { IUser } from "../../../shared/src/types/users";

export const AddFiendComponent = ({
     friend,
     ...props
}: NotificationProps & { friend: IUser }) => {
     const handleDeny = () => {
          if (typeof props.onClose !== "undefined") {
               props.onClose();
          }
     };
     const handleAccept = () => {
          if (userSocket.connected) {
               userSocket.emit("add_friend_answer", friend, "accepted");
          }
     };

     return (
          <div {...props} className="bg-gray-800 rounded-md p-4">
               <div className="flex items-center justify-between">
                    <div className="flex items-center text-xl">
                         <p className="font-whitney">
                              <span className=" font-semibold">
                                   {friend.username}
                              </span>{" "}
                              wants to be your friend
                         </p>
                    </div>
               </div>
               <div className="flex flex-row gap-5 justify-between">
                    <button
                         className="button bg-green w-full "
                         onClick={handleAccept}
                    >
                         Accept
                    </button>
                    <button
                         onClick={handleDeny}
                         className="button bg-red w-full"
                    >
                         Decline
                    </button>
               </div>
          </div>
     );
};
