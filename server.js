const express = require("express");

const SchemeRouter = require("./schemes/scheme-router.js");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/api/schemes", SchemeRouter);

module.exports = server;
