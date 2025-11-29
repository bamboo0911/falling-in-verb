import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown, Lightbulb } from 'lucide-react';
import { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { Language } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  currentVerb?: string;
  language?: Language;
  instructionLang?: string;
}

// Improved Formatter Component for Paragraphs, Lists, and Bold/Italic
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split text by newlines to handle paragraphs and lists
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIndex) => {
        if (!line.trim()) return <div key={lineIndex} className="h-1" />; // Spacer for empty lines

        // Check for list items
        const isList = line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim());
        const content = isList ? line.replace(/^[-*]\s|^\d+\.\s/, '') : line;

        // Inline formatting parser (Bold/Italic)
        const parseInline = (str: string) => {
          // Split by bold (**...**) or italic (*...*) markers
          const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          return parts.map((part, i) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-stone-700">{part.slice(2, -2)}</strong>;
             }
             if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                return <em key={i} className="italic text-stone-600">{part.slice(1, -1)}</em>;
             }
             return part;
          });
        };

        if (isList) {
          return (
             <div key={lineIndex} className="flex items-start gap-2 ml-1">
                <span className="text-rose-400 mt-1.5 text-xs">•</span>
                <span>{parseInline(content)}</span>
             </div>
          );
        }

        return <p key={lineIndex} className="break-words">{parseInline(content)}</p>;
      })}
    </div>
  );
};

export const AIChat: React.FC<Props> = ({ currentVerb, language = 'pt', instructionLang = 'English' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    // Reset or update chat session when verb changes
    console.log(`[AIChat] Initializing session. Verb: ${currentVerb}, Lang: ${language}`);
    const session = createChatSession(language as Language, currentVerb, instructionLang);
    setChatSession(session);
    
    // Set initial welcome message
    // If instructionLang is Chinese, greeting is customized lightly here, but AI handles most.
    const isChinese = instructionLang.includes('Chinese');
    
    const welcomeText = currentVerb 
      ? (isChinese ? `嗨！我是你的 AI 助教。我們現在正在學習 "${currentVerb}"。需要例句或測驗嗎？` : `Olá! I'm here to help you master "${currentVerb}". Need an example or a quiz?`)
      : (isChinese ? `嗨！有什麼關於動詞的問題都可以問我喔！` : `Olá! I am your AI language tutor. Ask me anything about verbs!`);
      
    setMessages([{ role: 'model', text: welcomeText }]);

  }, [currentVerb, language, instructionLang]);

  // Auto-scroll logic
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input on desktop only to avoid mobile keyboard jumping
      if (window.matchMedia("(min-width: 768px)").matches) {
        inputRef.current?.focus();
      }
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatSession) return;

    console.log(`[AIChat] Sending message: "${text}"`);
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: text });
      const responseText = result.text;
      if (responseText) {
        console.log("[AIChat] Received response from model");
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("[AIChat] Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const getSuggestions = () => {
    const verb = currentVerb || 'this verb';
    const isChinese = instructionLang.includes('Chinese');

    if (isChinese) {
        return [
            `用 "${verb}" 造句`,
            `"${verb}" 怎麼變化？`,
            `"${verb}" 的常見錯誤有哪些？`,
            `考考我 "${verb}"`,
            `"${verb}" 有什麼慣用語？`
        ];
    }

    return [
      `Give me an example with "${verb}"`,
      `How do I conjugate "${verb}"?`,
      `What are common mistakes with "${verb}"?`,
      `Quiz me on "${verb}"`,
      `Any idioms using "${verb}"?`
    ];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          console.log("[AIChat] Chat opened");
          setIsOpen(true);
        }}
        className={`
          fixed z-50 transition-all duration-300 shadow-xl shadow-rose-300/40 group
          flex items-center justify-center bg-white text-rose-500 hover:text-rose-600 active:scale-90
          border border-rose-100
          
          /* Mobile: Floating Action Button (Bottom Right) */
          bottom-20 right-4 w-14 h-14 rounded-full
          
          /* Desktop: Pill Button (Top Left) */
          md:bottom-auto md:right-auto md:top-24 md:left-4 md:w-auto md:h-auto md:py-3 md:px-5 md:rounded-full md:shadow-sm md:hover:shadow-md
        `}
        aria-label="Open AI Tutor"
      >
        <Sparkles size={24} className="md:mr-2 fill-rose-100" />
        <span className="hidden md:inline font-bold tracking-tight">AI Tutor</span>
        
        {/* Notification Dot Animation */}
        <span className="absolute top-0 right-0 flex h-3 w-3 md:-top-1 md:-right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
        </span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/20 z-40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      <div className={`
        fixed z-50 flex flex-col bg-white shadow-2xl overflow-hidden
        transition-all duration-300 ease-out animate-in slide-in-from-bottom-10
        
        /* Mobile: Bottom Sheet Style */
        inset-x-0 bottom-0 h-[85vh] rounded-t-3xl border-t border-white/40
        
        /* Desktop: Floating Window Style */
        md:inset-auto md:top-24 md:left-4 md:w-[400px] md:h-[600px] md:rounded-3xl md:border md:border-rose-100
      `}>
        {/* Mobile Drag Handle Area */}
        <div 
            className="md:hidden w-full bg-white flex justify-center pt-3 pb-1 cursor-pointer touch-none border-b border-stone-50"
            onClick={() => setIsOpen(false)}
        >
            <div className="w-12 h-1.5 bg-stone-100 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-stone-100 px-5 py-4 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 border border-rose-100 shadow-sm">
                <Bot size={22} />
            </div>
            <div>
                <h3 className="font-bold text-stone-700 text-lg leading-none">AI Tutor</h3>
                <p className="text-xs text-rose-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-wide">
                    {language === 'jp' ? 'NihongoBot' : language === 'es' ? 'HispanoBot' : 'LusoBot'}
                </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <ChevronDown size={24} className="md:hidden" />
            <X size={20} className="hidden md:block" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-50/50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border
                ${msg.role === 'user' ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-rose-400 border-stone-100'}
              `}>
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              
              {/* Bubble */}
              <div className={`
                max-w-[85%] px-4 py-3 text-sm md:text-base leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-rose-500 text-white rounded-2xl rounded-br-none' 
                  : 'bg-white text-stone-600 border border-stone-100 rounded-2xl rounded-bl-none'}
              `}>
                <FormattedText text={msg.text} />
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-end gap-2 animate-in fade-in zoom-in duration-300">
               <div className="w-8 h-8 rounded-full bg-white text-rose-300 border border-stone-100 flex items-center justify-center shrink-0 shadow-sm">
                 <Bot size={16} />
               </div>
               <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-stone-100 shadow-sm">
                 <div className="flex gap-1.5 items-center h-5">
                   <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-stone-50 shrink-0 pb-[calc(env(safe-area-inset-bottom)_+_0.5rem)]">
          {/* Suggestions */}
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar scroll-smooth w-full">
              {getSuggestions().map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="whitespace-nowrap px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-semibold hover:bg-rose-100 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Lightbulb size={12} className="fill-rose-300 text-rose-400" />
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-4 pb-4 pt-1">
            <div className="relative flex items-end gap-2">
              <div className="relative flex-1">
                  <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-4 py-3 bg-stone-50 rounded-full border border-stone-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-base resize-none placeholder-stone-400 text-stone-700"
                  />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md shadow-rose-200"
              >
                <Send size={18} className="translate-x-0.5 translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}