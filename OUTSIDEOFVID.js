(function() {
    // 1. Create the video element
    const video = document.createElement('video');
    video.src = 'https://github.com/ivorydevrimoalt/BONZIWORLDKRULTRAJAVASCRIPTLIST/raw/refs/heads/main/transparent_greenscreen_with_audio%20(1).webm';
    
    // 2. Apply styles for "Fake" Fullscreen and RGBA transparency support
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'cover'; // Ensures it covers the screen without distortion
    video.style.zIndex = '999999';   // Keeps it on top of all other elements
    video.style.pointerEvents = 'none'; // Allows clicks to pass through the video to elements beneath it (optional)
    video.style.background = 'transparent';

    // Attributes for autoplay and inline playback on mobile/desktop
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = false; // Set to true if browser autoplay policies block unmuted audio

    // 3. Append to body immediately (hidden or loading)
    document.body.appendChild(video);

    // 4. Wait until the video is fully loaded/buffered, then play
    video.addEventListener('canplaythrough', function() {
        video.play().catch(error => {
            console.warn("Autoplay blocked by browser policy. User interaction may be required:", error);
            // Fallback: mute and play if autoplay fails due to audio policies
            video.muted = true;
            video.play();
        });
    }, { once: true });

    // 5. Clean up element once the video finishes playing
    video.addEventListener('ended', function() {
        video.remove();
    });

    // Optional: Handle window resizing dynamically
    window.addEventListener('resize', function() {
        video.style.width = window.innerWidth + 'px';
        video.style.height = window.innerHeight + 'px';
    });
})();
