// 'use client'
import ConnectFourComponent from "@/Components/games/Connectcomponent";
import RPSComponent from "@/Components/games/RPSGameComponent";
import { SimonSaysComponent } from "@/Components/games/SimonSaysComponent";
import TicTacToeGameComponent from "@/Components/games/TicTacToeComponent";
export default async function RenderGame({ params: { id }, }) {
    // return <TicTacToeGameComponent />
    const data = await fetch(`http://localhost:3001/${id}`, {
        cache: "no-store",
    });
    const jsondata = await data.json();
    // console.log(data.json());
    try {
        console.log(jsondata.match.game.name);
    }
    catch (err) {
        console.log(err);
        // window.location.href = "/play";
    }
    switch (jsondata.match.game.name) {
        case "Rock Paper Scissors":
            return <RPSComponent gameId={id} gameName={jsondata.match.game.name}/>;
        case "Tic Tac Toe":
            return (<TicTacToeGameComponent gameId={id} gameName={jsondata.match.game.name}/>);
        case "connect Four":
            return (<ConnectFourComponent gameId={id} gameName={jsondata.match.game.name}/>);
        case "Simon Says":
            return (<SimonSaysComponent gameId={id} gameName={jsondata.match.game.name}/>);
        default:
            return <div>hello there</div>;
    }
}