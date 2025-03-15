import os
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pysafebrowsing import SafeBrowsing

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

