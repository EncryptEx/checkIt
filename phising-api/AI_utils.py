from openai import AzureOpenAI
from bs4 import BeautifulSoup
import json
import os


# load dotenv
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
        "Identify which payment methods appear in the given text: "
        f"Text:\n{text_content}\n\n"
        "Return a JSON with two lists: 'available' for all found methods, and 'user_has' for those that match the following list."
        f"{', '.join(user_payment_methods)}. \n\n"
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