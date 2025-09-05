import requests
import json
import os
from django.http import JsonResponse
from langdetect import detect
from googletrans import Translator


file_path = os.path.join(os.path.dirname(__file__), 'api.json')

# Defines a translator for googletrans 
translator = Translator()

with open(file_path, 'r') as file:
    data = json.load(file)

# Extract the API key
api_key = data['api_key']


purpose = """I am designed to demonstrate the integration of <strong class='text-warning'>JavaScript</strong> and <strong class='text-warning'>Python</strong> integration within an <strong class='text-warning'>HTML</strong> file."""

about = """Mirnes is a motivated and passionate 24 years old current Germany resident. 
His tech skills include <ul>
<li>Frontent Development</li>
<li>Backend Development</li> 
<li>Software development</li> 
<li>working with databases and LLM's.</li>"""

# chatbot request 
def chatbot(request):
    # only POST method allowed
    if request.method == 'POST':
        # Retrieve user query from the request JSON data
        data = json.loads(request.body)
        user_query = data.get('user_query')

        # defining, and clearing the message 
        message = ""
        # detect the language of the current user query
        lang = detect(user_query)

        # Construct the API request to Wit.ai
        api_token = api_key
        url = "https://api.wit.ai/message"
        headers = {
        "Authorization": f"Bearer {api_token}"
        }
        params = {
        "v": "20240701",  # API version
        # translate to english before sending to API, also lowercase for better responses
        "q": user_query.lower() 
        }

        # Send the API request to Wit.ai
        response_from_wit = requests.get(url, headers=headers, params=params).json()

        # fetching the intent/topic of the message
        try:
            intent = list(response_from_wit['entities'].keys())[0].split(":")[0]
        except IndexError:
            intent = "unknown"
            message = "I don't have a response"


        # deciding what to answer based on the intent
        if intent == "introduction":
            message = "My endpoint is Wit.ai, I am created by Meta, implemented by Mirnes for demonstration purposes."
        elif intent == "greet":
            message = "Hello, how are you?"
        elif intent == "purpose":
            message = purpose
        elif intent == "about":
            message = about
        else:
            message = "I have no answer to this one.."


        response_data = {
            "status": 200,  # Success status code
            "message": message
        }


        return JsonResponse(response_data)
    
    # if request is GET
    else:
        return JsonResponse({"error": "Method not allowed."}, status=405)
    

