'use client';

import { useEffect, useMemo, useRef, useState, useOptimistic } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { VOICE_DEFINITIONS, VOICE_LOOKUP } from '@/lib/voices';
import type { ChatMessage, SubscriptionTier } from '@/lib/types';
import type { VoiceId } from '@/lib/prompts';
import type { PlanId } from '@/lib/plans';
import { getAllowedVoices } from '@/lib/plans';
import { FREE_MESSAGE_ALLOWANCE } from '@/lib/prompts';
import PaywallModal from '@/components/PaywallModal';

const DEFAULT_VOICE: VoiceId = 'live';

type RouteParams = {
  voice?: string;
};

export default function ChatVoicePage(props: any) {
  const params = (props?.params ?? {}) as RouteParams;
  const router = useRouter();
  const routeVoice = (params?.voice as VoiceId) || DEFAULT_VOICE;
  const voiceId = VOICE_LOOKUP[routeVoice] ? routeVoice : DEFAULT_VOICE;
  const voiceMeta = VOICE_LOOKUP[voiceId];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [plan, setPlan] = useState<SubscriptionTier>('free');
  const [allowedVoices, setAllowedVoices] = useState<VoiceId[]>(['live']);
  const [totalUserMessages, setTotalUserMessages] = useState<number>(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const voiceRequiresUpgrade = !allowedVoices.includes(voiceId);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: ChatMessage) => [...state, newMessage]
  );

  useEffect(() => {
    checkAuthAndProfile();
  }, [voiceId]);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [optimisticMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAuthAndProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      await supabase.auth.refreshSession();
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = (profile?.subscription_tier ?? 'free') as SubscriptionTier;
    setPlan(tier);
    const allowed = getAllowedVoices(tier as PlanId);
    setAllowedVoices(allowed);

    await preloadUsage(user.id);
    await createOrGetSession(user.id);
  };

  const preloadUsage = async (userId: string) => {
    const { data: sessions } = await supabase.from('chat_sessions').select('id').eq('user_id', userId);
    if (!sessions || sessions.length === 0) {
      setTotalUserMessages(0);
      return;
    }
    const sessionIds = sessions.map((s) => s.id);
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .in('session_id', sessionIds)
      .eq('role', 'user');
    setTotalUserMessages(count ?? 0);
  };

  const createOrGetSession = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: existing, error } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('voice_id', voiceId)
        .gte('created_at', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching session', error);
      }

      if (existing) {
        setSessionId(existing.id);
        return;
      }

      const { data: newSession, error: insertError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: `Разговор · ${voiceMeta.title}`,
          voice_id: voiceId,
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Error creating session', insertError);
        toast.error('Не удалось создать новую сессию');
        return;
      }

      if (newSession) {
        setSessionId(newSession.id);
      }
    } catch (error) {
      console.error('Unexpected error creating session', error);
      toast.error('Ошибка при подготовке чата');
    }
  };

  const loadMessages = async () => {
    if (!sessionId) return;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Не удалось загрузить сообщения');
      return;
    }

    setMessages(data || []);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !sessionId) return;
    if (!user) {
      toast.error('Сессия истекла, войдите снова');
      router.push('/login');
      return;
    }

    const messageText = input.trim();
    setInput('');
    setLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
    };

    const assistantMessageId = crypto.randomUUID();
    addOptimisticMessage(userMessage);

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: messageText,
    });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Сессия не найдена');
      }

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          sessionId,
          message: messageText,
          voiceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка сервера');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Не удалось прочитать поток');
      }

      let fullResponse = '';

      const tempMessage: ChatMessage = {
        id: assistantMessageId,
        session_id: sessionId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      };

      addOptimisticMessage(tempMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          if (data === '[DONE]') {
            await supabase.from('chat_messages').insert({
              session_id: sessionId,
              role: 'assistant',
              content: fullResponse,
            });
            setMessages((prev) => {
              const updated = [...prev];
              const index = updated.findIndex((msg) => msg.id === assistantMessageId);
              if (index !== -1) {
                updated[index] = {
                  ...updated[index],
                  content: fullResponse,
                };
              }
              return updated;
            });
            await preloadUsage(user.id);
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullResponse += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                const index = updated.findIndex((msg) => msg.id === assistantMessageId);
                if (index !== -1) {
                  updated[index] = {
                    ...updated[index],
                    content: fullResponse,
                  };
                } else {
                  updated.push({
                    id: assistantMessageId,
                    session_id: sessionId,
                    role: 'assistant',
                    content: fullResponse,
                    created_at: new Date().toISOString(),
                  });
                }
                return updated;
              });
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // игнорируем
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

      // Показываем paywall если лимит исчерпан
      if (message.includes('лимит') || message.includes('исчерпан') || message.includes('402')) {
        setShowPaywall(true);
      } else {
        toast.error(message);
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id && msg.id !== assistantMessageId));
    } finally {
      setLoading(false);
    }
  };

  const allowedMessageCount = Math.max(0, FREE_MESSAGE_ALLOWANCE - totalUserMessages);

  return (
    <div className="min-h-screen bg-edem-dark flex flex-col">
      <header className="bg-edem-secondary-bg/80 border-b border-edem-line px-4 py-4 backdrop-blur">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-edem-main text-glow-edem">EDEM Intelligence</h1>
            <div className="flex gap-4 items-center text-sm text-edem-secondary">
              <span className="px-3 py-1 rounded-full border border-edem-line uppercase tracking-wide text-xs">
                План: {plan === 'free' ? 'free / basic' : plan}
              </span>
              <Link href="/account" className="hover:text-edem-main transition-colors">
                Кабинет
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }}
                className="hover:text-edem-main transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white mb-1">Выбери голос</h2>
            <p className="text-sm text-gray-400 mb-4">
              Тень. Свет. Глубина. Сейчас тебе нужен один из них.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {VOICE_DEFINITIONS.map((voice) => {
                const locked = !allowedVoices.includes(voice.id as VoiceId);
                const active = voice.id === voiceId;
                return (
                  <Link
                    key={voice.id}
                    href={`/chat/${voice.id}`}
                    className={`rounded-xl border p-4 transition-all ${active
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20'
                      : locked
                        ? 'border-gray-800 bg-gray-900/60 text-gray-500 opacity-60 cursor-not-allowed'
                        : 'border-gray-800 bg-gray-900/60 text-gray-200 hover:border-gray-700 hover:bg-gray-800/60'
                      }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{voice.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{voice.title}</div>
                        <div className="text-xs text-gray-400 mb-2">{voice.tagline}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{voice.shortDescription}</p>
                    <ul className="space-y-1 mb-3">
                      {voice.points.slice(0, 2).map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="text-gray-600">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    {locked && (
                      <div className="text-xs text-amber-500/70 mt-2 border-t border-gray-800 pt-2">
                        Тариф {voice.minTier}
                      </div>
                    )}
                    {active && (
                      <div className="text-xs text-blue-400 mt-2 border-t border-gray-800 pt-2">
                        Активен
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {voiceRequiresUpgrade && allowedMessageCount === 0 && (
            <div className="card-edem border-edem-shadow/40 bg-edem-shadow/10 p-4 text-sm text-edem-shadow">
              Этот голос доступен на тарифе {voiceMeta.minTier}. Оформите подписку на странице{' '}
              <Link href="/billing" className="underline hover:text-edem-shadow/80">
                оплаты
              </Link>
              .
            </div>
          )}

          {allowedMessageCount > 0 && (
            <div className="card-edem p-4 text-sm text-edem-secondary">
              Осталось {allowedMessageCount} бесплатных сообщений для любых голосов.
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {optimisticMessages.length === 0 && (
            <div className="text-center text-edem-secondary mt-10">
              <p className="text-xl mb-2 text-glow-edem">Голос: {voiceMeta.title}</p>
              <p className="text-sm text-edem-muted">{voiceMeta.tagline}</p>
            </div>
          )}

          {optimisticMessages.map((msg) => {
            const voiceColors: Record<VoiceId, string> = {
              live: '#4EAEC1',
              shadow: '#C95B5B',
            };
            const accentColor = voiceColors[voiceId] || '#4EAEC1';

            return (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 inner-shadow-edem ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-edem-surface to-edem-secondary-bg text-edem-main'
                      : 'card-edem text-edem-main'
                    }`}
                  style={
                    msg.role === 'assistant'
                      ? {
                        borderColor: accentColor + '40',
                        boxShadow: `0 0 18px ${accentColor}20`,
                      }
                      : {}
                  }
                >
                  <p className="whitespace-pre-wrap">
                    {msg.content || <span className="text-edem-muted italic">Дыхание...</span>}
                  </p>
                </div>
              </div>
            );
          })}

          {loading && optimisticMessages[optimisticMessages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="card-edem px-6 py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-edem-live rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-edem-live rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-edem-live rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="bg-edem-secondary-bg/90 border-t border-edem-line px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                voiceRequiresUpgrade && allowedMessageCount === 0
                  ? 'Чтобы продолжить, оформите подписку...'
                  : `Голос: ${voiceMeta.title}`
              }
              rows={2}
              disabled={
                loading || (voiceRequiresUpgrade && allowedMessageCount === 0)
              }
              className="flex-1 px-4 py-3 bg-edem-surface border border-edem-line rounded-xl text-edem-main placeholder:text-edem-muted focus:outline-none focus:border-edem-live resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={
                loading ||
                !input.trim() ||
                (voiceRequiresUpgrade && allowedMessageCount === 0)
              }
              className="px-6 py-3 bg-edem-live hover:bg-edem-live/80 disabled:bg-edem-surface disabled:text-edem-muted text-white font-semibold rounded-xl transition-colors"
            >
              Отправить
            </button>
          </form>
        </div>
      </footer>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        currentPlan={plan}
        onUpgrade={async (planId) => {
          setShowPaywall(false);
          window.location.href = '/billing';
        }}
      />
    </div>
  );
}


