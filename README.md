# Agent Mira - Real Estate Application

## 🛠️ Step 1: Install Dependencies

You need to install dependencies for the root project, the Node API, and the Python service.

1. Open your terminal in this root folder
2. Run the following command to install the root packages:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```
4. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```
5. Install Python dependencies:
   ```bash
   cd python_service
   python -m pip install fastapi uvicorn scikit-learn pandas
   cd ..
   ```

---

## ⚙️ Step 2: Add Your API Keys

Create a file named `.env` in the root folder and paste the following inside it. Replace the placeholder text with your actual keys.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string - provided free from mongodb atlas
GEMINI_API_KEY=your_gemini_api_key_here - this is also freely provided by google ai studio
```


## 🚀 Step 3: Run the Application

We created a single script that will start all three servers (React Frontend, Node.js API, and Python ML API) at the exact same time.

From the root folder, run:
```bash
npm start
```

Wait a few seconds for all servers to boot up, then open your browser and go to:
**[http://localhost:5173/](http://localhost:5173/)**

---

## 🧪 Demo Guide: How to Test the App

### 1. The Real-Estate Chatbot
Open the chat box on the right and copy-paste these exact queries to test the Gemini AI:
> `"I'm looking for a 3 bedroom apartment in New York."`

> `"Which property has a private dock and a BBQ area?"`

> `"What is the cheapest property you have available?"`

### 2. The Simple Search Bar
Type the following keywords into the top search bar to see properties filter instantly without reloading:
- Type `"Miami"` to filter by location.
- Type `"Luxury"` to filter by property title.

### 3. The Comparison & Price Prediction Feature
1. Click the **"Compare"** button under **"3 BHK Apartment in Downtown"**.
2. Click the **"Compare"** button under **"2 BHK Condo with Sea View"**.
3. **What to expect:** A comparison table will instantly appear at the very top of the property list. 
   - It maps all property data side-by-side (Beds, Baths, Size, Amenities).
   - **Look at the "AI Predicted Value" row** — it dynamically contacts the Python Machine Learning model (`complex_price_model_v2.pkl`) to calculate and display the estimated real-world value of both properties!

### 4. Saved Properties
1. Click the **"♡ Save"** button on any property.
2. Watch the red indicator in the top navigation bar instantly increase!

## 🏗️ How It's Built

Agent Mira is split into three services that run independently and talk to each
other over HTTP. Think of it like three specialists on the same team — each does
its own job, but hands off to the others when needed.
```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│              Property UI · Filters · Chat · Comparison      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP
              ┌─────────────▼──────────────┐
              │     Node.js Backend         │
              │   Express · Auth · Routes   │
              └──┬──────────┬──────────┬───┘
                 │          │          │
        ┌────────▼───┐  ┌───▼────┐  ┌─▼──────────────┐
        │  MongoDB   │  │ Gemini │  │ Python ML       │
        │   Atlas    │  │   API  │  │ Service (FastAPI)│
        └────────────┘  └────────┘  └─────────────────┘
```

All three services boot up together with a single `npm start` — so despite the
distributed setup, the dev experience stays smooth.

---

## ✨ Key Features

**Property Search & Filtering** — Filtering is done entirely on the client side,
so results update instantly as you type. No page reloads, no waiting on the server.
Keywords match across property titles and location names in real time.

**Price Prediction** — A scikit-learn model running inside the Python service takes
normalized property features and returns an estimated market value. That number
gets injected straight into the comparison table, so you can size up properties
side by side without leaving the page.

**AI Chatbot** — Powered by Google Gemini with streaming responses. It's
context-aware, meaning it understands which properties you're currently looking at
and can answer questions about them specifically — not just generic real estate
advice.

---

## 🔄 How a Chat Message Flows

When you type a message in the chatbot, here's what happens behind the scenes:
```
You                 Frontend            Backend             Gemini
 │                     │                   │                   │
 │──── type message ──▶│                   │                   │
 │                     │── POST /api/chat ▶│                   │
 │                     │                   │── prompt + context▶│
 │                     │                   │                   │
 │                     │                   │◀── stream tokens ──│
 │                     │◀─── stream ───────│                   │
 │◀── words appear ────│                   │                   │
```

---

## ⚠️ Challenges We Faced

**Keeping three services in sync** was the biggest architectural headache. When
your frontend, backend, and ML service all run on different ports, CORS errors
become a daily companion. We solved this with a unified startup script, consistent
CORS configuration across all three services, and environment variables for service
discovery so nothing is ever hardcoded.

**ML model performance** was a real concern early on. Deserializing a pickle file
on every prediction request would be way too slow. The fix was simple but effective
— we cache the model in memory on startup and added a preprocessing pipeline to
normalize inputs before they reach the model.

**Gemini API rate limits** occasionally caused the chatbot to stall under heavier
use. We built a request queuing system with exponential backoff, and cached
responses for common property-related queries so repeated questions don't keep
burning through the API quota.

**Frontend performance** degraded noticeably with large property lists. Virtual
scrolling, `React.memo`, debounced search inputs, and lazy-loaded images brought
things back to a smooth experience even with hundreds of listings on screen.

**State management** got complex fast — saved properties, active comparisons, and
filters all needed to stay in sync across components. We centralized everything
through the Context API, used `localStorage` to persist user preferences across
sessions, and kept logic clean with custom hooks.
```
User Action
     │
     ▼
 Context API
  ┌──┴──────────────┬──────────────────┐
  ▼                 ▼                  ▼
Saved            Active            Comparison
Properties       Filters              List
  │                 │                  │
  └─────────────────┴──────────────────┘
                    │
                    ▼
              localStorage
          (persists across sessions)
```
