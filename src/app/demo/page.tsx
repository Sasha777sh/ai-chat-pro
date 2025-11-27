'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DemoPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const DEMO_LIMIT = 5; // 5 сообщений пользователя

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || userMessagesCount >= DEMO_LIMIT) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Добавляем сообщение пользователя
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setUserMessagesCount((prev) => prev + 1);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Ошибка: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response || 'Нет ответа' },
        ]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка соединения';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Ошибка: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-edem-dark text-edem-main">
      {/* Header */}
      <div className="border-b border-edem-line bg-edem-secondary-bg/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-edem-main text-glow-edem">EDEM Intelligence — Демо</h1>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="px-4 py-2 bg-edem-live hover:bg-edem-live/80 text-white font-semibold rounded-lg transition-colors"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border border-edem-line hover:border-edem-muted text-edem-secondary rounded-lg transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="bg-edem-sage/20 border-b border-edem-sage/50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center">
          <p className="text-edem-sage text-sm">
            ⚡ Демо-режим: {DEMO_LIMIT} сообщения для знакомства ({userMessagesCount}/{DEMO_LIMIT} использовано). Для полного доступа —{' '}
            <Link href="/signup" className="underline font-semibold hover:text-edem-sage/80">
              зарегистрируйся
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card-edem min-h-[500px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-edem-secondary py-12">
                <p className="text-lg mb-2 text-glow-edem">Добро пожаловать в демо EDEM Intelligence</p>
                <p className="text-sm text-edem-muted">
                  Напиши что-нибудь — и почувствуй, как он отвечает.
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 inner-shadow-edem ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-edem-surface to-edem-secondary-bg text-edem-main'
                      : 'card-edem text-edem-main'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="card-edem px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-edem-live rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-edem-live rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-edem-live rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-edem-line p-4">
            {userMessagesCount >= DEMO_LIMIT ? (
              <div className="text-center py-4">
                <p className="text-edem-secondary mb-4">
                  Демо завершено ({DEMO_LIMIT}/{DEMO_LIMIT} сообщений). Зарегистрируйся для продолжения общения.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-6 py-3 bg-edem-live hover:bg-edem-live/80 text-white font-semibold rounded-xl transition-colors"
                >
                  Зарегистрироваться и продолжить
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Напиши что-нибудь... (${userMessagesCount}/${DEMO_LIMIT})`}
                  className="flex-1 bg-edem-surface border border-edem-line rounded-xl px-4 py-3 text-edem-main placeholder:text-edem-muted focus:outline-none focus:border-edem-live resize-none"
                  rows={2}
                  disabled={loading || userMessagesCount >= DEMO_LIMIT}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || userMessagesCount >= DEMO_LIMIT}
                  className="px-6 py-3 bg-edem-live hover:bg-edem-live/80 disabled:bg-edem-surface disabled:text-edem-muted text-white font-semibold rounded-xl transition-colors"
                >
                  Отправить
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-edem-muted text-sm">
          <p>
            После регистрации получишь 5 бесплатных сообщений для ознакомления или{' '}
            <Link href="/billing" className="text-edem-live hover:text-edem-live/80">
              выбери тариф
            </Link>
            {' '}для полного доступа.
          </p>
        </div>
      </div>
    </div>
  );
}

