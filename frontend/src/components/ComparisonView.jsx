import { useState, useEffect } from 'react'

export default function ComparisonView({ properties }) {
  const [predictions, setPredictions] = useState({})
  const [loading, setLoading] = useState(false)

  // Fetch predictions safely whenever properties change
  useEffect(() => {
    if (!properties || properties.length === 0) return;
    
    setLoading(true);
    
    const fetchPredictions = async () => {
      const newPredictions = { ...predictions };
      
      for (const property of properties) {
        if (newPredictions[property.id]) continue;
        
        try {
          const amens = property.amenities || [];
          const hasPool = amens.some(a => a.toLowerCase().includes('pool'));
          const hasGarage = amens.some(a => a.toLowerCase().includes('garage') || a.toLowerCase().includes('parking'));
          
          const payload = {
            property_type: "SFH",
            lot_area: property.size_sqft || 2000,
            building_area: property.size_sqft || 2000,
            bedrooms: property.bedrooms || 3,
            bathrooms: property.bathrooms || 2,
            year_built: 2015,
            has_pool: hasPool,
            has_garage: hasGarage,
            school_rating: 8
          };

          const res = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          newPredictions[property.id] = data.predicted_price;
        } catch(err) {
          console.error("Prediction error:", err);
          newPredictions[property.id] = 'Error';
        }
      }
      
      setPredictions(newPredictions);
      setLoading(false);
    };
    
    fetchPredictions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  if (!properties || properties.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Property Comparison</h2>
        {loading && <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">Computing AI Prices...</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 rounded-tl-xl">Feature</th>
              {properties.map(p => (
                <th key={p.id} className="p-4 border-b border-slate-200 bg-slate-50 w-1/3">
                  <span className="block font-bold text-lg text-slate-800">{p.title}</span>
                  <span className="block text-sm text-slate-500 font-normal">{p.location}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="p-4 border-b border-slate-100 text-slate-500 font-medium">Actual Price</td>
              {properties.map(p => (
                <td key={p.id} className="p-4 border-b border-slate-100 font-bold text-slate-800 text-lg">
                  ${p.price?.toLocaleString() || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-blue-700 font-bold bg-blue-50/50">AI Predicted Value</td>
              {properties.map(p => (
                <td key={p.id} className="p-4 border-b border-slate-100 font-bold text-blue-700 bg-blue-50/50 text-lg">
                  {predictions[p.id] === 'Error' ? 'Unavailable' : 
                   predictions[p.id] ? `$${Number(predictions[p.id]).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 
                   'Loading...'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-slate-500 font-medium">Size</td>
              {properties.map(p => <td key={p.id} className="p-4 border-b border-slate-100">{p.size_sqft} sqft</td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-slate-100 text-slate-500 font-medium">Bed and Bath</td>
              {properties.map(p => <td key={p.id} className="p-4 border-b border-slate-100">{p.bedrooms} Beds / {p.bathrooms} Baths</td>)}
            </tr>
            <tr>
              <td className="p-4 text-slate-500 font-medium">Amenities</td>
              {properties.map(p => (
                <td key={p.id} className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {p.amenities?.length ? p.amenities.map((a, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-1 flex items-center justify-center rounded-lg text-xs font-medium text-slate-600 border border-slate-200">{a}</span>
                    )) : <span className="text-slate-400 italic">None</span>}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
