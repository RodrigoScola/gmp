package server

import (
	user "server/lib/user"
)

type Connection struct {
	User *user.User
	room int
	id   *string
}

func GetConnection(s *Server, id *string) *Connection {
	if s.conns[id] != nil {
		return s.conns[id]
	}

	return nil
}
