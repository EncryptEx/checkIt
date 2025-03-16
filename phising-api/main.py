import os

import base64
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pysafebrowsing import SafeBrowsing

from googlesearch import search
import tldextract
from bs4 import BeautifulSoup
from AI_utils import extract_payment_methods


# Customize the title of the Swagger documentation
app = FastAPI(title="Phishing URL Checker API")

# load dotenv
from dotenv import load_dotenv
import asyncio
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

@app.get("/get_bank_pic/{bank_name}")
async def get_bank_pic(bank_name):
    website = await get_domain(bank_name)
    return {'url' : "https://img.logo.dev/"+website['domain']+"?token=pk_D70v6BA4Q-qHCW8Jkx9eaA&size=149&retina=true"}

class CheckoutPageRequest(BaseModel):
    html_content: str
    url: str
    user_payment_methods: list[str]
    
@app.post("/scan_page/")
async def scan_page(request: CheckoutPageRequest):
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
                "pagamento", "cartão de crédito", "expedição", "faturamento", "resumo do pedido", "fazer pedido", "completar pedido",
                "pay", "credit card", "shipping", "billing", "order summary", "place order", "complete order", "bank", "banco", "VAT"]
                
    is_checkout_page = any(keyword in text_content for keyword in keywords)
    
    
    
    # send async to extract payment methods of website
    
    response = extract_payment_methods(html_content, request.user_payment_methods)
    
    # response = request.user_payment_methods
    return {"is_checkout_page": is_checkout_page, "payment_methods": response}


class SimilarProducts(BaseModel):
    product: str
    user_payment_methods: list[str]

@app.post("/scanget_similar_products_page/")
def get_similar_products(request: SimilarProducts):
    product_name = request.product
    bank_name = " ".join(request.user_payment_methods)
    query = f"{product_name} {bank_name}"
    results = list(search(query, num_results=3))
    return results
