from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route('/predict-image', methods=['POST'])
def predict_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    image = request.files['image']
    img = Image.open(image.stream)
    # Simulate prediction
    return jsonify({
        'condition': 'damaged'
    })

if __name__ == '__main__':
    app.run(port=5001)
