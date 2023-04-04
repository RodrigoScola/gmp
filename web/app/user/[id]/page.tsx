import { getUserByUsername } from "@/db/User"

export default async function PROFILEPAGE({
	params,
}: {
	params: {
		id: string
	}
}) {
	const user = await getUserByUsername(params.id)

	return (
		<div>
			<div>
				<img src="#" />
				<div>
					<h1>{user.username}</h1>
					<div>
						<ul>
							<li id="badge1" className=""></li>
							<li id="badge2" className="badge"></li>
							<li id="badge3" className="badge"></li>
							<li id="badge4" className="badge"></li>
							<li id="badge5" className="badge"></li>
						</ul>
					</div>
				</div>
				<div>
					<div>23 friends</div>
					<div>2 Badges</div>
				</div>
			</div>
			<div className="flex flex-row">
				<div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
					<p className="text-3xl">0.3 kd</p>
					<p className="text-xl">Tic tac toe</p>
				</div>
				<div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
					<p className="text-3xl">0.9 kd</p>
					<p className="text-xl">4 square</p>
				</div>
				<div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
					<p className="text-3xl">20 kd</p>
					<p className="text-xl">Pong</p>
				</div>

				<div className="h-40 w-40 bg-red-50 rounded-lg flex justify-center flex-col items-center">
					<p className="text-3xl">199</p>
					<p className="text-xl">Simon Says</p>
				</div>
			</div>
			<div>
				<ul>
					<li>
						<div className="game_icon"></div>
						<div className="">
							<p>25 min ago</p>
							<p>first user vs second user</p>
						</div>
					</li>
					<li>
						<div className="game_icon"></div>
						<div>
							<p>25 min ago</p>
							<p>first user vs second user</p>
						</div>
					</li>
					<li>
						<div className="game_icon"></div>
						<div>
							<p>25 min ago</p>
							<p>first user vs second user</p>
						</div>
					</li>
					<li>
						<div className="game_icon"></div>
						<div>
							<p>25 min ago</p>
							<p>first user vs second user</p>
						</div>
					</li>
				</ul>
				<div>Loading Icon</div>
			</div>
		</div>
	)
}
