function canvasToBase64() {
    const canvas = document.querySelector("#canvas");
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

function sendImageToBackend(base64Image) {
    fetch("/process_image", {
        method: "POST",
        body: JSON.stringify({ image_data: base64Image }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .then((data) => {
        document.querySelector("#prediction_result").innerText = data.prediction;
    })
    .catch((error) => {
        console.error("Error processing image:", error);
    });
}

function predict() {
    const base64Image = canvasToBase64();
    sendImageToBackend(base64Image);
}

const predictButton = document.querySelector("#predict");
predictButton.addEventListener("click", predict);
