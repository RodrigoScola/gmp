package user

type User struct {
	id       string
	name     string
	avatar   string
	created  string
	email    string
	username string
	verified bool
	updated  string
}

type UserHandler struct {
	users map[*string]*User
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		users: make(map[*string]*User),
	}
}

func (u *UserHandler) AddUser(user *User) {
	u.users[&user.id] = user
}

func (u *UserHandler) GetUser(id *string) (*User, bool) {
	if u.users[id] != nil {
		return u.users[id], true
	}
	return nil, false
}
