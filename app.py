from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_disease

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "AI Doctor API Running"


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        symptoms = data.get("symptoms", "")

        symptoms_list = symptoms.lower().split()

        disease, confidence = predict_disease(symptoms_list)

        # 🚨 Invalid symptoms
        if disease is None:
            return jsonify({
                "predicted_disease": "No valid symptoms detected.",
                "confidence": 0,
                "error": True
            })

        return jsonify({
            "predicted_disease": disease,
            "confidence": confidence,
            "error": False
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)