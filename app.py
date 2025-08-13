# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests from any origin


# Test endpoint
@app.route("/text", methods=["GET"])
def hello():
    return jsonify({"message": "hello world!"})


# Generate bullet points from text
@app.route("/generate-bullets", methods=["POST"])
def generate_bullets():
    data = request.get_json()
    input_text = data.get("text", "")

    if not input_text.strip():
        return jsonify({"error": "No text provided"}), 400

    # Split by period, remove empty sentences, strip spaces
    bullets = [
        f"• {line.strip()}"
        for line in input_text.replace("\n", " ").split(".")
        if line.strip()
    ]
    return jsonify({"bullets": bullets})


# Summarize text (first 30 words)
@app.route("/summarize-text", methods=["POST"])
def summarize_text():
    data = request.get_json()
    input_text = data.get("text", "")

    if not input_text.strip():
        return jsonify({"error": "No text provided"}), 400

    words = input_text.split()
    summary = " ".join(words[:30]) + ("..." if len(words) > 30 else "")
    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(port=500, debug=True)
