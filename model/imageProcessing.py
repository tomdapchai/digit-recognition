# -*- coding: utf-8 -*-
"""
Created on Sat Jul 29 17:25:17 2023

@author: LENOVO
"""

from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

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

    # Plot the original and processed images
    plt.figure(figsize=(8, 4))
    plt.subplot(1, 2, 1)
    plt.imshow(grayscale_image, cmap='gray')
    plt.title('Original Image')
    plt.axis('off')

    plt.subplot(1, 2, 2)
    plt.imshow(inverted_image, cmap='gray')
    plt.title('Processed Image')
    plt.axis('off')

    plt.show()

    return image_array_normalized

model = load_model('trained_model.h5')
# Example usage:
image_path = 'test.png'
image_matrix = image_to_matrix(image_path)

# Print the shape of the resulting matrix
image_matrix_batch = np.expand_dims(image_matrix, axis = 0)

predict = model(image_matrix_batch)
# Get the predicted class index (class with the highest probability)
result = np.argmax(predict[0])

# Plot the input image and the predicted class
plt.imshow(image_matrix, cmap='gray')
plt.title("Predicted: {}".format(result), fontsize=16)
plt.show()




