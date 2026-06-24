(function() {
    // 1. Target Ivorydevrimo or create it if missing
    const allBonzis = document.querySelectorAll('.bonzi');
    let target = null;
    
    allBonzis.forEach(el => {
        const nameEl = el.querySelector('.bonzi_name');
        if (nameEl && nameEl.textContent.includes('Ivorydevrimo')) {
            target = el;
        }
    });

    if (!target) {
        target = document.createElement('div');
        target.className = 'bonzi';
        target.id = 'dynamic_ivory';
        target.style.position = 'absolute';
        target.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        target.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        target.style.zIndex = '9999'; 
        target.style.backgroundImage = 'url("img/bonzi/black.webp")';
        target.style.width = '100px'; 
        target.style.height = '100px';
        
        target.innerHTML = `
            <div class="bonzi_hat"></div>
            <div class="bonzi_name">Ivorydevrimo #RAS4</div>
            <div class="bonzi_tag"></div>
            <div class="bubble bubble-right" hidden style="transition: opacity 0.35s; opacity: 0;">
                <div class="bubble_cont"></div>
            </div>
        `;
        document.body.appendChild(target);
    }

    const nameTextElement = target.querySelector('.bonzi_name');
    const content = document.getElementById('content') || document.body;

    const originalTop = parseFloat(target.style.top) || target.offsetTop || 0;
    const originalBg = document.body.style.background || '';

    // 2. Setup styles for seamless shaking (no bounding box borders)
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        @keyframes custom-shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            20% { transform: translate(-8px, 8px) rotate(-1deg); }
            40% { transform: translate(-12px, -4px) rotate(1deg); }
            60% { transform: translate(12px, 8px) rotate(-0.5deg); }
            80% { transform: translate(-8px, -12px) rotate(0.8deg); }
            100% { transform: translate(8px, 4px) rotate(0deg); }
        }
        @keyframes wavy-distort {
            0% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
            50% { transform: perspective(500px) rotateX(4deg) rotateY(-2deg) scale(1.02); }
            100% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
        }
        .text-glow {
            text-shadow: 0 0 8px #ff0000, 0 0 15px #ff0000;
            display: inline-block;
            transform: scaleY(2); 
            color: #fff;
        }
        .content-chaotic {
            transform-origin: center;
            display: block;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            border: none !important; /* Strips any structural borders */
            outline: none !important;
            box-shadow: none !important;
            overflow: hidden; /* Seamless frame bounds */
            will-change: filter, transform;
        }
        .bonzi {
            will-change: transform, filter, top;
        }
    `;
    document.head.appendChild(styleEl);

    // 3. Audio Setup
    const audio = new Audio('https://github.com/ivorydevrimoalt/BONZIWORLDKRULTRAJAVASCRIPTLIST/raw/refs/heads/main/whistlesssssssssssss.wav');
    audio.play().catch(() => console.log("Audio waiting for interaction."));

    // 4. Instant Black BG Payload Trigger
    document.body.style.background = '#000000'; 
    content.classList.add('content-chaotic');

    // 5. Framerate Control Variables (2.8 FPS Target)
    let animationFrameId;
    let isRunning = true;
    const globalStartTime = performance.now();
    const totalDuration = 37756; 
    
    const fpsTarget = 2.8;
    const fpsInterval = 1000 / fpsTarget; // ~357.14ms per frame update
    let lastFrameTime = globalStartTime;

    function updateChaos(currentTime) {
        if (!isRunning) return;

        // Force frame calculation to drop down to 2.8 updates per second
        const elapsedSinceLastFrame = currentTime - lastFrameTime;
        if (elapsedSinceLastFrame < fpsInterval) {
            animationFrameId = requestAnimationFrame(updateChaos);
            return;
        }
        
        // Update the frame tracker timestamp
        lastFrameTime = currentTime - (elapsedSinceLastFrame % fpsInterval);

        const elapsed = currentTime - globalStartTime;

        if (elapsed >= totalDuration) {
            resetEnvironment();
            return;
        }

        const isPast5Sec = elapsed >= 5000;
        const isPast23Sec = elapsed >= 23000; // Trigger shifted to 23s
        const isPast30Sec = elapsed >= 30000;

        // Bonzi Darkness Tween (0s to 5s targets 90% dark smoothly)
        let currentBrightness = 1.0;
        if (elapsed < 5000) {
            currentBrightness = 1.0 - (0.9 * (elapsed / 5000));
        } else {
            currentBrightness = 0.1; 
        }

        // Exponential Progression Multipliers
        let progress = 0;
        let expoFactor = 0;
        if (isPast5Sec) {
            progress = (elapsed - 5000) / (totalDuration - 5000);
            expoFactor = Math.pow(progress, 3); 
        }

        // Modest Y-Axis Stretching Core
        let currentScaleY = 1;
        let currentTopOffset = 0;

        if (isPast5Sec) {
            currentScaleY = 1 + (expoFactor * 3.5); 
            const initialHeight = 100;
            const pixelsSized = (initialHeight * currentScaleY) - initialHeight;
            currentTopOffset = pixelsSized; 
        }

        target.style.transform = `scaleY(${currentScaleY})`;
        target.style.top = `${originalTop - currentTopOffset}px`;
        target.style.filter = `brightness(${currentBrightness})`;

        // Text Milestone Update (30s)
        if (isPast30Sec && nameTextElement && nameTextElement.textContent !== "תֵשַׁע") {
            nameTextElement.textContent = "תֵשַׁע";
            nameTextElement.classList.add('text-glow');
        }

        // Seamless Canvas Filters and Distortions
        if (isPast5Sec) {
            const grayscaleVal = expoFactor * 100; 
            const contrastVal = 100 + (expoFactor * 350); 
            const speedHz = 0.2 + (expoFactor * 15); 

            content.style.filter = `grayscale(${grayscaleVal}%) contrast(${contrastVal}%)`;
            
            // Seamless mixing rules: switches animations dynamically without adding element boxes
            if (isPast23Sec) {
                content.style.animation = `custom-shake ${1 / speedHz}s infinite linear, wavy-distort ${2 / speedHz}s infinite ease-in-out`;
            } else {
                content.style.animation = `wavy-distort ${2 / speedHz}s infinite ease-in-out`;
            }
        }

        animationFrameId = requestAnimationFrame(updateChaos);
    }

    // Start running the simulation loop
    animationFrameId = requestAnimationFrame(updateChaos);

    // 6. Hard Absolute Master Reset Clock
    setTimeout(() => {
        resetEnvironment();
    }, totalDuration);

    function resetEnvironment() {
        if (!isRunning) return;
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
        
        if (nameTextElement) {
            nameTextElement.textContent = "Ivorydevrimo #RAS4";
            nameTextElement.classList.remove('text-glow');
        }
        
        content.classList.remove('content-chaotic');
        document.body.style.background = originalBg;
        
        target.style.transform = '';
        target.style.filter = '';
        target.style.top = `${originalTop}px`;
        content.style.filter = '';
        content.style.animation = '';
        
        audio.pause();
        styleEl.remove();
        
        console.log("Timeline sequence concluded. Framerate unlocked.");
    }
})();
