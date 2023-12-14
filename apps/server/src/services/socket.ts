import { Server } from "socket.io";

import Redis from "ioredis";

const pub = new Redis({
  host: "redis-69fe48-lakshyasatpal372-540f.a.aivencloud.com",
  port: 16285,
  username: "default",
  password: "AVNS_SalV0H-dpj0Uw7dlo6S",
});

const sub = new Redis({
  host: "redis-69fe48-lakshyasatpal372-540f.a.aivencloud.com",
  port: 16285,
  username: "default",
  password: "AVNS_SalV0H-dpj0Uw7dlo6S",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log("New socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received", message);
        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
