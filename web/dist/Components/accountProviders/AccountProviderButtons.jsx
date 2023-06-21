import { BsDiscord } from "react-icons/bs";
export const AccountProviders = {
    discord: {
        color: "bg-blue-500",
        Icon: BsDiscord,
    },
    // github: {
    //      color: "bg-slate-500",
    //      Icon: BsGithub,
    // },
    // google: {
    //      color: "bg-red-500",
    //      Icon: BsGoogle,
    // },
};
export const ProviderButton = ({ handleClick, provider, }) => {
    const { color, Icon } = AccountProviders[provider];
    return (<div onClick={() => handleClick(provider)} className={`${color} hover:cursor-pointer rounded-md flex py-2 justify-center`}>
               <Icon />
          </div>);
};
