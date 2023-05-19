import { Badge, FriendsGamesType } from "@/types";
import { basebadegeData } from "./baseBadges";
import { getGameData } from "./games";

export const getBadges = (num: number) => {
  const badges: Badge[] = [];
  while (badges.length < num) {
    const b: Badge =
      basebadegeData[Math.floor(Math.random() * basebadegeData.length)];
    if (!badges.find((badge) => badge.id == b.id)) {
      badges.push(b);
      continue;
    }
  }
  return badges;
};
// i am sorry, need to learn more about this

export const getFriendsGames = (num: number): FriendsGamesType => {
  return {
    "connect Four": {
      ...getGameData(0),
      played: Math.floor(Math.random() * num),
      won: Math.floor(Math.random() * num),
      lost: Math.floor(Math.random() * num),
    },
    "Tic Tac Toe": {
      id: 1,
      name: "Tic Tac Toe",
      played: Math.floor(Math.random() * num),
      won: Math.floor(Math.random() * num),
      lost: Math.floor(Math.random() * num),
    },
    "Rock Paper Scissors": {
      id: 2,
      name: "Rock Paper Scissors",
      played: Math.floor(Math.random() * num),
      won: Math.floor(Math.random() * num),
      lost: Math.floor(Math.random() * num),
    },
    "Simon Says": {
      id: 3,
      name: "Simon Says",
      played: Math.floor(Math.random() * num),
      won: Math.floor(Math.random() * num),
      lost: Math.floor(Math.random() * num),
    },
  };
};

// export const syncFriends = () => {
// 	const f: Friend[] = []

// 	for (let i = 0; i < 22; i++) {
// 		f.push(
// 			newFriend({
// 				avatar: faker.image.avatar(),
// 				created: faker.date.past(),
// 				email: faker.internet.email(),
// 				id: i.toString(),
// 				name: faker.name.firstName(),
// 				note: faker.lorem.sentence(),
// 				status: "online",
// 				updated: faker.date.past(),
// 				username: faker.internet.userName(),
// 				badges: {
// 					totalBadges: 3,
// 					badges: getBadges(3),
// 				},
// 				games: getGames(3),
// 			}),
// 		)
// 	}

// 	fs.writeFileSync("./data/friendsjson.json", JSON.stringify(f, null, 2))
// }
