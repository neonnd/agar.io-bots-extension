// ==UserScript==
// @name         AgarUnlimited
// @version      3.0
// @description  AgarUnlimited Revive by Neon
// @author       Neon - Sizrex - MrSonicMaster - NuclearC
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

/*
   Special thanks to NuclearC - MrSonicMaster i wouldn't be here without them
   Thanks to Sizrex for making AgarUnlimited v2.5 Possible / Famous
   Check OP-Bots.com For Premium Bots
*/

/* 
   The MIT License (MIT)
   Copyright (c) 2019 Neon
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
   SOFTWARE.
*/

window.bots = [];

window.client = {
    collectPellets: false,
    startedBots: false,
    ready: false,
    clientX: 0,
    clientY: 0,
    botID: 1,
    bots: 0
};

function addListener() {
    document.addEventListener('mousemove', event => {
        window.client.clientX = event.clientX;
        window.client.clientY = event.clientY;
    });
}

function loadGUI() {
    $('.agario-promo-container').replaceWith(`
    <input onchange="localStorage.setItem('botNick', this.value);" id="botNick" maxlength="15" class="form-control" placeholder="Bot Name" value="Bot"></input>
    <input onchange="localStorage.setItem('botAmount', this.value);" id="BotAmount" maxlength="3" class="form-control" placeholder="Bot Amount" value="10"></input>
    <center><button id="toggleButton" onclick="window.newBot(localStorage.getItem('botAmount'));" class="btn btn-success">Start Bots</button></center>
    `);
    if (!localStorage.getItem('botAmount')) localStorage.setItem('botAmount', 10);
    if (!localStorage.getItem('botNick')) localStorage.setItem('botNick', 'Bot');
    console.log('[AgarUnlimited] Ready!');
    window.client.ready = true;
}

function loadBootsTrapCSS() {
    $('head').append(`<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">`);
}

function editCore(core) {
    core = core.replace(/;if\((\w)<1\.0\){/i, ';if($1<0){');
    core = core.replace(/([\w]+\s*=\s*[\w]+\s*\+\s*16\s*\|\s*0;\s*([\w=]+)\s*=\s*\+[\w\[\s*><\]]+;)/, '$1 $2*=0.75;');
    core = core.replace(
        /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i,
        '$1 window.viewScale=$2; if (window.coordOffsetFixed) { window.playerX=$4+window.offsetX; window.playerY=$5+window.offsetY;} if(window.draw){window.draw();}'
    );
    core = core.replace(
        /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\=\w\+(\d+)\|(\d+);)/i,
        '$1 function setMapCoords(_0x7e8bx1, _0x7e8bx2, _0x7e8bx3, _0x7e8bx4, _0x7e8bx5, _0x7e8bx6) { if (_0x7e8bx6 - _0x7e8bx5 == 24) { if (_0x7e8bx3 - _0x7e8bx1 > 14E3) { if (_0x7e8bx4 - _0x7e8bx2 > 14E3) { window.offsetX = 7071.067811865476 - _0x7e8bx3; window.offsetY = 7071.067811865476 - _0x7e8bx4; window.minX = _0x7e8bx1;window.minY=_0x7e8bx2;window.maxX=_0x7e8bx3;window.maxY=_0x7e8bx4; window.coordOffsetFixed = true; } } } } setMapCoords($3,$5,$7,$9,$2,$8);'
    );
    console.log('core_edited');
    return core;
}

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (/agario\.core\.js/i.test(node.src)) {
                observer.disconnect();
                node.parentNode.removeChild(node);
                let request = new XMLHttpRequest();
                request.open('get', node.src, true);
                request.send();
                request.onload = function () {
                    let coretext = this.responseText;
                    let newscript = document.createElement('script');
                    newscript.type = 'text/javascript';
                    newscript.async = true;
                    newscript.textContent = editCore(coretext);
                    document.body.appendChild(newscript);
                    setTimeout(() => {
                        loadBootsTrapCSS();
                        addListener();
                        loadGUI();
                    }, 3500);
                }
            }
        });
    });
});

observer.observe(document, { attributes: true, characterData: true, childList: true, subtree: true });

window.newBot = function (amount) {
    if (!window.client.ready) return;
    if (amount) {
        amount > 200 ? amount = 200 : amount = amount;
        for (let i = 0; i < amount; i++) {
            window.bots.push(new Bot(window.client.botID, `wss://${window.MC.getHost()}:443?party_id=${window.MC.getPartyToken()}`));
            window.client.botID++;
        }
    } else {
        window.bots.push(new Bot(window.client.botID, `wss://${window.MC.getHost()}:443?party_id=${window.MC.getPartyToken()}`));
        window.client.botID++;
    }
    $('#toggleButton').replaceWith(`<button id='toggleButton' onclick='window.stopBots();' class='btn btn-danger'>Stop Bots</button>`);
    window.client.startedBots = true;
}

window.stopBots = function () {
    if (!window.client.startedBots) return;
    window.bots.forEach(bot => {
        bot.ws.close();
    });
    console.log('[AgarUnlimited] Stopped bots!');
    window.client.startedBots = false;
    $('#toggleButton').replaceWith(`<button id='toggleButton' onclick="window.newBot(localStorage.getItem('botAmount'));" class='btn btn-success'>Start Bots</button>`);
}

class Bot {

    constructor(id, server) {
        this.botNick = localStorage.getItem('botNick');
        this.borders = new Object();
        this.protocolVersion = 22;
        this.nodes = new Array();
        this.node = new Object();
        this.protocolKey = 31002;
        this.encryptionKey = 0;
        this.decryptionKey = 0;
        this.serverIP = server;
        this.cellsIDs = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.id = id;
        this.connect(server);
    }

    connect(server) {
        this.ws = new WebSocket(server);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
    }

    onOpen() {
        console.log(`Bot_${this.id}: Connected`);

        let buf = this.Buffer(5);

        buf.setUint8(0, 254);
        buf.setUint32(1, this.protocolVersion, true);

        this.send(buf);

        buf = this.Buffer(5);
        buf.setUint8(0, 255);
        buf.setUint32(1, this.protocolKey, true);

        this.send(buf);
    }

    onClose() {
        console.log(`Bot_${this.id}: Disconnected (Closed)`);
        window.client.botID--;
    }

    onError() {
        console.log(`Bot_${this.id}: Disconnected (Error)`);
    }

    onMessage(msg) {
        let offset = 0;
        let oldMsg = msg.data;
        msg = this.Buffer(msg.data, true);

        if (this.decryptionKey) msg = this.xorBuffer(msg, this.decryptionKey ^ this.protocolKey);

        switch (msg.getUint8(offset++)) {

            case 241:
                this.decryptionKey = msg.getUint32(offset, true);
                oldMsg = Array.from(new Uint8Array(oldMsg)).splice(5, 11);
                this.encryptionKey = this.clientKey(this.serverIP, new Uint8Array(oldMsg));
                break;

            case 242:
                console.log(`Bot_${this.id}: Spawning`);
                window.agarApp.recaptcha.requestCaptchaV3('play', token => this.spawn(this.botNick + 'x', token));
                break;

            case 85:
                console.log(`Bot_${this.id}: Captcha failed Disconnecting...`);
                window.client.bots--;
                this.ws.close();
                break;

            case 32:
                this.cellsIDs.push(msg.getUint32(offset, true));
                console.log(`Bot_${this.id}: Spawned`);
                window.client.bots++;
                this.isAlive = true;
                break;

            case 255:
                let buf = msg.getUint32(1, true);
                let out = new Uint8Array(buf)
                out = this.decompressBuffer(new Uint8Array(msg.buffer.slice(5)), out);
                let data = new DataView(out.buffer);

                switch (data.getUint8(0)) {

                    case 16:
                        var off = 1;

                        let eatQueueLength = data.getUint16(off, true);
                        off += 2;

                        for (let i = 0; i < eatQueueLength; i++) off += 8;

                        while (true) {
                            this.node.id = data.getUint32(off, true);
                            off += 4;

                            if (this.node.id == 0) break;

                            this.node.x = data.getInt32(off, true);
                            off += 4;

                            this.node.y = data.getInt32(off, true);
                            off += 4;

                            this.node.size = data.getUint16(off, true);
                            off += 2;

                            this.node.flags = data.getUint8(off++);
                            this.node.extendedFlags = 0;

                            if (this.node.flags & 128) this.node.extendedFlags = data.getUint8(off++);
                            if (this.node.flags & 1) this.node.isVirus = true;
                            if (this.node.flags & 2) off += 3;
                            if (this.node.flags & 4) while (data.getInt8(off++) !== 0) { }
                            if (this.node.flags & 8) while (data.getInt8(off++) !== 0) { }
                            if (this.node.extendedFlags & 1) this.node.isFood = true;
                            if (this.node.extendedFlags & 4) off += 4;

                            this.nodes[this.node.id] = this.node;
                        }

                        let removeQueueLength = data.getUint16(off, true);

                        off += 2;

                        for (let i = 0; i < removeQueueLength; i++) {
                            let removedEntityID = data.getUint32(off, true);
                            off += 4;

                            if (this.nodes.hasOwnProperty(removedEntityID)) delete this.nodes[removedEntityID];
                            if (this.cellsIDs.includes(removedEntityID)) this.cellsIDs = this.cellsIDs.filter(x => x != removedEntityID);
                        }

                        if (this.isAlive && this.cellsIDs.length == 0) {
                            window.client.bots--;
                            this.isAlive = false;
                            window.agarApp.recaptcha.requestCaptchaV3('play', token => this.spawn(this.botNick + 'x', token));
                        }
                        break;

                    case 64:
                        off = 1;
                        this.borders.minX = data.getFloat64(off, true);
                        off += 8;
                        this.borders.minY = data.getFloat64(off, true);
                        off += 8;
                        this.borders.maxX = data.getFloat64(off, true);
                        off += 8;
                        this.borders.maxY = data.getFloat64(off, true);
                        if (this.borders.maxX - this.borders.minX > 14E3) this.offsetX = (this.borders.maxX + this.borders.minX) / 2;
                        if (this.borders.maxY - this.borders.minY > 14E3) this.offsetY = (this.borders.maxY + this.borders.minY) / 2;

                        if (this.isAlive && !window.client.collectPellets)
                            this.moveTo((window.client.clientX - window.innerWidth / 2) / window.viewScale + window.playerX, (window.client.clientY - window.innerHeight / 2) / window.viewScale + window.playerY);
                        break;
                }
                break;
        }
    }

    send(buf, runEncryption) {
        if (this.ws && this.ws.readyState == 1) {
            if (runEncryption) {
                buf = this.xorBuffer(buf, this.encryptionKey);
                this.encryptionKey = this.rotateKey(this.encryptionKey);
            }
            this.ws.send(buf);
        }
    }

    moveTo(x, y) {
        let buf = this.Buffer(13);
        buf.setUint8(0, 16);
        buf.setUint32(1, x + this.offsetX, true);
        buf.setUint32(5, y + this.offsetY, true);
        buf.setUint32(9, this.decryptionKey, true);
        this.send(buf, true);
    }

    spawn(name, token) {
        let buf = this.Buffer(2 + name.length + token.length);
        buf.setUint8(0, 0);
        for (let i = 0; i < name.length; i++) buf.setUint8(i + 1, name.charCodeAt(i));
        buf.setUint8(name.length, 0);
        for (let i = 0; i < token.length; i++) buf.setUint8(name.length + 1 + i, token.charCodeAt(i));
        this.send(buf, true);
    }

    split() {
        let buf = this.Buffer();
        buf.setUint8(0, 17);
        this.send(buf, true);
    }

    eject() {
        let buf = this.Buffer();
        buf.setUint8(0, 21);
        this.send(buf, true);
    }

    xorBuffer(buf, key) {
        for (let i = 0; i < buf.byteLength; i++) {
            buf.setUint8(i, buf.getUint8(i) ^ (key >> ((i % 4) * 8)) & 255);
        }
        return buf;
    }

    rotateKey(key) {
        key = Math.imul(key, 1540483477) >> 0;
        key = (Math.imul(key >>> 24 ^ key, 1540483477) >> 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, 1540483477) >> 0;
        return key >>> 15 ^ key;
    }

    Buffer(buf, msg) {
        if (msg) {
            buf = new Uint8Array(buf);
            let fixedbuffer = new DataView(new ArrayBuffer(buf.byteLength));
            for (let i = 0; i < buf.byteLength; i++) {
                fixedbuffer.setUint8(i, buf[i]);
            }
            return fixedbuffer;
        }
        return new DataView(new ArrayBuffer(!buf ? 1 : buf));
    }

    decompressBuffer(input, output) {
        for (let i = 0, j = 0; i < input.length;) {
            const byte = input[i++]
            let literalsLength = byte >> 4
            if (literalsLength > 0) {
                let length = literalsLength + 240
                while (length === 255) {
                    length = input[i++]
                    literalsLength += length
                }
                const end = i + literalsLength
                while (i < end) output[j++] = input[i++]
                if (i === input.length) return output
            }
            const offset = input[i++] | (input[i++] << 8)
            if (offset === 0 || offset > j) return -(i - 2)
            let matchLength = byte & 15
            let length = matchLength + 240
            while (length === 255) {
                length = input[i++]
                matchLength += length
            }
            let pos = j - offset
            const end = j + matchLength + 4
            while (j < end) output[j++] = output[pos++]
        }
        return output
    }

    clientKey(ip, buf) {
        for (var e = null, p = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2], s = p.length + buf.byteLength, o = new Uint8Array(s), a = 0; a < p.length; a++)
            o[a] = p.charCodeAt(a);
        o.set(buf, p.length);
        for (var m = new DataView(o.buffer), r = s - 1, g = 0 | 4 + (-4 & r - 4), h = 255 ^ r, f = 0; 3 < r;)
            e = 0 | Math.imul(m.getInt32(f, !0), 1540483477), h = (0 | Math.imul(e >>> 24 ^ e, 1540483477)) ^ (0 | Math.imul(h, 1540483477)), r -= 4, f += 4;
        switch (r) {
            case 3:
                h = o[g + 2] << 16 ^ h, h = o[g + 1] << 8 ^ h;
                break;
            case 2:
                h = o[g + 1] << 8 ^ h;
                break;
            case 1:
                break;
            default:
                e = h;
        }
        e != h && (e = 0 | Math.imul(o[g] ^ h, 1540483477)), e ^= h = e >>> 13, e = 0 | Math.imul(e, 1540483477), e ^= h = e >>> 15;
        return e;
    }
}

document.addEventListener('keydown', event => {
    let key = String.fromCharCode(event.keyCode);
    if (key == 'X') {
        if (bots.length > 0 && window.client.startedBots) {
            bots.forEach(bot => bot.split());
        }
    }
    else if (key == 'C') {
        if (bots.length > 0 && window.client.startedBots) {
            bots.forEach(bot => bot.eject());
        }
    }
    else if (key == 'P') {
        window.client.collectPellets = !window.client.collectPellets;
        console.log(`Collect Pellets: ${window.client.collectPellets}`);
    }
});
