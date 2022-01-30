import Server from "./server";
import {createServer} from "http";

const PORT = process.env.PORT || 3010;
createServer(Server.callback()).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});