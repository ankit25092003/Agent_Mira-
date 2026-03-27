import { useState, useEffect } from 'react'
import PropertyList from './components/PropertyList'
import Chatbot from './components/Chatbot'
import ComparisonView from './components/ComparisonView'

function App() {
  const [properties, setProperties] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [compareList, setCompareList] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error("Properties error", err))

    fetch('http://localhost:5000/api/users/saved')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setSavedProperties(data);
      })
      .catch(err => console.error("Saved error", err))
  }, [])

  const toggleSave = async (id) => {
    const isSaved = savedProperties.includes(id);
    const updated = isSaved ? savedProperties.filter(p => p !== id) : [...savedProperties, id];
    setSavedProperties(updated);

    try {
      const res = await fetch('http://localhost:5000/api/users/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: id })
      })
      const data = await res.json()
      if(Array.isArray(data)) setSavedProperties(data);
    } catch(err) {
      console.error("Save sync failed", err)
    }
  }

  const toggleCompare = (property) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id)
      } else {
        if (prev.length < 3) return [...prev, property]
        else {
          alert("Can only compare up to 3 properties")
          return prev
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Agent Mira Real Estate
          </h1>
          <div className="flex space-x-4 text-sm font-medium text-slate-600">
            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full">{savedProperties.length} Saved</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{compareList.length} Comparing</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8 flex flex-col">
          {compareList.length > 0 && <ComparisonView properties={compareList} />}
          <PropertyList 
            properties={properties} 
            savedProperties={savedProperties} 
            toggleSave={toggleSave}
            compareList={compareList}
            toggleCompare={toggleCompare}
          />
        </div>
        
        <div className="xl:col-span-1 sticky top-24 h-[calc(100vh-8rem)]">
          <Chatbot properties={properties} />
        </div>
      </main>
    </div>
  )
}

export default App
