async function predict(imageData) {
  console.log('loading model');
  const model = await tf.loadLayersModel('./model/model.json');
  console.log('model loaded');
  const tensor = tf.tensor(imageData);
  const prediction = model.predict(tensor);
  document.getElementById('prediction_result').innerHTML = prediction;
}
