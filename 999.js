// 1. Trigger the initial dialog box
Dialog.alert('[](){}!');

try {
  // 2. STRICTOR DOM TARGETING (Scoped exclusively to the generated window)
  const d = document;
  
  // First, isolate the unique text marker
  const alertElement = Array.from(d.querySelectorAll('div')).find(
    el => el.className.includes('alert_text') && el.textContent.trim() === '[](){}!'
  );
  
  // Find the window container containing *only* this specific text element
  const windowContainer = alertElement ? alertElement.closest('.window') : null;
  
  // Scope the header selection exclusively to this window container (not the global document)
  const headerElement = windowContainer ? windowContainer.querySelector('.window_header') : null;
  
  // Keep background page content untouched
  const contentContainer = d.getElementById('content');

  // --- SAVE THE FORMER TITLE ---
  const originalTitle = d.title;

  // --- SEAMLESS AUDIO ENGINE ---
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  let activeOsc1 = null;
  let activeOsc2 = null;
  let mainGain = null;
  let staticNode = null;

  function playLowFrequencyStatic() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    staticNode = audioCtx.createBufferSource();
    staticNode.buffer = noiseBuffer;
    staticNode.loop = true;

    const lowPassFilter = audioCtx.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.setValueAtTime(70, audioCtx.currentTime);
    lowPassFilter.Q.setValueAtTime(1.0, audioCtx.currentTime);

    const staticGain = audioCtx.createGain();
    staticGain.gain.setValueAtTime(3.0, audioCtx.currentTime);

    staticNode.connect(lowPassFilter);
    lowPassFilter.connect(staticGain);
    staticGain.connect(audioCtx.destination);

    staticNode.start(0);
  }

  function playSeamlessGlitchTrack() {
    const now = audioCtx.currentTime;
    
    activeOsc1 = audioCtx.createOscillator();
    activeOsc2 = audioCtx.createOscillator();
    mainGain = audioCtx.createGain();

    activeOsc1.type = 'sine';
    activeOsc2.type = 'sine';

    activeOsc1.frequency.setValueAtTime(697, now);
    if (activeOsc2.frequency.setValueAtTime) {
      activeOsc2.frequency.setValueAtTime(1209, now);
    } else {
      activeOsc2.frequency.value = 1209;
    }

    mainGain.gain.setValueAtTime(0.07, now);
    mainGain.gain.exponentialRampToValueAtTime(9.0, now + 3.3);

    for (let i = 0; i <= 330; i++) {
      const timeOffset = i * 0.01;
      if (Math.random() < 0.55) {
        const randomFreq1 = [697, 770, 852, 941][Math.floor(Math.random() * 4)];
        const randomFreq2 = [1209, 1336, 1477][Math.floor(Math.random() * 3)];
        activeOsc1.frequency.setValueAtTime(randomFreq1, now + timeOffset);
        activeOsc2.frequency.setValueAtTime(randomFreq2, now + timeOffset);
      }
    }

    activeOsc1.connect(mainGain);
    activeOsc2.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    activeOsc1.start(now);
    activeOsc2.start(now);
    
    activeOsc1.stop(now + 3.3);
    activeOsc2.stop(now + 3.3);
  }

  function playBoomSound() {
    const now = audioCtx.currentTime;
    const gainNode = audioCtx.createGain();
    
    const oscLayers = [
      audioCtx.createOscillator(),
      audioCtx.createOscillator(),
      audioCtx.createOscillator()
    ];

    oscLayers.forEach(osc => {
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(50, now);
      osc.frequency.exponentialRampToValueAtTime(0.001, now + 3.0);
      osc.connect(gainNode);
    });

    gainNode.gain.setValueAtTime(6.0, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    gainNode.connect(audioCtx.destination);

    oscLayers.forEach(osc => {
      osc.start(now);
      osc.stop(now + 3.0);
    });
  }

  // --- INJECT CUSTOM CSS FOR THE HYPER-SLOWOUT OUTRO ---
  const style = d.createElement('style');
  style.textContent = `
    @keyframes eventBoomSlow {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(2.5); filter: blur(0px); }
      75% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.2); filter: blur(1px); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); filter: blur(12px); }
    }
    .event-999-overlay {
      position: fixed; top: 50%; left: 50%;
      font-family: 'Courier New', monospace; font-weight: bold; font-size: 5rem;
      letter-spacing: 8px; z-index: 99999; pointer-events: none;
      animation: eventBoomSlow 3.0s cubic-bezier(0.05, 0.9, 0.2, 1) forwards;
    }
  `;
  d.head.appendChild(style);

  if (alertElement) {
    // 3. Phase 1: Immediate Text Overwrite
    playLowFrequencyStatic();
    alertElement.textContent = 'ERROR: Uncaught SyntaxError: Unexpected identifier \'999\' (at VM9999 :9:99)';
    
    // --- OBLITERATE X AND OK BUTTONS ONLY INSIDE THIS SPECIFIC WINDOW ---
    if (windowContainer) {
      windowContainer.style.transition = 'transform 0.01s linear';
      
      const elementsToRemove = windowContainer.querySelectorAll(
        'button, .window_close, .window_btn, .btn, [class*="close"], [class*="btn"], [class*="button"]'
      );
      elementsToRemove.forEach(el => el.remove());
    }

    // Phase 2: Wait 3 seconds before initiating chaos
    setTimeout(() => {
      if (audioCtx.state === 'suspended') audioCtx.resume();

      playSeamlessGlitchTrack();

      const totalTicks = 300; 
      let currentTick = 0;
      let freezeTicks = 0; 
      
      let frozenTransform = '';
      let frozenText = '';
      let frozenTitle = '';

      const chaosInterval = setInterval(() => {
        const now = audioCtx.currentTime;

        // --- DMTF "6" REALISTIC CRASH INTERCEPT ---
        if (currentTick === 270 && freezeTicks < 30) {
          
          if (freezeTicks === 0) {
            if (activeOsc1 && activeOsc2) {
              activeOsc1.frequency.cancelScheduledValues(now);
              activeOsc2.frequency.cancelScheduledValues(now);
              activeOsc1.frequency.setValueAtTime(770, now);
              activeOsc2.frequency.setValueAtTime(1477, now);
            }
            
            if (windowContainer) {
              frozenTransform = windowContainer.style.transform || `translate(180px, -100px) skew(45deg) rotate(-25deg)`;
            }
            frozenText = alertElement.textContent;
            frozenTitle = d.title;
          }
          
          freezeTicks++;

          if (mainGain) {
            if (freezeTicks % 2 === 0) {
              mainGain.gain.setValueAtTime(1.0, now); 
            } else {
              mainGain.gain.setValueAtTime(0.001, now); 
            }
          }

          if (windowContainer) {
            windowContainer.style.transform = frozenTransform;
          }
          alertElement.textContent = frozenText;
          d.title = frozenTitle;
          
          return; 
        }

        // Phase 3: 3-second mark reached -> Obliterate and Reset
        if (currentTick >= totalTicks) {
          clearInterval(chaosInterval);
          
          if (staticNode) {
            try { staticNode.stop(); } catch(e) {}
          }
          
          let spawnX = window.innerWidth / 2;
          let spawnY = window.innerHeight / 2;
          
          // Removes only the targeted window box
          if (windowContainer) {
            const rect = windowContainer.getBoundingClientRect();
            spawnX = rect.left + rect.width / 2;
            spawnY = rect.top + rect.height / 2;
            windowContainer.remove();
          } else {
            alertElement.remove();
            if (headerElement) headerElement.remove();
          }

          if (contentContainer) {
            contentContainer.style.filter = 'none';
          }

          playBoomSound();

          d.title = "THE EVENT BEGINS";

          const overlay = d.createElement('div');
          overlay.className = 'event-999-overlay';
          d.body.appendChild(overlay);

          let outroFrame = 0;
          const originalOverlayText = '999 EVENT...';

          const outroRenderInterval = setInterval(() => {
            if (!d.body.contains(overlay)) {
              clearInterval(outroRenderInterval);
              return;
            }

            outroFrame++;

            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            overlay.style.color = `rgb(${r}, ${g}, ${b})`;
            overlay.style.textShadow = `0 0 20px rgb(${r}, ${g}, ${b})`;

            let textArr = originalOverlayText.split('');
            for (let i = 0; i < textArr.length; i++) {
              if (Math.random() < 0.15) {
                textArr[i] = ['9', '6', 'X', '?', '#', '§', 'Δ'][Math.floor(Math.random() * 7)];
              }
            }
            overlay.textContent = textArr.join('');

            const overlayShakeX = spawnX + ((Math.random() - 0.5) * 15);
            const overlayShakeY = spawnY + ((Math.random() - 0.5) * 15);
            overlay.style.left = `${overlayShakeX}px`;
            overlay.style.top = `${overlayShakeY}px`;

          }, 16); 

          setTimeout(() => {
            clearInterval(outroRenderInterval);
            overlay.remove();
            d.title = originalTitle; 
          }, 3000);
          return;
        }

        currentTick++;
        const progression = currentTick / totalTicks;
        
        if (contentContainer) {
          const targetContrast = 100 + (Math.pow(progression, 2) * 900);
          contentContainer.style.filter = `contrast(${targetContrast}%)`;
        }

        let currentText = alertElement.textContent;
        let currentLength = currentText.length;

        if (currentLength > 0) {
          if (Math.random() < 0.7 && currentLength > 40) {
            currentText = currentText.slice(0, -1);
            currentLength--;
          }

          if (Math.random() < 0.95) {
            const randomIndex = Math.floor(Math.random() * currentLength);
            currentText = currentText.substring(0, randomIndex) + '999 ' + currentText.substring(randomIndex + 1);
          }

          const glitchedText = currentText.substring(0, 99);
          alertElement.textContent = glitchedText;
          
          if (Math.random() < 0.8) {
            d.title = glitchedText.substring(0, 25) + '...';
          }
        }
        // update 5353
        // --- EXCLUSIVE MATRIX TRANSFORM SHAKE (Only hits this specific window layout) ---
        if (windowContainer) {
          const severity = currentTick * 2.2;
          const xShift = (Math.random() - 0.5) * severity;
          const yShift = (Math.random() - 0.5) * severity;
          const skewDeg = (Math.random() - 0.5) * (severity * 0.35);
          const rotDeg = (Math.random() - 0.5) * (severity * 0.25);

          windowContainer.style.transform = `translate(${xShift}px, ${yShift}px) skew(${skewDeg}deg) rotate(${rotDeg}deg)`;
        }
      }, 10);
    }, 3000);
  }
} catch (error) {
  console.error('Glitch script error:', error);
}
