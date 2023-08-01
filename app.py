from flask import Flask, request, jsonify, send_file
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from base64 import b64decode
import os
import sys
import subprocess

# Define the Conda environment name
conda_env = "env_ML"
"""
# Function to activate Conda environment
def activate_conda_env():
    process = subprocess.Popen(
        f"conda activate {conda_env}",
        stdout=subprocess.PIPE,
        shell=True,
        universal_newlines=True
    )
    sys.stdout.write(process.stdout.read())

# Activate the Conda environment before running the Flask app
activate_conda_env()
"""
app = Flask(__name__)


# Load the trained model
model = load_model('model/trained_model.keras')

def image_to_matrix(image_path, target_size=(28, 28)):
        # Open the image using PIL
    image = Image.open(image_path)

    # Resize the image to the target size
    image = image.resize(target_size, Image.LANCZOS)

    # Convert the image to grayscale
    grayscale_image = image.convert('L')

    # Count the number of black (0) and white (255) pixels
    pixel_values = np.array(grayscale_image)
    num_black_pixels = np.sum(pixel_values == 0)
    num_white_pixels = np.sum(pixel_values == 255)

    # Determine the color inversion based on pixel counts
    if num_black_pixels <= num_white_pixels:
        # Invert the colors by subtracting the pixel values from 255
        inverted_image = Image.eval(grayscale_image, lambda x: 255 - x)
    else:
        # No color inversion needed; keep the original grayscale image
        inverted_image = grayscale_image

    # Convert the PIL Image to a NumPy array
    image_array = np.array(inverted_image)
    # Normalize pixel values to be in the [0, 1] range
    image_array_normalized = image_array / 255.0

    return image_array_normalized


@app.route('/process_image', methods=['POST'])
def process_image():
    # Receive the image_data from the frontend
    image_data = request.json['image_data']

    # Decode the Base64 image data and save it as a temporary file
    with open('temp_image.png', 'wb') as f:
        f.write(b64decode(image_data))

    # Process the image using your existing function
    image_matrix = image_to_matrix('temp_image.png')

    # Delete the temporary image file
    os.remove('temp_image.png')

    # Expand the dimensions of the image_matrix to match the input shape of the model
    image_matrix_batch = np.expand_dims(image_matrix, axis=0)

    # Predict the image using the loaded model
    prediction = model.predict(image_matrix_batch)

    # Get the predicted class index (class with the highest probability)
    result = np.argmax(prediction[0])

    # Return the predicted result as a JSON response
    return jsonify({'prediction': result})

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_file(f'css/{filename}')

@app.route('/script/<path:filename>')
def serve_js(filename):
    return send_file(f'script/{filename}')

if __name__ == '__main__':
    app.run(port=8000, debug=True)
