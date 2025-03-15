import os
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pysafebrowsing import SafeBrowsing

from googlesearch import search
import tldextract

from openai import AzureOpenAI
from bs4 import BeautifulSoup
import json
from typing import List

# Customize the title of the Swagger documentation
app = FastAPI(title="Phishing URL Checker API")

# load dotenv
from dotenv import load_dotenv
load_dotenv()

# create a SafeBrowsing object
sb = SafeBrowsing(os.environ['API_KEY'])

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class URLRequest(BaseModel):
    url: str

@app.post('/check')
async def check_url(request: URLRequest):
    # check if the url is a phishing site
    result = sb.lookup_url(request.url)
    return result



@app.get('/get_domain/{bank_name}')
async def get_domain(bank_name):
    query = bank_name + " web"
    query = "banco " + query if "banc" not in query or "bank" not in query else query


    for url in search(query, num_results=10):
        ext = tldextract.extract(url)
        domain = f"{ext.domain}.{ext.suffix}"
        print("Domain found:", domain)
        if len(domain) > 5:
            return {'domain': domain}
        
    return {'domain': bank_name + ".com"}




#region OpenAI azure

client = AzureOpenAI(
    api_version="2024-12-01-preview",
    api_key=os.environ['OPENAI_AZURE_API_KEY'],
    azure_endpoint=os.environ['OPENAI_AZURE_ENDPOINT'],
)

class PaymentMethodsRequest(BaseModel):
    html_content: str
    payment_methods_list: List[str]

@app.post("/extract_payment_methods/")
def extract_payment_methods(request: PaymentMethodsRequest):
    """
    Extract payment methods from HTML.

    **Input:**
    - html_content (str): HTML text.
    - payment_methods_list (List[str]): Payment methods to look for.

    **Returns:**
    A JSON with:
    - available: All found methods in the text.
    - user_has: Methods from payment_methods_list present in the text.
    """
    
    html_content = request.html_content
    payment_methods_list = request.payment_methods_list

    soup = BeautifulSoup(html_content, "html.parser")
    text_content = soup.get_text(separator=' ')

    prompt = (
        "Identify which payment methods appear in the given text: "
        f"Text:\n{text_content}\n\n"
        "Return a JSON with two lists: 'available' for all found methods, and 'user_has' for those that match the following list."
        f"{', '.join(payment_methods_list)}. \n\n"
    )


    completion = client.chat.completions.create(
        model="GPT-4o-mini" ,
        temperature=0.2,
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
        ],
    )
    jsn = completion.to_json()
    data = json.loads(jsn)
    message_content = data["choices"][0]["message"]["content"]
    
    if message_content.startswith("```json"):
        message_content = message_content[len("```json"):].strip()
    if message_content.endswith("```"):
        message_content = message_content[:-3].strip()

    message_dict = json.loads(message_content)
    return message_dict


#endregion