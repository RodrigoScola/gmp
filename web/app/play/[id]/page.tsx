// 'use client'
import { GameRoom, Room, RoomHandler } from "@/../server/src/handlers/room";
import ConnectFourComponent from "@/Components/games/Connectcomponent";
import RPSComponent from "@/Components/games/RPSGameComponent";
import { SimonSaysComponent } from "@/Components/games/SimonSaysComponent";
import TicTacToeGameComponent from "@/Components/games/TicTacToeComponent";

export default async function RenderGame({ params: { id } }) {
  // return <TicTacToeGameComponent />
  // const data = await fetch(`http://localhost:3001/a0s9df0a9sdjf`, {
  //   cache: "no-store",
  // });
  // const jsondata = await data.json();
  // // console.log(data.json());

  // try {
  //   console.log(jsondata.match.game.name);
  // } catch (err) {
  //   window.location.href = "/play";
  // }
  // console.log(jsondata.match.game.name);

  // console.log(jsondata.match.game.name);
  // switch (jsondata.match.game.name) {
  //   case "Rock Paper Scissors":
  //     return <RPSComponent />;
  //   case "Tic Tac Toe":
  //     return <TicTacToeGameComponent />;
  //   case "connect Four":
  //     return <ConnectFourComponent />;
  //   case "Simon Says":
  //     return <SimonSaysComponent />;
  //   default:
  //     return <div>hello there</div>;
  // }
  // if (id >= 200 && id <= 300) return <RPSComponent />;
  // else if (id > 300 && id < 400) return <TicTacToeGameComponent />;
  // else if (id > 400 && id < 500) return <ConnectFourComponent />;
  return <SimonSaysComponent />;
}
