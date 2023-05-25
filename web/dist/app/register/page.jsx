import { BsGoogle, BsGithub, BsDiscord } from "react-icons/bs";
const ButtonProps = "rounded-md flex py-2 justify-center";
export default function REGISTERPAGE() {
    return (<div className="w-fit bg-slate-200 p-3 rounded-lg">
			<form className="flex flex-col">
				<label>
					<p>Email</p>
					<input type="email"/>
				</label>
				<label>
					<p>Username</p>
					<input type="email"/>
				</label>
				<label>
					<p>Password</p>
					<input type="password"/>
				</label>
				<label>
					<p>Confirm Password</p>
					<input type="password"/>
				</label>
			</form>
			<div className="gap-2 pt-3 flex flex-col">
				<div className={`bg-red-500 ${ButtonProps}`}>
					<button>
						<BsGoogle color="white"/>
					</button>
				</div>
				<div className={`bg-slate-500 ${ButtonProps}`}>
					<button>
						<BsGithub color="white"/>
					</button>
				</div>
				<div className={`bg-blue-500 ${ButtonProps}`}>
					<button className="">
						<BsDiscord color="white"/>
					</button>
				</div>
			</div>
		</div>);
}
