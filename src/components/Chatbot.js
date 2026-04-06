import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    const userMsg = input;
    setInput("");

    const response = await fetch('http://localhost:5005/chat_logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await response.json();
    setMessages([...newMessages, { text: data.response, sender: 'bot' }]);
    
    if (data.redirect_url) {
      setTimeout(() => window.location.href = data.redirect_url, 1500);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-primary p-4 rounded-full shadow-lg text-black font-bold">
        {isOpen ? "X" : "Chat"}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-base border border-primary/30 rounded-xl flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.sender === 'bot' ? 'bg-white/10 self-start' : 'bg-primary text-black self-end'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent border border-white/20 p-2 rounded outline-none text-white" placeholder="Type here..." />
            <button onClick={sendMessage} className="bg-primary text-black px-3 rounded font-bold">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
