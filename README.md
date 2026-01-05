Ingreda — Understand Food Ingredients, Instantly

Ingreda is an AI-powered web app that helps you understand what’s really in your food.

Instead of showing complex nutrition tables or raw ingredient data, Ingreda explains ingredient labels in simple human language, so you can decide whether a food is good to eat, okay occasionally, or best avoided.

No databases.
No accounts.
Just clarity.

🌟 What Ingreda Can Do

You can give Ingreda ingredient information in multiple ways:

✍️ Paste ingredient text

📷 Upload a photo of an ingredient label

🎤 Speak ingredients using voice input

📸 Scan ingredients using your camera

🔊 Listen to the AI read the result aloud (female voice)

Ingreda then:

Explains why the ingredients matter

Shows trade-offs

Gives a clear recommendation

Visually adapts the UI (🟢 / 🟡 / 🔴) based on how suitable the food is

🎯 Who This Is For

Anyone curious about food ingredients

Students, families, everyday consumers

Hackathon judges & demo viewers

No technical background required to use the app

🖥️ Tech Stack (Simple Explanation)

Frontend: React (UI you see in the browser)

Backend: Node.js + Express (AI logic)

AI: Google Gemini (for reasoning)

OCR: Extracts text from label images

Deployment: Vercel (frontend) + Render (backend)

🚀 Running Ingreda on Your Local Machine (Step-by-Step)

Don’t worry — follow these steps carefully and you’ll be running it locally.

✅ Step 1: Install Required Software

Make sure you have these installed:

Node.js (v18 or later)
Download from: https://nodejs.org

(Install the LTS version)

Git
Download from: https://git-scm.com

After installing, restart your computer once.

✅ Step 2: Clone the Project

Open Command Prompt / Terminal and run:

git clone <your-repository-url>


Then move into the project folder:

cd ingreda

✅ Step 3: Set Up the Backend

Go to the backend folder:

cd backend


Install backend dependencies:

npm install

✅ Step 4: Create the Backend Environment File

Inside the backend folder, create a file named:

.env


Add the following content:

PORT=5000
NODE_ENV=development

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash


🔑 Important:
You must get a Gemini API key from:
👉 https://aistudio.google.com

(Do NOT share this key publicly.)

✅ Step 5: Start the Backend Server

Still inside /backend, run:

node index.js


You should see something like:

Server running on port 5000


Keep this terminal open.

✅ Step 6: Set Up the Frontend

Open a new terminal window and go to the frontend folder:

cd frontend


Install frontend dependencies:

npm install

✅ Step 7: Configure Frontend Environment Variable

Create a file in /frontend called:

.env


Add:

VITE_API_URL=http://localhost:5000

✅ Step 8: Start the Frontend

Run:

npm run dev


You’ll see a message like:

Local: http://localhost:5173


Open that link in your browser 🎉

✅ You’re Done!

Ingreda should now be running locally on your machine.

You can:

Paste ingredients

Upload label photos

Try voice input

Hear AI voice output

See the UI adapt (green / yellow / red)

🧪 Example Input to Try

Paste this into the app:

Ingredients: Water, Sugar, High Fructose Corn Syrup, Natural Flavors, Citric Acid, Sodium Benzoate, Red 40.

🔒 Privacy & Safety

No user data is stored

No accounts required

No ingredient databases

Everything runs on-demand

⚠️ Disclaimer

Ingreda provides general informational guidance only.
It is not medical advice and should not replace professional health consultation.

🏆 Hackathon Note

This project was built as part of a hackathon with a focus on:

AI-native design

Reasoning over raw data

Clear decision-making at the moment of choice

🙌 Credits

Built with ❤️ by the Ingreda team.
Powered by modern AI for everyday clarity.
