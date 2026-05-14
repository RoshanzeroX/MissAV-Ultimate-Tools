// ==UserScript==
// @name         MissAV - FullScreen & Background Play (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Force video background play and bypass visibility restrictions.
// @author       Gemini
// @license      MIT
// @match        *://missav123.com/*
// @match        *://missav.com/*
// @match        *://*.fourhoi.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const forceVisible = () => {
        Object.defineProperties(document, {
            'visibilityState': { value: 'visible', configurable: false, writable: false },
            'webkitVisibilityState': { value: 'visible', configurable: false, writable: false },
            'hidden': { value: false, configurable: false, writable: false },
            'webkitHidden': { value: false, configurable: false, writable: false }
        });
    };
    forceVisible();

    const originalPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function() {
        if (this.ended || this.seeking) {
            return originalPause.call(this);
        }
        return Promise.resolve();
    };

    window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
    window.addEventListener('focusout', (e) => e.stopImmediatePropagation(), true);
    document.hasFocus = () => true;

    setInterval(() => {
        const player = document.querySelector('video.player') || document.querySelector('video');
        if (player && player.paused && !player.ended && !player.seeking) {
            player.play().catch(() => {
                player.muted = true;
                player.play();
            });
        }
    }, 250);

    const keepAlive = () => {
        const bc = new BroadcastChannel('immortal_tab');
        bc.postMessage('stay_awake');
    };
    setInterval(keepAlive, 1000);

})();
