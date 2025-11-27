'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function TestModePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [testModeUsed, setTestModeUsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const TEST_LIMIT = 5; // 5 сообщений в тестовом режиме

  useEffect(() => {
    // Проверяем, использован ли уже тестовый режим
    const used = localStorage.getItem('edem_test_mode_used') === 'true';
    if (used) {
      setTestModeUsed(true);
      return;
    }

    // Получаем или создаём sessionId
    let sid = localStorage.getItem('edem_test_session_id');
    if (!sid) {
      sid = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('edem_test_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || userMessagesCount >= TEST_LIMIT || !sessionId || testModeUsed) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Добавляем сообщение пользователя
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setUserMessagesCount((prev) => prev + 1);

    try {
      const response = await fetch('/api/test-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      const data = await response.json();

      if (data.error) {
        if (response.status === 403) {
          // Тестовый режим уже использован
          localStorage.setItem('edem_test_mode_used', 'true');
          setTestModeUsed(true);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Тестовый режим уже использован. Зарегистрируйтесь для продолжения общения.' },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `Ошибка: ${data.error}` },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response || 'Нет ответа' },
        ]);
        
        // После первого успешного ответа помечаем тестовый режим как использованный
        if (userMessagesCount === 0) {
          localStorage.setItem('edem_test_mode_used', 'true');
        }
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

  if (testModeUsed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Тестовый режим использован
          </h1>
          <p className="text-gray-400 text-lg">
            Вы уже использовали тестовый режим. Зарегистрируйтесь для продолжения общения с EDEM.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-full border-2 border-gray-700/50 text-gray-300 hover:border-amber-500/50 hover:text-amber-400 font-semibold transition-all duration-300"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            EDEM Intelligence — Тестовый режим
          </h1>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold rounded-lg hover:from-amber-300 hover:to-orange-400 transition-all"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:border-amber-500/50 transition-all"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>

      {/* Test Mode Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center">
          <p className="text-amber-400 text-sm font-medium">
            ⚡ Тестовый режим: {TEST_LIMIT} сообщений для знакомства ({userMessagesCount}/{TEST_LIMIT} использовано). 
            После использования регистрация обязательна.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-black/60 to-gray-900/40 rounded-2xl border border-white/5 min-h-[500px] flex flex-col backdrop-blur-sm">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-lg mb-2 font-semibold">Добро пожаловать в тестовый режим EDEM</p>
                <p className="text-sm">
                  Напиши что-нибудь — и почувствуй, как он отвечает. У тебя {TEST_LIMIT} сообщений.
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
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-gray-100 border border-amber-500/30'
                      : 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 text-gray-100 border border-white/5'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 px-4 py-3 rounded-2xl border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-4">
            {userMessagesCount >= TEST_LIMIT ? (
              <div className="text-center py-4 space-y-4">
                <p className="text-gray-300 mb-4">
                  Тестовый режим завершён ({TEST_LIMIT}/{TEST_LIMIT} сообщений). Зарегистрируйтесь для продолжения общения.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/30"
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
                  placeholder={`Напиши что-нибудь... (${userMessagesCount}/${TEST_LIMIT})`}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 resize-none"
                  rows={2}
                  disabled={loading || userMessagesCount >= TEST_LIMIT}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || userMessagesCount >= TEST_LIMIT}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  Отправить
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            После регистрации получишь 5 бесплатных сообщений для ознакомления или{' '}
            <Link href="/billing" className="text-amber-400 hover:text-amber-300 underline">
              выбери тариф
            </Link>
            {' '}для полного доступа.
          </p>
        </div>
      </div>
    </div>
  );
}

