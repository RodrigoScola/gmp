import { newUser } from "@/db/User";
import { faker } from "@faker-js/faker";
import fs from "fs";
export const newMessage = (id, message) => {
    return {
        id,
        created: message.created || new Date().toISOString(),
        message: message.message || "default message",
        userId: message.userId || newUser().id,
    };
};
export const newConversation = () => {
    let convo = {
        id: "123123123",
        users: [
            newUser({
                id: faker.datatype.uuid(),
            }),
            newUser({
                id: faker.datatype.uuid(),
            }),
        ],
        messages: [],
    };
    for (let i = 0; i < 140; i++) {
        convo.messages.push(newMessage(i.toString(), {
            message: faker.lorem.sentence(),
            userId: convo.users[Math.floor(Math.random() * 2)].id,
        }));
    }
    return convo;
};
export const syncConversation = () => {
    const convo = newConversation();
    fs.writeFileSync("./data/conversationjson.json", JSON.stringify(convo), "utf8");
};
