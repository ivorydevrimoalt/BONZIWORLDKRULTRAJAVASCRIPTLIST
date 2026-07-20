(async function runPowerPointCubeTransition() {
  // Direct raw GitHub URL (bypasses 302 redirects)
  const VIDEO_URL = "https://raw.githubusercontent.com/ivorydevrimoalt/BONZIWORLDKRULTRAJAVASCRIPTLIST/main/set.bitrate.b76be301.mp4";

  // Helper to dynamically load html2canvas if missing
  const loadHtml2Canvas = () => {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve(window.html2canvas);
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = () => resolve(window.html2canvas);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  try {
    const html2canvas = await loadHtml2Canvas();

    // 1. Prepare video element (removed crossOrigin to allow normal cross-origin playback)
    const video = document.createElement("video");
    video.src = VIDEO_URL;
    video.playsInline = true;
    video.autoplay = true;
    Object.assign(video.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    });

    // 2. Take full screenshot of current page
    const canvas = await html2canvas(document.body, {
      logging: false,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      width: window.innerWidth,
      height: window.innerHeight
    });

    const w = window.innerWidth;
    const halfW = w / 2;

    // 3. Create full-screen 3D Stage Overlay
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "99999999",
      backgroundColor: "#000",
      perspective: "1200px",
      overflow: "hidden"
    });

    // 4. Create 3D Cube Container
    const cube = document.createElement("div");
    Object.assign(cube.style, {
      width: "100%",
      height: "100%",
      position: "relative",
      transformStyle: "preserve-3d",
      transform: `translateZ(-${halfW}px) rotateY(0deg)`,
      transition: "transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
    });

    const faceBaseStyle = {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      backfaceVisibility: "hidden"
    };

    // Front Face (Screenshot)
    const frontFace = document.createElement("div");
    Object.assign(frontFace.style, faceBaseStyle, {
      backgroundImage: `url(${canvas.toDataURL("image/png")})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transform: `rotateY(0deg) translateZ(${halfW}px)`
    });

    // Right Face (Video)
    const rightFace = document.createElement("div");
    Object.assign(rightFace.style, faceBaseStyle, {
      backgroundColor: "#000",
      transform: `rotateY(90deg) translateZ(${halfW}px)`
    });
    rightFace.appendChild(video);

    cube.appendChild(frontFace);
    cube.appendChild(rightFace);
    overlay.appendChild(cube);
    document.body.appendChild(overlay);

    // Force browser reflow
    cube.offsetHeight;

    // 5. Trigger PowerPoint Cube Rotation
    cube.style.transform = `translateZ(-${halfW}px) rotateY(-90deg)`;

    // Play video during rotation
    video.play().catch(err => console.warn("Playback error:", err));

    // 6. Handle video end -> Black screen for 1 second -> Restoration
    video.addEventListener("ended", () => {
      cube.style.display = "none";
      overlay.style.backgroundColor = "#000";

      setTimeout(() => {
        overlay.remove();
      }, 1000);
    });

  } catch (error) {
    console.error("Cube transition error:", error);
  }
})();
