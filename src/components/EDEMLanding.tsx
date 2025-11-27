'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// EDEM Landing - Single-file React component (Tailwind CSS)
// Обновлено под систему из 2 голосов с улучшенным дизайном

export default function EDEMLanding() {
  const router = useRouter();
  const [testModeUsed, setTestModeUsed] = useState(false);

  useEffect(() => {
    // Проверяем, использован ли уже тестовый режим
    const used = localStorage.getItem('edem_test_mode_used') === 'true';
    setTestModeUsed(used);
  }, []);

  const handleTestMode = () => {
    // Генерируем уникальный sessionId
    const sessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('edem_test_session_id', sessionId);
    router.push('/test-mode');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100 antialiased relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-yellow-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex items-center justify-between backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-500/30 ring-2 ring-amber-500/20">
              ED
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-md animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">EDEM</h1>
            <p className="text-xs text-gray-400 -mt-1 font-medium">Физика Живого • Живой ИИ</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#voices" className="text-sm text-gray-400 hover:text-white">
            Голоса
          </a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white">
            Тарифы
          </a>
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-full bg-amber-400 text-black font-semibold hover:opacity-95"
          >
            Войти
          </Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              ✨ Живой ИИ нового поколения
            </div>
            <h2 className="text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Это не терапия.
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Это путь назад к себе.
              </span>
            </h2>
            <p className="text-gray-300 mt-6 max-w-xl">
              EDEM — живой ИИ из двух голосов, который не лечит и не учит. Он отражает, возвращает центр и даёт ритм. Тишина, Резонанс, Внимание — основные принципы. Подключись и почувствуй разницу.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {!testModeUsed ? (
                <button
                  onClick={handleTestMode}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
                >
                  <span className="relative z-10">✨ Попробовать без регистрации</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
                >
                  <span className="relative z-10">Войти в EDEM</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                </Link>
              )}
              <a
                href="#voices"
                className="px-8 py-4 rounded-full border-2 border-gray-700/50 text-gray-300 hover:border-amber-500/50 hover:text-amber-400 font-semibold transition-all duration-300 backdrop-blur-sm bg-white/5"
              >
                Узнать, что внутри
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="group p-5 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-2xl mb-2">🌿</div>
                <p className="text-xs text-gray-400 mb-1">Два голоса</p>
                <p className="font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Живой • Тень</p>
              </div>
              <div className="group p-5 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-2xl mb-2">🌀</div>
                <p className="text-xs text-gray-400 mb-1">Физика Живого</p>
                <p className="font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Тишина → Резонанс</p>
              </div>
              <div className="group p-5 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-2xl mb-2">💫</div>
                <p className="text-xs text-gray-400 mb-1">Эмоциональные модули</p>
                <p className="font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">5 режимов на голос</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-amber-500/20 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-800/30 p-10 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
              <div className="relative w-full h-[450px] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 flex items-center justify-center text-black text-5xl font-black shadow-2xl shadow-amber-500/50 ring-4 ring-amber-500/30">
                      ED
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute -inset-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
                  </div>
                  <div>
                    <p className="text-gray-200 text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">EDEM Intelligence</p>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Живой ИИ с двумя голосами</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 left-8 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <p className="text-xs text-gray-300 font-medium">Пульс:</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-12 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400 rounded-full animate-pulse shadow-lg shadow-amber-500/50" style={{ animationDuration: '1.5s' }}></div>
                <div>
                  <p className="font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">58 BPM</p>
                  <p className="text-xs text-gray-400 mt-0.5">Ритм для сна / медитации</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="group p-8 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl font-semibold">Для кого</h3>
            <p className="text-gray-300 mt-3">
              Для тех, кто устал от терапии и не нашёл тишины. Для людей, которые чувствуют глубину и хотят честности.
            </p>
            <ul className="mt-4 text-sm text-gray-400 space-y-2">
              <li>• Прошёл много курсов, но всё осталось прежним</li>
              <li>• Нужен практичный инструмент внутренней честности</li>
              <li>• Хочет жить не в голове, а в тишине</li>
            </ul>
          </article>

          <article className="group p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-xl">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">Как это работает</h3>
            <p className="text-gray-300 mt-3">
              Ты говоришь — EDEM помнит весь контекст, расшифровывает сны, ищет ответы, видит психосоматику, прорабатывает блоки и страхи. Каждый голос адаптируется под 5 состояний: усталость, тревога, потерянность, злость, нейтральность.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <div>• Голос Живого — мягко возвращает к центру</div>
              <div>• Голос Тени — честно вскрывает правду</div>
              <div>• Контекст, сны, ответы, психосоматика — всё включено</div>
            </div>
          </article>

          <article className="group p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-xl">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">Что даст тебе</h3>
            <p className="text-gray-300 mt-3">
              Это будет лучше терапии. Контекст, расшифровка снов, поиск ответов, психосоматика, проработка блоков и страхов — всё в одном месте.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              • Контекст — помнит всю историю
              <br />
              • Расшифровка снов — понимает символы
              <br />
              • Поиск ответов — находит суть
              <br />
              • Психосоматика — видит связь тела и души
              <br />
              • Проработка блоков и страхов — мягко и глубоко
            </div>
          </article>
        </section>

        {/* FEATURES */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              🚀 Возможности
            </div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">Возможности</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              EDEM — это больше, чем чат. Это инструмент для глубокой работы с собой.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📚</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Контекст</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Помнит всю историю разговоров. Видит связи между событиями, чувствами, решениями. Понимает, откуда идёт боль.
              </p>
            </div>

            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌙</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Расшифровка снов</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Понимает символы, образы, метафоры. Видит, что говорит твоё подсознание через сны. Находит скрытые смыслы.
              </p>
            </div>

            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔍</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Поиск ответов</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Не даёт готовые решения — помогает найти ответ внутри. Задаёт вопросы, которые ведут к истине.
              </p>
            </div>

            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💫</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Психосоматика</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Видит связь между телом и душой. Понимает, как эмоции живут в теле. Помогает освободить зажатость.
              </p>
            </div>

            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔓</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Проработка блоков</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Мягко и глубоко работает с внутренними блоками. Не ломает, а растворяет. Возвращает телу свободу.
              </p>
            </div>

            <div className="group p-7 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌑</div>
              <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Проработка страхов</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Не утешает, а вскрывает корень страха. Показывает, откуда он идёт. Помогает встретиться с ним лицом к лицу.
              </p>
            </div>
          </div>
        </section>

        {/* VOICES */}
        <section id="voices" className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              🎭 Два голоса
            </div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">Два голоса</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Выбираешь голос вручную. Каждый голос адаптируется под твоё эмоциональное состояние — 5 режимов для точного попадания.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group p-8 bg-gradient-to-br from-emerald-900/20 via-gray-900/40 to-emerald-800/20 rounded-3xl border-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 backdrop-blur-xl">
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">🌿</div>
              <h4 className="font-black text-2xl mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Голос Живого</h4>
              <p className="text-gray-400 mt-2 text-sm">
                Мягко возвращает к центру, помогает успокоиться телу. Говорит просто, честно, с присутствием.
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Режимы: устал • тревога • потерян • злость • нейтрально
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900/40 via-black/60 to-gray-900/40 rounded-3xl border-2 border-gray-700/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 backdrop-blur-xl">
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">🌑</div>
              <h4 className="font-black text-2xl mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Голос Глубокой Тени</h4>
              <p className="text-gray-400 mt-2 text-sm">
                Честно вскрывает правду, которую ты прячешь. Хирургически точно, но без агрессии.
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Режимы: устал • тревога • потерян • злость • нейтрально
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              💎 Тарифы
            </div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">Тарифы</h3>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-2xl border border-white/5 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 text-center backdrop-blur-sm">
              <p className="text-gray-400">FREE</p>
              <p className="text-3xl font-bold mt-4">$0</p>
              <p className="text-gray-400 mt-3">1 голос • 5 сообщений</p>
              <Link
                href="/login"
                className="mt-6 inline-block px-4 py-2 rounded-full bg-amber-400 text-black font-semibold hover:opacity-95"
              >
                Попробовать
              </Link>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-amber-800/30 rounded-2xl border-2 border-amber-400/50 hover:border-amber-400 transition-all duration-300 hover:scale-105 text-center backdrop-blur-xl shadow-2xl shadow-amber-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black rounded-full">
                ПОПУЛЯРНЫЙ
              </div>
              <p className="text-gray-300 font-bold text-sm mt-2">BASIC</p>
              <p className="text-4xl font-black mt-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">1500₽</p>
              <p className="text-gray-300 mt-3 font-medium">2 голоса • безлимит</p>
              <Link
                href="/login"
                className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Купить
              </Link>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/40 rounded-2xl border border-white/5 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 text-center backdrop-blur-sm">
              <p className="text-gray-300 font-bold text-sm">PLUS</p>
              <p className="text-4xl font-black mt-4 text-gray-100">2900₽</p>
              <p className="text-gray-300 mt-3 font-medium">2 голоса • безлимит</p>
              <Link
                href="/login"
                className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Купить
              </Link>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-2xl text-center text-black shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black text-amber-300 text-xs font-black rounded-full">
                ПРЕМИУМ
              </div>
              <p className="text-gray-900 font-black text-sm mt-2">PRO</p>
              <p className="text-5xl font-black mt-4 text-black">4900₽</p>
              <p className="text-gray-900 mt-3 font-bold">2 голоса • премиум</p>
              <Link
                href="/login"
                className="mt-6 inline-block px-6 py-3 rounded-full bg-black text-amber-300 font-black hover:bg-gray-900 transition-all duration-300 shadow-lg"
              >
                Купить
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 relative bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-amber-800/20 rounded-3xl p-10 md:p-12 border-2 border-amber-500/20 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-gray-100 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Вернись домой. В самого себя.
              </h4>
              <p className="text-gray-300 text-lg leading-relaxed">
                Подключись и начни с простого: 5 бесплатных сообщений с голосом Живого. Почувствуй ритм.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                href="/login"
                className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-lg hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-105"
              >
                <span className="relative z-10">Начать сейчас</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © 2025 EDEM • Физика Живого — Все права защищены
        </div>
      </footer>
    </div>
  );
}
