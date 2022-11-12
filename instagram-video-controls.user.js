// ==UserScript==
// @name         Instagram Video Controls
// @namespace    instagram_video
// @version      0.2.7
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
            var videoCount = Array.from(removedNodes).filter(node => node.classList && node.classList.contains('x10l6tqk')).length;
            //console.log(removedNodes)
            //console.log(videoCount)
            return videoCount
        }

        // Check for the play button to be removed, i.e. the video is being played
        let videoMutations = mutations.filter(m => m.removedNodes && videoClassCount(m.removedNodes) > 0);
        if(videoMutations.length === 0) return;
        //console.log("brrrr")

        videoMutations.forEach(m => {
            // The <video/> element should be before the removed button
            var videoParent = m.target.closest('.xh8yej3.x1uhb9sk.x5yr21d');
            var video = videoParent.querySelector('video')
            if (video && video.tagName && video.tagName.toLowerCase() == 'video') {
                if (!video.controls) {

                    // Add native video controls
                    video.controls = 'controls';

                    // Move tags to upper corner
                    videoParent.querySelectorAll('._a9-5._a9-6._a9-7').forEach(tags => {
                        videoParent.appendChild(tags);
                        tags.style.bottom = "auto";
                        tags.style.top = "0";
                    });

                    // Remove overlay and volume button
                    videoParent.querySelectorAll('[data-instancekey]').forEach(trash => {
                        trash.remove();
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
