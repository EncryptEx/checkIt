# UABtheHack 2025 - PayRetailers Challenge

## Authors
- Arnau Claramunt
- Genís López
- Jaume López
- Pau Mayench

[![GitHub followers](https://img.shields.io/github/followers/ArnauCS03?label=ArnauCS03)](https://github.com/ArnauCS03) &nbsp;&nbsp; 
[![GitHub followers](https://img.shields.io/github/followers/GenisLopez5?label=GenisLopez5)](https://github.com/GenisLopez5) &nbsp;&nbsp; 
[![GitHub followers](https://img.shields.io/github/followers/EncryptEx?label=EncryptEx)](https://github.com/EncryptEx) &nbsp;&nbsp; 
[![GitHub followers](https://img.shields.io/github/followers/PauMayench?label=PauMayench)](https://github.com/PauMayench)  

---

## Challenge Description
- Improving quality of life in Latin America through the responsible use of AI technologies.
- Emphasis on creating tools that strengthen local communities and facilitate access to resources, employment opportunities, and economic and energy development.

---

## Project Overview
Our project aims to enhance online payment security and accessibility with a Chrome extension. The extension provides the following functionalities:

1. **Anti-Phishing Protection**: Identifies potential phishing websites to protect users from fraudulent transactions.
2. **Payment Method Detection**: Checks whether the e-commerce website supports the user's available payment methods.
3. **Redirection System**: If no compatible payment method is available, users are redirected to an alternative payment solution.
4. **Payment Method Statistics Collection**: For users in LATAM who couldn't complete a payment, the system logs their available payment methods. This data is used to generate insights for businesses, helping them adopt the most relevant payment options.


Later we developed a web portal, with Blazor, and provided companies with valuable insights into their customers' payment method preferences. By leveraging Firebase, our service offers real-time statistics that help businesses identify potential revenue losses due to unavailable payment methods and track the number of customers attracted through our service.

Implementation
The portal is built using Blazor, a powerful framework for building interactive web applications with .NET. It seamlessly integrates with Firebase to store and retrieve data, ensuring a smooth and responsive user experience. The application is designed to be intuitive and user-friendly, allowing businesses to easily access and interpret their customer data.


---

## Frameworks and Technologies

### Chrome Extensions

### Programming Languages
- Python
- C# 
- JavaScript

### Development Tools
- **Notion**: Used for brainstorming and note-taking.
- **Perplexity**: Used for researching unknown concepts.

### Web Visualization Platform
- **Blazor**: Backend server and frontend rendering using Razor.
- **ASP.NET Core**: Backend logic and API handling.
- **Firebase Realtime Database**: Storing and managing payment method statistics.
- **Firebase Authentication**: User authentication for secure access.

### Data Visualization
- **QuickChart**: Used for generating bar plots.
- **Matplotlib & Basemap**: Used for mapping payment method availability across LATAM.

### APIs and Integrations
- **Azure OpenAI (GPT-4o-mini)**: AI-powered insights and assistance.
- **FastAPI**: Used for backend API development.

### Explored but Not Implemented
- **Flowise**: Considered for LLM orchestration and chatbot integration.
- **n8n**: Evaluated for automating workflows such as sending notification emails.

---

## Project Description
The FastAPI backend integrates Azure OpenAI to enhance security and data processing for the Chrome extension. It provides endpoints that:
- Perform phishing detection using SafeBrowsing and custom heuristics.
- Analyze HTML content to determine checkout pages and extract payment methods.
- Retrieve bank domains and logo information via web searches.
- Update company data transactionally with Firebase.

Although FlowiseAI was initially considered, the final implementation was carried out entirely in Python to achieve improved performance and flexibility.

---

## Installation & Setup

### Prerequisites
- Install [Google Chrome](https://www.google.com/chrome/)
- Install [.NET SDK](https://dotnet.microsoft.com/download/dotnet)

### Running the Extension
1. Clone the repository:
   ```sh
   git clone https://github.com/our-repo-name
   cd our-repo-name


<br><br>

### Screenshots:

![5 2](https://github.com/user-attachments/assets/d20d50ba-1366-49a8-9fb5-ca72a9416070)

![5 3](https://github.com/user-attachments/assets/80bd8002-354b-4f31-a404-776c1ad8d222)

![6](https://github.com/user-attachments/assets/beaa5438-5337-4459-a78c-6509afe8aaca)

![9](https://github.com/user-attachments/assets/ace7f808-c0b1-4599-9d15-7e955167e230)

![8](https://github.com/user-attachments/assets/d2b59a49-7a7b-4794-a797-d0cb2be6796f)


![1](https://github.com/user-attachments/assets/82d566f2-aa4c-4e36-aac3-3e68d28c261c)

![2](https://github.com/user-attachments/assets/c78dfad5-c3e0-4798-b458-9b54b2910702)

![3](https://github.com/user-attachments/assets/dbbd41f3-0e3b-4761-a55f-83913e2fbf90)

![4](https://github.com/user-attachments/assets/36dde0ae-c1d8-4de2-8269-9a4d67782960)

![5](https://github.com/user-attachments/assets/999b5b77-f596-421f-a828-112636abe8a3)

<br>
Firebase realtime Database

![database](https://github.com/user-attachments/assets/e895fae9-f570-4fb3-83dc-7d49c0494226)



