import { Router, Request } from "express";

export const playRouter = Router();

import { io } from "../server";


interface PlayRequest extends Request {
    room?: {
        id: string
    }
   
} 

io.on('connection', (socket) => {
console.log('this is the room')
})

playRouter.param("roomId", (req: PlayRequest, res, next, roomId) => {
    req.room = {
id: roomId

    }
    
    next()
})

playRouter.get('/', (req, res) => {

    res.json({
        message: 'Hello World'
    })
})