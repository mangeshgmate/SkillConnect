from flask import Flask, request, jsonify
from flask_cors import CORS 
import pickle
import os

app = Flask(__name__)
CORS(app) 

MODEL_PATH = 'model.pkl'

# Load the trained model
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        trained_model = pickle.load(f)
else:
    trained_model = None

@app.route('/chat_logic', methods=['POST'])
def chat():
    if not trained_model:
        return jsonify({"response": "Chatbot brain not loaded. Please run train_model.py first."})

    data = request.json
    user_msg = data.get('message', '').strip().lower()

    try:
        prediction = trained_model.predict([user_msg])[0]
        if prediction == "search hackathon":
            return jsonify({
                "response": "Redirecting you to the Hackathons page...",
                "redirect_url": "/explore-hackathons" 
            })
        return jsonify({"response": "I'm still learning! Try typing 'search hackathon'."})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True, port=5005)
