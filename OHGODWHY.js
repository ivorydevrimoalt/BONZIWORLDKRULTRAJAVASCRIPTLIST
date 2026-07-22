(function() {
    'use strict';

    // --- Configuration & Date Setup ---
    const now = new Date();
    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const monthNamesCapitalized = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const currentMonthUpper = months[now.getMonth()];
    const currentMonthCap = monthNamesCapitalized[now.getMonth()];

    // --- 1. Video & Text Overlay Component ---
    function initVideoOverlay() {
        const container = document.createElement('div');
        container.id = 'fools-overlay-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;

        // Create Video Element with the explicit raw GitHub repository URL
        const video = document.createElement('video');
        video.src = 'https://raw.githubusercontent.com/ivorydevrimoalt/BONZIWORLDKRULTRAJAVASCRIPTLIST/refs/heads/main/0723.mp4';
        video.autoplay = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;

        // Create Text Element
        const textElement = document.createElement('div');
        textElement.id = 'fools-text-spawn';
        textElement.style.cssText = `
            position: absolute;
            font-size: 5rem;
            font-weight: 900;
            font-family: monospace;
            color: white;
            text-shadow: 0 0 20px rgba(0,0,0,0.8);
            display: none;
            z-index: 1000000;
            pointer-events: none;
        `;
        textElement.textContent = `${currentMonthUpper} FOOLS`;

        container.appendChild(video);
        container.appendChild(textElement);
        document.body.appendChild(container);

        // Timing Triggers
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;

            // Spawn text at 0.383 seconds
            if (currentTime >= 0.1 && currentTime < 0.783) {
                textElement.style.display = 'block';
            }

            // Flash colors at 0.783 seconds
            if (currentTime >= 0.783 && currentTime < 1.0) {
                const colors = ['#ff0055', '#00ffcc', '#ffff00', '#ff00ff', '#00ffff'];
                textElement.style.color = colors[Math.floor(Math.random() * colors.length)];
                textElement.style.transform = `scale(${1 + Math.random() * 0.2}) rotate(${(Math.random() - 0.5) * 10}deg)`;
            }

            // Remove video and text at 2 seconds
            if (currentTime >= 2.0) {
                container.remove();
            }
        });

        // Fallback safety removal if video finishes early
        video.addEventListener('ended', () => {
            if (document.body.contains(container)) container.remove();
        });
        
        video.addEventListener('error', () => {
            console.warn("0723.mp4 failed to load from GitHub raw link, cleaning up overlay.");
            if (document.body.contains(container)) container.remove();
        });
    }

    // --- 2. Countdown Banner Component ---
    function initCountdown() {
        let timeLeft = 15;
        const banner = document.createElement('div');
        banner.id = 'fools-countdown-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #ff0055, #7700ff);
            color: #ffffff;
            text-align: center;
            font-family: monospace;
            font-weight: bold;
            font-size: 1.1rem;
            padding: 8px 0;
            z-index: 999998;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            letter-spacing: 1px;
        `;

        function updateCountdownText() {
            if (timeLeft > 0) {
                banner.textContent = `${currentMonthCap} FOOLS IS ABOUT TO END IN ${timeLeft} SECONDS`;
                timeLeft--;
            } else {
                banner.textContent = `${currentMonthCap} FOOLS HAS OFFICIALLY CONQUERED REALITY! :3`;
                clearInterval(timerInterval);
                
                // Revert everything back to normal when countdown finishes
                setTimeout(() => {
                    banner.remove();
                    location.reload();
                }, 2000);
            }
        }

        updateCountdownText();
        document.body.appendChild(banner);
        const timerInterval = setInterval(updateCountdownText, 1000);
    }

    // --- 3. Dreadified / OwO / Quirk Text Engine ---
    const processedNodes = new WeakSet();

    function dreadifyText(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) return text;
        if (text.includes(':3') || text.includes('|-|3')) return text; // Prevent double mutation loops

        const quirkType = Math.floor(Math.random() * 4);
        
        let mutated = text
            .replace(/[rl]/g, 'w')
            .replace(/[RL]/g, 'W')
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/N([AEIOU])/g, 'Ny$1')
            .replace(/ove/g, 'uv');

        if (quirkType === 0) {
            mutated = mutated
                .replace(/h/gi, '|-|')
                .replace(/e/gi, '3')
                .replace(/l/gi, '|_')
                .replace(/o/gi, '0');
        } else if (quirkType === 1) {
            mutated = mutated
                .replace(/o/gi, 'oooo00')
                .replace(/e/gi, '33') + ' :3 /:>/ ;v;';
        } else if (quirkType === 2) {
            mutated = mutated.split('').map(char => {
                return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
            }).join('') + " 'u' /ᐠ｡ꞈ｡ᐟ\\";
        } else {
            mutated += ' ~uwu~ ✨';
        }

        return mutated;
    }

    function processTextNode(node) {
        if (processedNodes.has(node)) return;
        const originalText = node.nodeValue;
        const transformed = dreadifyText(originalText);
        if (originalText !== transformed) {
            node.nodeValue = transformed;
            processedNodes.add(node);
        }
    }

    function walkDOM(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                const parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tagName = parent.tagName ? parent.tagName.toLowerCase() : '';
                if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.id === 'fools-countdown-banner' || parent.id === 'fools-text-spawn') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let node;
        while (node = walker.nextNode()) {
            processTextNode(node);
        }
    }

    // --- 4. Continuous Mutation Observer & Title Watcher ---
    function initMutationEngine() {
        walkDOM(document.body);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            processTextNode(node);
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            walkDOM(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    processTextNode(mutation.target);
                }
            }

            if (document.title && !document.title.includes(':3') && !document.title.includes('~uwu~')) {
                document.title = dreadifyText(document.title);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // --- Execution Bootstrap ---
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            initVideoOverlay();
            initCountdown();
            initMutationEngine();
        });
    } else {
        initVideoOverlay();
        initCountdown();
        initMutationEngine();
    }

})();
