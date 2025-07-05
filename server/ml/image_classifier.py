from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

@app.route('/predict-image', methods=['POST'])
def predict_image():
    # Dummy classifier: always returns 'damaged' or 'repairable'
    return jsonify({'condition': 'damaged'})

if __name__ == '__main__':
    app.run(port=5001) 