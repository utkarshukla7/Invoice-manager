
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import pytesseract
import requests, json

app = Flask(__name__)
CORS(app)

def extract_largest_contour(image):
    nparr = np.frombuffer(base64.b64decode(image), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Threshold the image
    _, threshold = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY)
    
    # Apply morphological operations (OPEN and CLOSE)
    kernel = np.ones((5,5), np.uint8)
    opening = cv2.morphologyEx(threshold, cv2.MORPH_OPEN, kernel)
    closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel)
    
    # Find contours in the image
    contours, _ = cv2.findContours(closing, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find the contour with the largest area
        largest_contour = max(contours, key=cv2.contourArea)
    
        # Get the bounding rectangle of the largest contour
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Crop the image using the bounding rectangle
        cropped_image = image[y:y+h, x:x+w].copy()
        
        return cropped_image
    else:
        return None
    
def gemini(message):
    gemini_api_key = ""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_api_key}"


    messages_to_send = [
        {
            "role": "user",
            "parts": [{
                "text": "You will be provided a text extracted from a invoice choose the category of the invoice from 7 categories Grocery, Food, Transportation, Healthcare, Entertainment, Utilities, Others and  extract date, time, name of shop, total amount skip which ever is does not exist in the text.Don't add any kind of formating in the reponse."
            }],
        },
        {
            "role": "model",
            "parts": [{
                "text": "sure, I will help you with that"
            }],
        },
        {
            "role" :"user",
            "parts": [{
                "text": message
            }],
        }
    ]

    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        "contents": messages_to_send
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    res_json = response.json()
    response_message = res_json['candidates'][0]['content']['parts'][0]['text']

    return response_message

def get_text(image):
    cropped_image = extract_largest_contour(image)
    if cropped_image is not None:
        text = pytesseract.image_to_string(cropped_image)
        if text:
            return gemini(text)
    else:
        return None

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        print("no image")
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    image_binary = file.read()
    image_base64 = base64.b64encode(image_binary).decode('utf-8')
    text = get_text(image_base64)
    print(text)
    if text:
        return jsonify({'success': True, 'text': text}), 200
    else:
        return jsonify({'error': 'Failed to extract text from the image'}), 500


if __name__ == '__main__':
    app.run(debug=True)
