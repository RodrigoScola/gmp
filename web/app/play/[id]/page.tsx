import ConnectFourComponent from "@/Components/games/Connectcomponent";
import RPSComponent from "@/Components/games/RPSGameComponent";
import TicTacToeGameComponent from "@/Components/games/TicTacToeComponent";

export default function RenderGame({ params: { id } }) {
  // return <TicTacToeGameComponent />

  if (id >= 200 && id <= 300) return <RPSComponent />;
  else if (id > 300 && id < 400) return <TicTacToeGameComponent />;
  else if (id > 400 && id < 500) return <ConnectFourComponent />;
}
