window.addEventListener('load', () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    canvas.width = 600;
    canvas.height = 600;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Variables
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
        ctx.strokeStyle = "black"; // Set ink color to black
        ctx.lineWidth = 50;
        ctx.lineCap = "round";

        // Adjust the mouse coordinates to match the canvas coordinates
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function clearCanvas() {
        console.log("clearing canvas");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Set background to white again after clearing
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black"; // Set ink color back to black
    }

    // EventListeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    const clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", clearCanvas);
})
