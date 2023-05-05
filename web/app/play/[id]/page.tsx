import RockPaperScissorGameComponent from "@/Components/games/RockPaperScissorsGame";
import TicTacToeGameComponent from "@/Components/games/TicTacToeComponent";

export default function RenderGame({ params: { id } }) {
  // return <TicTacToeGameComponent />

  if (id >= 200 && id <= 300) return <RockPaperScissorGameComponent />;
  else if (id > 300 && id < 400) return <TicTacToeGameComponent />;
}
