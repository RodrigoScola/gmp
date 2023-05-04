'use client'
import { useObject } from "@/hooks/useObject"
import { useUser } from "@/hooks/useUser"

export default function LOGINPAGE() {
	const [state, setState] = useObject({
		email: "",
		password: ""
	})
	const user = useUser()
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState({
			[e.target.name]: e.target.value
		})
	}
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		user.logout()
		user.login(state.email, state.password)

	console.log(user,'asdf')
}
	console.log(user)
	return <>
	<form onSubmit={handleSubmit}>
		<div>
	<label>email

		<input onChange={handleChange} name="email" value={state.email} type="email" />
	</label>
	<label>
		password

		<input onChange={handleChange} name="password" value={state.password} type="password" />
	</label>
		</div>
		<button type="submit">login</button>
		</form></>
}
