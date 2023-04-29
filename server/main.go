package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"golang.org/x/net/websocket"

	server "server/server"
)

type RouteHandler interface {
	HandleRoute(w http.ResponseWriter, r *http.Request)
}

type GameHandler struct {
}

func (g *GameHandler) HandleRoute(w http.ResponseWriter, r *http.Request) {
	println("game route")
}

func main() {
	newServer := server.NewServer()
	http.Handle("/ws", websocket.Handler(newServer.HandleWs))
	router := mux.NewRouter()
	var i RouteHandler = &GameHandler{}

	router.HandleFunc("/game/{id}", i.HandleRoute)

	http.ListenAndServe("localhost:3001", nil)

}
