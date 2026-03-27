import { useState, useRef, useEffect } from 'react'

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hi! I am Agent Mira. Tell me about the property you are looking for.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error }])
    } catch(err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, our Node.js server is currently unreachable. Are you sure it is running?' }])
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">🤖</div>
          <div>
            <h2 className="font-semibold text-lg">Agent Mira</h2>
            <p className="text-teal-50 text-xs font-medium opacity-90">AI Real Estate Assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-4 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'}`}>
              <span className="whitespace-pre-wrap">{m.text}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 rounded-tl-sm flex justify-center space-x-1 items-center h-12">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-100 placeholder-slate-400 text-sm rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition border border-transparent focus:border-emerald-300"
            placeholder="Ask about properties..."
          />
          <button type="submit" disabled={loading} className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-60 shadow-md w-10 h-10 flex items-center justify-center font-bold">
            ➤
          </button>
        </form>
      </div>
    </div>
  )
}
