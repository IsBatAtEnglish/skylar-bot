"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Skylar = require("./client");
new Skylar.Client('../settings.json')
    .start();
