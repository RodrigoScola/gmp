package server

import (
	"encoding/json"
	"fmt"
	"io"
	"server/lib/user"

	"golang.org/x/net/websocket"
)

type Server struct {
	conns map[*string]*Connection
}

func NewServer() *Server {

	return &Server{

		conns: make(map[*string]*Connection),
	}
}

func (s *Server) ReadLoop(ws *websocket.Conn) {
	buf := make([]byte, 1024)

	for {
		n, err := ws.Read(buf)
		if err != nil {
			if err == io.EOF {
				fmt.Println("client disconnected: ", ws.RemoteAddr())
				delete(s.conns, &ws.Request().RemoteAddr)
				break
			}
			fmt.Println("error reading from client: ", err)
			continue
		}
		data := string(buf[:n])

		jsondata, _ := json.Marshal(data)
		fmt.Println("received from client: ", string(jsondata))
		s.conns[&ws.Request().RemoteAddr] = &Connection{
			id:   &ws.Request().RemoteAddr,
			User: &user.User{},
		}

		// fmt.Println(GetConnection(s, &ws.Request().RemoteAddr))
		ws.Write([]byte("thank you for the message"))
	}
}

func (s *Server) HandleWs(ws *websocket.Conn) {
	connectionID := &ws.Request().RemoteAddr
	fmt.Println("new incoming connection from client: ", connectionID)
	s.conns[connectionID] = &Connection{id: connectionID}
	s.ReadLoop(ws)

}
