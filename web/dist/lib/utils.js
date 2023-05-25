import { baseUrl } from "@/constants";
import fsPromises from "fs/promises";
import path from "path";
export const getUrl = (str) => {
    return baseUrl + str;
};
export async function getFromFile(p) {
    const filepath = path.join(process.cwd(), p);
    const jsondata = await fsPromises.readFile(filepath, "utf8");
    const objectData = JSON.parse(jsondata);
    return objectData;
}
