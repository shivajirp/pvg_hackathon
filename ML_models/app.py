import numpy as np
import cv2
from ultralytics import YOLO
from flask import Flask, request, jsonify
from flask_cors import CORS  # CORS for frontend access
from PIL import Image
import io

# Initialize Flask App
app = Flask("Plant Disease Detection")
CORS(app)  # Allow frontend requests from any origin

# Load YOLO Model
model = YOLO('crop_disease_model.pt')

# Disease Remedies Dictionary
disease_remedies = {
    "bacterial spot": "Remove infected plant debris, use copper-based fungicides.",
    "early blight": "Apply fungicides, practice crop rotation.",
    "healthy": "No action needed.",
    "late blight": "Remove infected plants, use fungicides.",
    "leaf miner": "Use insecticidal sprays, remove affected leaves.",
    "leaf mold": "Improve air circulation, use fungicides.",
    "mosaic virus": "Remove infected plants, control aphids.",
    "septoria": "Remove infected leaves, use fungicides.",
    "spider mites": "Use miticides, introduce beneficial insects.",
    "yellow leaf curl virus": "Remove infected plants, control whiteflies."
}

# Function to process image
def process_image(image):
    img = cv2.resize(image, (512, 512))  # Resize to match model input
    return img

# Function for disease detection
def plant_disease_detect(img):
    detect_result = model(img)
    detect_img = detect_result[0].plot()
    detections = detect_result[0].boxes.data.tolist()
    classes = [model.names[int(detection[5])] for detection in detections]
    return detect_img, classes

# Flask API Endpoint
@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        return jsonify({"message": "Use POST request to send an image for prediction."}), 400

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image = np.array(image)
    original_size = (image.shape[1], image.shape[0])

    # Process image & detect disease
    processed_img = process_image(image)
    detect_img, classes = plant_disease_detect(processed_img)
    
    # Get unique classes with remedies
    unique_classes = list(set(classes))
    class_table = [{"disease": cls, "remedy": disease_remedies.get(cls.lower(), "No remedy available")} for cls in unique_classes]

    return jsonify({"detections": class_table})

# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Plant Disease Detection API!"})

# Run Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
