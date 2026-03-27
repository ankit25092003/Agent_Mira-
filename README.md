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
