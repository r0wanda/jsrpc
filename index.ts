/// <reference path="rpctypes.d.ts"/>

import net, { Socket } from 'net';
import uuid from 'uuid';
import path from 'path';
import { existsSync as exists, lstatSync as lstat, readdirSync as readdir } from 'fs';

class JSRpc {
    sock?: Socket;
    id: string;
    path: string;
    quiet: boolean;
    int?: ReturnType<typeof setInterval>;
    log: typeof console.log | typeof console.error;
    OPS = {
        HANDSHAKE: 0,
        FRAME: 1,
        CLOSE: 2,
        PING: 3,
        PONG: 4
    };
    cur: Working;
    /**
     * 
     * @param client_id The Discord client id
     * @param quiet Disables logging, errors are still thrown
     * @param log Set to console.error if you want to redirect logs to stderr
     */
    constructor(client_id: string, quiet = false, log = console.log) {
        this.id = client_id;
        this.path = '';
        this.quiet = quiet;
        this.log = log;
        this.cur = {
            full: '',
            op: undefined
        }
    }
    ipcPath(): string {
        const PATHS: Array<string> = ['', 'snap.discord', 'app/com.discordapp.Discord', 'app/com.discordapp.DiscordCanary'];
        const rundir = process.env.XDG_RUNTIME_DIR;
        var res: string | undefined = undefined;
        if (!rundir || !exists(rundir)) throw new Error(`"${rundir}" is undefined or nonexistent in filesystem`);
        for (var p of PATHS) {
            var full = path.resolve(rundir, p);
            if (lstat(full).isDirectory()) {
                for (var name of readdir(full)) {
                    var f = path.join(full, name);
                    if (name.startsWith('discord-ipc-') && exists(f)) {
                        console.log(f);
                        res = f;
                        break;
                    }
                }
                if (res) break;
            }
        }
        if (!res) throw new Error('Could not find discord IPC, is discord running?');
        this.path = res;
        return res;
    }
    ipc(id = 0): Promise<Socket> {
        return new Promise<Socket>((r, j) => {
            if (this.path === '') throw new Error('IPC path blank');
            const sock = net.createConnection(this.path, () => {
                sock.removeAllListeners('error');
                r(sock);
            });
            sock.once('error', () => {
                if (id < 10) r(this.ipc(++id));
                else j(new Error('Could not connect to Discord IPC'))
            });
        })
    }
    encode(op: number, rawData: RPCReq | RPCRes | RPCRes.Base): Buffer {
        const data = JSON.stringify(rawData);
        const len = Buffer.byteLength(data);
        const pack = Buffer.alloc(8 + len);
        pack.writeInt32LE(op, 0);
        pack.writeInt32LE(len, 4);
        pack.write(data, 8, len);
        return pack;
    }
    decode(cb: (data: RPCRes) => void): void {
        if (!this.sock) throw new Error('IPC connection not established');
        const pack = this.sock.read();
        if (!pack) return;
        var { op } = this.cur;
        var raw;
        if (this.cur.full === '') {
            op = this.cur.op = pack.readInt32LE(0);
            const len = pack.readInt32LE(4);
            raw = pack.slice(8, len + 8);
        } else raw = pack.toString();
        try {
            const data = JSON.parse(this.cur + raw);
            cb({
                op,
                data
            });
            this.cur.full = '';
            this.cur.op = undefined;
        } catch (err) {
            this.cur += raw;
        }
        this.decode(cb);
    }
    send(data: RPCReq | RPCRes | RPCRes.Base, op = this.OPS.FRAME) {
        this.sock?.write(this.encode(op, data));
    }
    async init(): Promise<void> {
        this.ipcPath();
        await this.ipc();
        if (!this.sock) throw new Error('IPC connection not established');
        this.sock.on('close', () => {
            if (!this.quiet) this.log('IPC connection closed');
        });
        this.sock.on('error', err => {
            if (!this.quiet) this.log('IPC connection closed');
            if (!this.quiet) this.log(err);
        });
        this.sock.write(this.encode(this.OPS.HANDSHAKE, {
            v: 1,
            client_id: this.id
        }));
        this.sock.pause();
        this.sock.on('readable', () => {
            this.decode(_data => {
                const data: RPCRes.Base = _data.data;
                if (!_data.op) return;
                const op: number = _data.op;
                switch (op) {
                    case this.OPS.PING:
                        this.send(data, this.OPS.PONG);
                        break;
                    case this.OPS.FRAME:
                        if (!data) return;
                        if (data.cmd)
                }
            })
        })
    }
    probe(): ReturnType<typeof setInterval> {
        this.int = setInterval(async () => {
            try {
                if (!this.sock) await this.init();
            } catch {};
        }, 5000);
        return this.int;
    }
}

const r = new JSRpc('1156398269824520202');
(async () => {
    await r.init();
})();
