import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import { BookOpen, Send, Star, Loader2, X, ExternalLink, User, Library, Sparkles } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]); 
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/books/');
      setBooks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    if (!query || !selectedBook) return;

    // User message history mein add karo
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    
    const currentQuery = query;
    setQuery(""); 
    setAsking(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/ask/', {
        book_id: selectedBook.id,
        query: currentQuery
      });

      // AI response history mein add karo
      const aiMsg = { role: 'ai', content: res.data.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "### ⚠️ Error\nBackend connection failed." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0f1a]/90 backdrop-blur-md text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Library size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Insight Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
              v1.0.4 Stable
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <header className="mb-12 relative text-left">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-indigo-500/20">
               RAG-Powered Analysis
             </span>
             <span className="h-[1px] w-12 bg-slate-800"></span>
             <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
               Terminal Access
             </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Intelligence</span> Dashboard
          </h1>
          
          <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed border-l-2 border-indigo-500/30 pl-6 mb-8">
            The engine utilizes <span className="text-slate-200 font-semibold">Retrieval-Augmented Generation</span> to provide context-aware responses.
          </p>

          {/* Quick Stats Bar */}
          <div className="flex flex-wrap gap-6 md:gap-12 py-6 border-y border-white/5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Volumes</p>
              <p className="text-xl font-bold text-white leading-none">{books.length}</p>
            </div>
            <div className="hidden md:block w-[1px] bg-white/5"></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Engine Status</p>
              <p className="text-xl font-bold text-green-500 leading-none flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span> Operational
              </p>
            </div>
            <div className="hidden md:block w-[1px] bg-white/5"></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Base Model</p>
              <p className="text-xl font-bold text-white leading-none text-indigo-400">Llama 3.1</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {books.map(book => (
              <div 
                key={book.id} 
                onClick={() => { setSelectedBook(book); setMessages([]); }}
                className="flex flex-col bg-[#161b2c] border border-white/5 p-6 rounded-2xl hover:border-indigo-500/40 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-white/5 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {book.rating || "4.8"}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                  <User size={12} />
                  <span>{book.author || "Unknown Author"}</span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 flex-grow">
                  {book.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    Start Insights <Sparkles size={12} />
                  </span>
                  {/* FIXED LINK HERE */}
                  <a 
                    href={book.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()} // Card click prevent karne ke liye
                    className="text-slate-600 hover:text-indigo-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modern Chat History Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBook(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-[#0f1422] h-full md:h-[85vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-l md:border border-white/10">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02] text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">{selectedBook.title}</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Knowledge Base Session</p>
                </div>
              </div>
              <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                <X size={24}/>
              </button>
            </div>

            {/* Chat Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col custom-scrollbar bg-gradient-to-b from-transparent to-black/10 text-left">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30">
                  <BookOpen size={40} className="mb-4" />
                  <p className="text-sm font-medium tracking-wide">Start a conversation about {selectedBook.title}...</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                  >
                    <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm md:text-base ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-[#161b2c] border border-white/5 text-slate-200 rounded-tl-none prose prose-invert prose-indigo'
                    }`}>
                      {msg.role === 'ai' ? <Markdown>{msg.content}</Markdown> : msg.content}
                    </div>
                  </div>
                ))
              )}
              {asking && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-[#161b2c] border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="animate-spin text-indigo-400" size={16} />
                    <span className="text-xs text-slate-400 font-medium">Processing request...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Input */}
            <div className="p-4 md:p-8 bg-[#161b2c]/30 border-t border-white/5">
              <div className="relative max-w-2xl mx-auto flex gap-3">
                <input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Type your inquiry..."
                  className="w-full bg-[#161b2c] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500/50 text-white text-sm transition-all"
                />
                <button 
                  onClick={handleAskAI}
                  disabled={asking || !query}
                  className="bg-indigo-600 px-5 rounded-xl hover:bg-indigo-500 disabled:opacity-20 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
              <p className="text-center mt-4 text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                Session history is active &bull; Context-aware synthesis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}