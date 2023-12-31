window.addEventListener('load', () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    canvas.width = 600;
    canvas.height = 600;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 50;
        ctx.lineCap = "round";

        const touchEvent = e.type === "touchmove" || e.type === "touchstart" || e.type === "touchend";
        const x = touchEvent ? e.touches[0].clientX : e.clientX;
        const y = touchEvent ? e.touches[0].clientY : e.clientY;

        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;

        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY);
        e.preventDefault();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        const predictionResultElement = document.querySelector("#prediction_result");
        predictionResultElement.textContent = "-";
    }

    // EventListeners for both mouse and touch events
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", finishedPosition);
    canvas.addEventListener("touchmove", draw);

    const clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", clearCanvas);
});
