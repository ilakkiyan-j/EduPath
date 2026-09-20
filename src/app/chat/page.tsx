'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  BrainCircuit,
  RotateCcw,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your EduPath Learning Assistant. I have live access to your skills, evaluations, and roadmap. Ask me anything about your learning path, like: 'Why did you change my roadmap?' or 'What am I weakest at?'",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Why did you change my roadmap?',
    'What am I weakest at right now?',
    'Why am I learning RAG before multi-agent systems?',
    'What should I learn today?',
    'How close am I to my target role?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || sending) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: json.data.reply },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Apologies, I encountered an issue retrieving your state: ' + json.error },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              EduPath Learning Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-muted-foreground">
              Grounded in your live evaluations, memory, and roadmap state
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <BrainCircuit className="w-3.5 h-3.5 text-primary" />
          <span>Context: AI Engineer (68% Readiness)</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" /> Quick Ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={sending}
            className="px-3 py-1 rounded-full bg-surface border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all shrink-0 text-xs text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 card space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'bg-surface border border-border text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}

        {sending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs text-muted-foreground flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Querying evaluation records & learner state...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask why your roadmap changed, what project to build, or today's focus..."
          disabled={sending}
          className="input flex-1 text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="btn-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
