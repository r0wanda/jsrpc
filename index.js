"use strict";
/// <reference path="rpctypes.d.ts"/>
/// <reference path="ipc.d.ts"/>
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const node_ipc_1 = __importDefault(require("node-ipc"));
const fs_1 = require("fs");
class JSRpc {
    conn;
    id;
    constructor(client_id) {
        this.id = client_id;
        this.conn = null;
    }
    async ipc() {
        const PATHS = ['', 'snap.discord', 'app/com.discordapp.Discord', 'app/com.discordapp.DiscordCanary'];
        const rundir = process.env.XDG_RUNTIME_DIR;
        var res = undefined;
        if (!rundir || !(0, fs_1.existsSync)(rundir))
            throw new Error(`"${rundir}" is undefined or nonexistent in filesystem`);
        for (var p of PATHS) {
            var full = path_1.default.resolve(rundir, p);
            if ((0, fs_1.lstatSync)(full).isDirectory()) {
                for (var name of (0, fs_1.readdirSync)(full)) {
                    var f = path_1.default.join(full, name);
                    if (name.startsWith('discord-ipc-') && (0, fs_1.existsSync)(f)) {
                        console.log(f);
                        res = f;
                        break;
                    }
                }
                if (res)
                    break;
            }
        }
        if (!res)
            throw new Error('Could not find discord IPC, is discord running?');
        await new Promise(r => node_ipc_1.default.connectTo('discord', res, function () { r(); }));
        this.conn = node_ipc_1.default.of.discord;
    }
    async init() {
        await this.ipc();
        if (!this.conn)
            throw new Error('IPC connection not established');
        this.conn.on('error', err => {
            console.error('err:' + err);
        });
        this.conn.on('connect', () => console.log('connect'));
        this.conn.on('disconnect', () => console.log('disconnect'));
        this.conn.on('message', msg => {
            console.log(msg);
        });
    }
}
const r = new JSRpc('1156398269824520202');
(async () => {
    await r.init();
})();
