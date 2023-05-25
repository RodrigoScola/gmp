import { getQueryParameters } from "@/lib/UrlUtils";
import { getFromFile } from "@/lib/utils";
export async function GET(request, _) {
    let file = await getFromFile("./data/conversationjson.json");
    const params = getQueryParameters(request.url);
    let n = file;
    if (params.has("first")) {
        file.messages = n.messages.slice(n.messages.length - parseInt(params.get("first") ?? "0"));
    }
    if (params.has("page")) {
        n.messages = n.messages.slice(n.messages.length - parseInt(params.get("page") ?? "1") * 10);
    }
    return new Response(JSON.stringify(n));
}
