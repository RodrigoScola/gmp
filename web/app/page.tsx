import { getUrl } from "@/lib/utils"
import Link from "next/link"
export default function Home() {
	return (
		<div>
			<Link href={getUrl("/play")}>Play a game</Link>
		</div>
	)
}
