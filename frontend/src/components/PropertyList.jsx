import { useState } from 'react'

export default function PropertyList({ properties, savedProperties, toggleSave, compareList, toggleCompare }) {
  const [search, setSearch] = useState('')

  const filtered = properties.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        <input 
          type="text" 
          placeholder="Search locations or titles..." 
          className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(property => {
          const isSaved = Array.isArray(savedProperties) && savedProperties.includes(property.id)
          const isComparing = !!compareList.find(p => p.id === property.id)

          return (
            <div key={property.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative group overflow-hidden">
                <img src={property.image_url || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'} alt={property.title} className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-slate-700 shadow-sm">
                  ID: {property.id}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-800 leading-tight mb-2 truncate">{property.title}</h3>
                <p className="text-slate-500 text-sm mb-4 flex items-center">
                  <span className="mr-1">📍</span> {property.location}
                </p>
                <div className="flex justify-between items-end mb-6">
                  <span className="text-3xl font-extrabold text-blue-600">${property.price?.toLocaleString()}</span>
                  <div className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    {property.bedrooms} Bed • {property.bathrooms} Bath
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-50">
                  <button onClick={() => toggleSave(property.id)} className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${isSaved ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                    {isSaved ? '♥ Saved' : '♡ Save'}
                  </button>
                  <button onClick={() => toggleCompare(property)} className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all shadow-sm ${isComparing ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                    {isComparing ? 'Comparing...' : 'Compare'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && properties.length > 0 && <p className="text-slate-500 py-8 col-span-2 text-center">No properties matching your criteria.</p>}
      </div>
    </div>
  )
}
