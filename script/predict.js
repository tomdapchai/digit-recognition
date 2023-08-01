document.addEventListener("DOMContentLoaded", () => {
  const predictButton = document.getElementById("predict");
  const canvas = document.getElementById("canvas");
  const predictionResult = document.getElementById("prediction_result");

  // Function to convert canvas data to an image (PNG)
  function convertCanvasToImage(canvas) {
    const image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  }

  // Function to make the prediction request
  async function makePrediction(imageData) {
    try {
      console.log("Sending prediction request...");
      const response = await fetch("/process_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_data: imageData }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const result = await response.json();
      console.log("Prediction response:", result);
      return result;
    } catch (error) {
      console.error("Error making prediction:", error);
      return null;
    }
  }

  // Function to handle the "Predict" button click event
  predictButton.addEventListener("click", async () => {
    const canvasImage = convertCanvasToImage(canvas);
    const canvasImageData = await new Promise((resolve) => {
      canvasImage.onload = () => {
        const canvasImageCanvas = document.createElement("canvas");
        canvasImageCanvas.width = canvas.width;
        canvasImageCanvas.height = canvas.height;
        const ctx = canvasImageCanvas.getContext("2d");
        ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);
        resolve(canvasImageCanvas.toDataURL("image/png"));
      };
    });

    console.log("Sending canvas data to prediction...");
    const prediction = await makePrediction(canvasImageData);
    if (prediction !== null) {
      console.log("Prediction result:", prediction);
      predictionResult.textContent = `Predicted value: ${prediction.prediction}`;
    } else {
      console.log("Prediction failed.");
      predictionResult.textContent = "Prediction failed.";
    }
  });
});
