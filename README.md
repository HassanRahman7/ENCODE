Ingreda — Understand Food Ingredients, Instantly
Ingreda is an AI-powered web app that helps you understand what’s really in your food.
Instead of showing complex nutrition tables or raw ingredient data, Ingreda explains ingredient labels in simple human language, so you can decide whether a food is good to eat, okay occasionally, or best avoided.
No databases.
No accounts.
Just clarity.
What Ingreda Can Do
You can give Ingreda ingredient information in multiple ways:
Paste ingredient text
Upload a photo of an ingredient label
Speak ingredients using voice input
Scan ingredients using your camera
Listen to the AI read the result aloud (female voice)
Ingreda then:
Explains why the ingredients matter
Shows trade-offs
Gives a clear recommendation
Visually adapts the UI (🟢 / 🟡 / 🔴) based on how suitable the food is
Who This Is For
Anyone curious about food ingredients
Students, families, everyday consumers
Hackathon judges & demo viewers
No technical background required to use the app
Tech Stack (Simple Explanation)
Frontend: React (UI you see in the browser)
Backend: Node.js + Express (AI logic)
AI: Google Gemini (for reasoning)
OCR: Extracts text from label images
Deployment: Vercel (frontend) + Render (backend)
Running Ingreda on Your Local Machine (Step-by-Step)
Follow these steps carefully — you do not need deep technical knowledge.
Step 1: Install Required Software
Install these once:
Node.js (v18 or later)
https://nodejs.org
(choose LTS)
Git
https://git-scm.com
Restart your computer after installing.
Step 2: Clone the Project
Open Command Prompt / Terminal and run:
git clone <your-repository-url>
Move into the project folder:
cd ingreda
Step 3: Set Up the Backend
Go to the backend folder:
cd backend
Install dependencies:
npm install
Step 4: Create Backend Environment File
Inside the backend folder, create a file named:
.env
Add the following:
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
Get a Gemini API key from:
https://aistudio.google.com
(Keep this key private.)
Step 5: Start the Backend Server
Still inside /backend, run:
node index.js
You should see:
Server running on port 5000
Leave this terminal open.
Step 6: Set Up the Frontend
Open a new terminal window and go to the frontend folder:
cd frontend
Install dependencies:
npm install
No .env file is required for the frontend.
Step 7: Start the Frontend
Run:
npm run dev
You’ll see something like:
Local: http://localhost:5173
Open that link in your browser 
You’re Done!
Ingreda is now running locally on your machine.
You can:
Paste ingredients
Upload label photos
Use voice input
Listen to AI voice output
See the UI change colors based on the analysis
Example Input to Try
Paste this into the app:
Ingredients: Water, Sugar, High Fructose Corn Syrup, Natural Flavors, Citric Acid, Sodium Benzoate, Red 40.
Privacy & Safety
No user data is stored
No accounts required
No ingredient databases
All analysis is done on demand
Disclaimer
Ingreda provides general informational guidance only.
It is not medical advice.
Hackathon Note
This project was built for a hackathon with a focus on:
AI-native interaction
Reasoned explanations
Clear decision-making at the moment of choice
Credits

Built with ❤️ by the Ingreda team.
Powered by modern AI for everyday clarity.
