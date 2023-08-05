const predictButton = document.querySelector('#predict');
            // Load Pyodide
        languagePluginLoader.then(async () => {
            await pyodide.loadPackage(['numpy', 'pillow']);
            // Define Python code
            pyodide.runPython(`
                import io
                import numpy as np
                from PIL import Image
                from js import document
                import base64
                def get_image_from_canvas(canvas_id):
                    canvas = document.getElementById(canvas_id)
                    img_data = canvas.toDataURL('image/png')
                    img_data = img_data.split(',')[1]
                    img_bytes = base64.b64decode(img_data)
                    img_file = io.BytesIO(img_bytes)
                    img = Image.open(img_file)
                    return img

                def image_to_matrix(image, target_size=(28, 28)):
                    image = image.resize(target_size, Image.LANCZOS)
                    grayscale_image = image.convert('L')

                    pixel_values = np.array(grayscale_image)
                    num_black_pixels = np.sum(pixel_values == 0)
                    num_white_pixels = np.sum(pixel_values == 255)

                    if num_black_pixels <= num_white_pixels:
                        inverted_image = Image.eval(grayscale_image, lambda x: 255 - x)
                    else:
                        inverted_image = grayscale_image
                    image_array = np.array(inverted_image)
                    image_array_normalized = image_array / 255.0
                    return image_array_normalized

                def get_matrix_from_canvas(canvas_id):
                    img = get_image_from_canvas(canvas_id)
                    matrix = image_to_matrix(img)
                    matrix_batch = np.expand_dims(matrix, axis =0)
                    matrix_batch = np.expand_dims(matrix_batch, axis =-1)
                    matrix_batch = np.expand_dims(matrix_batch, axis =-1)
                    return matrix_batch
            `);
        });
        let model;
        async function loadModel() {
            model = await tf.loadLayersModel('./model/model.json');
        }

        async function predict() {
            if (!model) {
                await loadModel();
            }
            let matrix = await pyodide.runPythonAsync(`get_matrix_from_canvas('canvas')`);
            matrix = tf.tensor4d(matrix, [1, 28, 28, 1]);
            const prediction = model.predict(matrix);
            const predictedValue = prediction.argMax(1).dataSync()[0];
            // Display predicted value
            document.getElementById('prediction_result').textContent = predictedValue;
        }
