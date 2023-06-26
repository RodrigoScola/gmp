export const MessageReceivedNotification = ({
     username,
}: {
     username: string
}) => {
     return (
          <div className="bg-gray-800 rounded-md p-4 text-white">
               <p>
                    <span className="font-whitney font-bold capitalize ">
                         {username}
                    </span>{" "}
                    has sent you a message.
               </p>
          </div>
     )
}
