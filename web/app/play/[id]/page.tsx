import ConnectFourComponent from "@/Components/games/Connectcomponent";
import RPSComponent from "@/Components/games/RPSGameComponent";
import { SimonSaysComponent } from "@/Components/games/SimonSaysComponent";
import TicTacToeGameComponent from "@/Components/games/TicTacToeComponent";
import { serverURl } from "@/constants";

export default async function RenderGame({
     params: { id },
     searchParams: { gamename },
}: {
     params: { id: string };
     searchParams: { gamename?: string };
}) {
     let url = `${serverURl}/games/${id}`;
     if (gamename !== "") {
          url = `${url}?gamename=${gamename}`;
     }
     // return <TicTacToeGameComponent />
     const data = await fetch(url, {
          cache: "no-store",
     });
     const jsondata = await data.json();
     console.log(jsondata);
     try {
          console.log(jsondata.match.game.name);
     } catch (err) {
          console.log(err);
          // window.location.href = "/play";
     }

     switch (jsondata.match.game.name) {
          case "Rock Paper Scissors":
               return (
                    <RPSComponent
                         gameId={id}
                         gameName={jsondata.match.game.name}
                    />
               );
          case "Tic Tac Toe":
               return (
                    <TicTacToeGameComponent
                         gameId={id}
                         gameName={jsondata.match.game.name}
                    />
               );
          case "connect Four":
               return (
                    <ConnectFourComponent
                         gameId={id}
                         gameName={jsondata.match.game.name}
                    />
               );
          case "Simon Says":
               return (
                    <SimonSaysComponent
                         gameId={id}
                         gameName={jsondata.match.game.name}
                    />
               );
          default:
               return <div>hello there</div>;
     }
}
