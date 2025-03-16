from openai import AzureOpenAI
from bs4 import BeautifulSoup
import json
import os

from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
    api_version="2024-12-01-preview",
    api_key=os.environ['OPENAI_AZURE_API_KEY'],
    azure_endpoint=os.environ['OPENAI_AZURE_ENDPOINT'],
)


def extract_payment_methods(html_content, user_payment_methods):
    """
    Extract payment methods from HTML.

    **Input:**
    - html_content (str): HTML text.
    - payment_methods_list (List[str]): Payment methods to look for.

    **Returns:**
    A JSON with:
    - available: All found methods in the text.
    - user_has: Methods from payment_methods_list present in the text.
    - product: The product that the person is trying to buy
    """

    soup = BeautifulSoup(html_content, "html.parser")
    text_content = soup.get_text(separator=' ')

    prompt = (
        "Extract all banks or financial entities mentioned in the following text (ignore the payment method names themselves). "
        "Then, create a JSON object with the following keys:\n\n"
        "1. 'available': a list of all banks/entities found in the text.\n"
        "2. 'user_has': a list containing those banks/entities (from the following list: " 
        f"{', '.join(user_payment_methods)}) that also appear in the text.\n"
        "3. 'product': a string representing the full name and reference of the product the client is trying to purchase.\n\n"
        "Text:\n"
        f"{text_content}"
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