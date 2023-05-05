import { getUrl } from "@/lib/utils";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="w-fit m-auto text-5xl">
        <h1>The Game Zone</h1>
      </div>
      <div className=" m-auto w-fit mt-10">
        <Link className="border rounded-md p-2" href={getUrl("/play")}>
          Play a game
        </Link>
      </div>
    </div>
  );
}
