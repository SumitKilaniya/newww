from flask import Flask, request, jsonify
import pickle
import re

app = Flask(__name__)

# Load the vectorizer and model
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))

def clean_text(text):
    text = re.sub(r'\W', ' ', text)
    text = text.lower()
    return text

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    news = data.get('text', '')
    cleaned = clean_text(news)
    vect = vectorizer.transform([cleaned])
    prediction = model.predict(vect)[0]
    confidence = round(model.predict_proba(vect).max() * 100, 2)

    return jsonify({
        'isFake': bool(prediction),
        'confidence': confidence,
        'explanation': 'Predicted using ML model based on training data',
        'sources': []
    })

if __name__ == '__main__':
    app.run(debug=True)
