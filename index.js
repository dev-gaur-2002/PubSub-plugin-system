const express = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { addDoc } = require("./src/firebase/firebase");

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get("/", (req, res) => {
    res.send("home page");
});

server.get("/form", (req, res) => {
    res.send("user form");
});

server.post("/form", async (req, res) => {
    const response = req.body;
    console.log(response);
    response.uuidCol = uuidv4();
    addDoc(response, res);
});

server.listen(process.env.MAIN_PORT, () => {
    console.log(`server is up and running at port : ${process.env.MAIN_PORT}`);
});
