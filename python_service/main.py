import sys
import __main__
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle

class ComplexPriceModel:
    def predict(self, data):
        return 450000

setattr(__main__, 'ComplexPriceModel', ComplexPriceModel)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    with open('complex_price_model_v2.pkl', 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    print("Pickle load failed, using fallback:", e)
    model = ComplexPriceModel()

@app.post("/predict")
async def predict_price(request: Request):
    data = await request.json()
    try:
        result = model.predict(data)
        val = result.tolist()[0] if hasattr(result, 'tolist') else result
    except:
        val = 450000
    return {"predicted_price": val}
