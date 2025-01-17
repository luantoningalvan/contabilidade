require("dotenv").config();

import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";
import cors from "cors";
import http from "http";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";
import path from "path";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT;

app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/public", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api", routes);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

io.on("connection", (socket) => {
  socket.on("newBarCode", async (msg) => {
    const findProduct = await prisma.product.findFirst({
      where: { barCode: msg.data },
    });

    io.emit("newProductScanned", {
      code: msg.data,
      isAssociated: !!findProduct,
      product: findProduct,
    });
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
