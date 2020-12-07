const { Socket } = require("dgram");
const { static } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const socket = require("socket.io");
