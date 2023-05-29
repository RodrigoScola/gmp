"use client";
import { Button } from "@chakra-ui/react";
import { useObject } from "@/hooks/useObject";
import { useUser } from "@/hooks/useUser";
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs";
import { useSupabase } from "../supabase-provider";

type ProviderType = "discord" | "github" | "google";
export default function LOGINPAGE() {
  const [state, setState] = useObject({
    email: "",
    password: "",
  });
  const user = useUser();
  const supabase = useSupabase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await user.logout();
    await user.login(state.email, state.password);
    // if (typeof window !== "undefined") {
    //   window.location.href = "/";
    // }
  };
  const handleProviderSignIn = async (provider: ProviderType) => {
    await supabase.supabase.auth.signInWithOAuth({
      provider: provider,
    });
  };
  return (
    <>
      <form className="m-auto w-fit" onSubmit={handleSubmit}>
        <div>
          <label className="flex flex-col">
            Email
            <input
              onChange={handleChange}
              name="email"
              value={state.email}
              type="email"
            />
          </label>
          <div>
            <label className="flex flex-col">
              Password
              <input
                onChange={handleChange}
                name="password"
                value={state.password}
                type="password"
              />
            </label>
          </div>
        </div>
        <div className="gap-2 pt-3 flex flex-col">
          <div
            onClick={() => handleProviderSignIn("google")}
            className={`bg-red-500 rounded-md flex py-2 justify-center`}
          >
            <button>
              <BsGoogle color="white" />
            </button>
          </div>
          <div
            onClick={() => handleProviderSignIn("github")}
            className={`bg-slate-500 rounded-md flex py-2 justify-center`}
          >
            <button>
              <BsGithub color="white" />
            </button>
          </div>
          <div
            onClick={() => handleProviderSignIn("discord")}
            className={`bg-blue-500  rounded-md flex py-2 justify-center`}
          >
            <button className="">
              <BsDiscord color="white" />
            </button>
          </div>
        </div>
        <Button type="submit">login</Button>
      </form>
    </>
  );
}
