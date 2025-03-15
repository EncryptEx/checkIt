import os
from typing import Union
import base64
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


# new endpoint to get if a page is a checkout page or not based on the html contents

class CheckoutPageRequest(BaseModel):
    html_content: str
    url: str
    
@app.post("/is_checkout_page/")
async def is_checkout_page(request: CheckoutPageRequest):
    """
    Check if a page is a checkout page or not based on the HTML content.

    **Input:**
    - html_content (str): HTML text.

    **Returns:**
    A JSON with:
    - is_checkout_page: True if the page is a checkout page, False otherwise.
    """
    
    # use keywords instead of openai
    
    html_content = base64.b64decode(request.html_content).decode('utf-8')
    soup = BeautifulSoup(html_content, "html.parser")
    text_content = soup.get_text(separator=' ')
    
    keywords = ["checkout", "payment", "credit card", "shipping", "billing", "order summary", "place order", "complete order", 
                "pago", "tarjeta de crédito", "envío", "facturación", "resumen del pedido", "realizar pedido", "completar pedido",
                "pagamento", "cartão de crédito", "envio", "faturamento", "resumo do pedido", "fazer pedido", "completar pedido",
                "paiement", "carte de crédit", "expédition", "facturation", "résumé de la commande", "passer commande", "compléter la commande",
                "pagamento", "cartão de crédito", "expedição", "faturamento", "resumo do pedido", "fazer pedido", "completar pedido"]
                
    is_checkout_page = any(keyword in text_content for keyword in keywords)
    
    # send async to extract payment methods of website
    return {"is_checkout_page": is_checkout_page}

class PaymentMethodsRequest(BaseModel):
    html_content: str
    payment_methods_list: List[str]

@app.post("/extract_payment_methods/")
async def extract_payment_methods(request: PaymentMethodsRequest):
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