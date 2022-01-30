import "dotenv";
import {createServer} from "http";
import Server from "./src/server";

const PORT = process.env.PORT || 3010;

createServer(Server.callback())
    .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });