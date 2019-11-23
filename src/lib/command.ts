import LumaClient from "../client";
import { Message } from "discord.js";

interface Command {
    name:           string
    description:    string
    usage:          string
    aliases:        string[]
    priviledge:     string[]
    run (client: LumaClient, msg: Message, args: string[]): Promise<void>
}

export default Command