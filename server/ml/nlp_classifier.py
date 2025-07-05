from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict-text', methods=['POST'])
def predict_text():
    # Dummy classifier: always returns 'resell' or 'donate'
    return jsonify({'route': 'resell'})

if __name__ == '__main__':
    app.run(port=5002) 