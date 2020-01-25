// ==UserScript==
// @name         AgarUnlimited
// @version      3.0.0
// @description  AgarUnlimited Revive by Neon
// @author       Neon - Sizrex - MrSonicMaster - NuclearC - StrikerJS
// @match        *://agar.io/*
// @grant        none
// @run-at       document-start
// @icon         data:image/png;base64,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
// @require      https://github.com/Neonx99/agar.io-bots-extension/raw/master/au.js
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
