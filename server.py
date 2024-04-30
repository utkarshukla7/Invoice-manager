
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
import pytesseract
import requests, json
from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()


USER = os.getenv("MONGO_USER")
PASS = os.getenv("MONGO_PASS")
API = os.getenv('API_KEY')

app = Flask(__name__)
CORS(app)



mongo_uri = ''


client = MongoClient(mongo_uri)

database = 'Invoice-manager'
db = client.database

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

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API}"

    text_to_insert = """
    "You will be provided a text extracted from a invoice choose the category of the invoice from 7 categories whose description are given below, Don't add any kind of formatting in the response, don't bold the text.

    1. Grocery:  Essential food and household items purchased for consumption at home.

    2. Food: Meals or snacks consumed either at home or outside, including dining out, takeout, and home orders.

    3. Transportation: Modes of travel including public transit, private vehicles, and ride-sharing services.

    4. Healthcare: Services and products related to medical care, including doctor visits, prescriptions, insurance, and medicine purchases.

    5. Entertainment: Activities and products for leisure and enjoyment, such as movies, concerts, gaming, and OTT platform subscriptions.

    6. Utilities: Essential services like electricity, water, gas, tools required for house maintenance, and internet needed for daily living.

    7. Others: Miscellaneous expenses that do not fit in the previously mentioned categories.

    Extract the following information from the provided text in the format given below:
    category:
    date:
    time:
    name of shop:
    total amount:
    "
    """

    messages_to_send = [
        {
            "role": "user",
            "parts": [{
                "text": text_to_insert
                
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
        print(text)
        if text:
            return gemini(text)
    else:
        return None

def is_blurry(image, threshold=3000):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    return lap_var < threshold

def has_low_contrast(image, threshold=50):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    std_dev = hist.std()
    return std_dev < threshold

def has_noise(image, threshold=3000):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    return lap_var < threshold

def is_too_dark(image, threshold=100):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    dark_pixel_percentage = sum(hist[:threshold]) / sum(hist)
    return dark_pixel_percentage > 0.5

def is_too_bright(image, threshold=200):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    bright_pixel_percentage = sum(hist[threshold:]) / sum(hist)
    return bright_pixel_percentage > 0.5

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
    if text:
        return jsonify({'success': True, 'text': text}), 200
    else:
        return jsonify({'error': 'Failed to extract text from the image'}), 500
    
    image_array = cv2.imdecode(np.frombuffer(image_binary, np.uint8), cv2.IMREAD_COLOR) 
    if is_blurry(image_array):
        return jsonify({'success': False, 'text': 'Image is Blurry. Please re-upload a clear image.'}), 200
    if has_noise(image_array):
        return jsonify({'success': False, 'text': 'Image has Noise. Please re-upload a clearer image.'}), 200
    if is_too_dark(image_array):
        return jsonify({'success': False, 'text': 'Image is too dark. Please re-upload a brighter image.'}), 200
    if is_too_bright(image_array):
        return jsonify({'success': False, 'text': 'Image is too bright. Please re-upload a darker image.'}), 200

    text = get_text(image_base64)
    if text:
        return jsonify({'success': True, 'text': text}), 200
    else:
        return jsonify({'error': 'Failed to extract text from the image'}), 500

@app.route('/addTransaction', methods=['POST'])
def add_transaction():
    try:
        collection = db['user']
        try:
            data = request.get_json()
            collection.insert_one(data)
            return jsonify({'message': 'Transaction added successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/getTransactions', methods=['POST'])
def get_transactions():
    try:

        collection = db["user"]  

        data = request.get_json()
        email = data.get('email')
        cursor = collection.find({'email': email})
        transactions = []
        for index, doc in enumerate(cursor):
            transaction = {
                'id': index,
                'category': doc['category'],
                'amount': doc['amount'],
                'date': doc['date'],
                'time': doc['time'],
                'shop': doc['shop']
            }
            transactions.append(transaction)
        print(transactions)
        return jsonify(transactions)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
    