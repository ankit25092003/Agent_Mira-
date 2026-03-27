from fastapi import FastAPI, Request
import pickle

app = FastAPI()

with open('complex_price_model_v2.pkl', 'rb') as f:
    model = pickle.load(f)

@app.post("/predict")
async def predict_price(request: Request):
    data = await request.json()
    result = model.predict(data)
    return {"predicted_price": result}
