// ==UserScript==
// @name         Instagram Video Controls
// @namespace    instagram_video
// @version      0.2.6
// @description  Adds standart video controls for video in Instagram
// @homepageURL  https://github.com/Sarayalth/instagram-video-controls
// @supportURL   https://github.com/Sarayalth/instagram-video-controls/issues
// @downloadURL  https://raw.githubusercontent.com/Sarayalth/instagram-video-controls/master/instagram-video-controls.user.js
// @updateURL    https://raw.githubusercontent.com/Sarayalth/instagram-video-controls/master/instagram-video-controls.user.js
// @author       0xC0FFEEC0DE, sarayalth
// @match        https://*.instagram.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let videoObserver = new MutationObserver(function(mutations) {
        mutations = Array.from(mutations);

        function videoClassCount(removedNodes) {
            return Array.from(removedNodes)
                .filter(node => node.classList && node.classList.contains('_ab1e')).length;  //img._ab1e = thumbnail
        }

        // Check for the play button to be removed, i.e. the video is being played
        let videoMutations = mutations
            .filter(m => m.removedNodes && videoClassCount(m.removedNodes) > 0);
        if(videoMutations.length === 0) return;

        videoMutations.forEach(m => {
            // The <video/> element should be before the removed button
            var video = m.previousSibling;
            if (video && video.tagName && video.tagName.toLowerCase() == 'video') {
                if (!video.controls) {

                    // Add native video controls
                    video.controls = 'controls';

                    // Remove overlay and volume button
                    let article = video.closest('article');
                    console.log(article);
                    article.querySelectorAll('._aakh, ._aakl, ._ab8k._ab8v._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abam._abbk._ab9y._aba8').forEach(trash => {
                        trash.remove();
                    });

                    // Move tags to upper corner
                    article.querySelectorAll('._a9-5._a9-6._a9-7').forEach(tags => {
                        tags.style.bottom = "auto";
                        tags.style.top = "0";
                    });

                    // Keep volume value in localStorage
                    video.volume = localStorage.getItem('video_volume') || 1;
                    video.onvolumechange = (event) => {
                        localStorage.setItem('video_volume', event.target.volume);
                    };
                }

                if (!video.loop) {
                    video.loop = true;
                }
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();
