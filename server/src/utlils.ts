import fsPromises from "fs/promises";
import path from "path";
export async function getFromFile<T>(p: string): Promise<T> {
  const filepath = path.join(process.cwd(), p);
  console.log(filepath);
  const jsondata = await fsPromises.readFile(filepath, "utf8");
  const objectData = JSON.parse(jsondata);
  return objectData as T;
}
