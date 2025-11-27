'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PresentationPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const auth = sessionStorage.getItem('edem_presentation_auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Замени на свой пароль
    const correctPassword = process.env.NEXT_PUBLIC_PRESENTATION_PASSWORD || 'edem2024';
    
    if (password === correctPassword) {
      sessionStorage.setItem('edem_presentation_auth', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071018] via-[#09121a] to-[#0f1115] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0f1720] rounded-2xl p-8 border border-white/5 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#8FD3C7] to-[#3a8891] flex items-center justify-center text-2xl font-bold text-[#022]">
              E
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">EDEM Presentation</h1>
            <p className="text-gray-400 text-sm">Введите пароль для доступа</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#8FD3C7]/50 transition-colors"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#8FD3C7] to-[#46a6a0] text-[#022] font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Войти
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>EDEM — Физика Живого · Презентация</title>
<meta name="description" content="EDEM — экосистема: Физика Живого, AI 5 голосов, глиняные купола, музыка и аналитика жизни. Прототип лендинга." />
<style>
  :root{
    --bg:#0f1115; --card:#0f1720; --muted:#9aa4b2; --accent:#8FD3C7; --accent2:#ffd166; --glass:rgba(255,255,255,0.04);
    --maxw:1100px; --radius:14px; --mono: 'Roboto Mono', monospace; --ui:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  }
  *{box-sizing:border-box}
  body{font-family:var(--ui); margin:0; background:linear-gradient(180deg,#071018 0%, #09121a 60%); color:#e9eef6; -webkit-font-smoothing:antialiased}
  .wrap{max-width:var(--maxw); margin:32px auto; padding:28px}
  .top{display:flex;gap:18px;align-items:center}
  .logo{width:72px;height:72px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#3a8891);display:flex;align-items:center;justify-content:center;font-weight:700;color:#022;box-shadow:0 8px 30px rgba(0,0,0,0.6)}
  h1{margin:0;font-size:24px}
  p.lead{color:var(--muted);margin:6px 0 0}
  .grid{display:grid;grid-template-columns:1fr 380px;gap:24px;margin-top:26px}
  .card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:var(--radius); padding:18px;box-shadow:0 10px 30px rgba(2,8,12,0.6);}
  .hero{padding:28px;border-radius:20px; background:linear-gradient(180deg, rgba(143,211,199,0.06), rgba(255,209,102,0.02));}
  .kpi{display:flex;gap:14px;margin-top:18px}
  .kpi .item{background:var(--glass);padding:10px 12px;border-radius:12px;color:var(--muted);font-size:13px}
  .section{margin-top:22px}
  .h2{font-size:18px;margin:0 0 8px}
  .muted{color:var(--muted);font-size:14px}
  .features{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .tile{background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));padding:12px;border-radius:12px}
  .tile h3{margin:0;font-size:15px}
  .tile p{margin:6px 0 0;color:var(--muted);font-size:13px}
  .mock{height:380px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#071a20,#09232b);position:relative;overflow:hidden}
  .mock .pulse{position:absolute;left:20%;top:24%;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle at 40% 30%, rgba(143,211,199,0.18), rgba(143,211,199,0.02));filter:blur(18px)}
  .mock .flower{width:320px;height:320px;background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%238FD3C7"/><stop offset="1" stop-color="%23ffd166"/></linearGradient></defs><g transform="translate(100,100)"><path d="M0,-60 C18,-50 36,-30 44,-10 C52,10 48,32 30,48 C12,64 -12,64 -30,48 C-48,32 -52,10 -44,-10 C-36,-30 -18,-50 0,-60 Z" fill="url(%23g)" opacity="0.98"/></g></svg>') center/contain no-repeat}
  .cta{display:flex;gap:12px;margin-top:16px}
  .btn{background:linear-gradient(90deg,var(--accent),#46a6a0);color:#022;padding:10px 14px;border-radius:12px;font-weight:700;text-decoration:none;display:inline-block}
  .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--accent2)}
  .road{display:flex;flex-direction:column;gap:12px}
  .step{display:flex;gap:12px;align-items:flex-start}
  .step .num{width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;font-weight:700}
  .step .desc{color:var(--muted)}
  footer{margin-top:26px;color:var(--muted);font-size:13px;text-align:center}
  @media (max-width:980px){.grid{grid-template-columns:1fr} .mock{height:260px}}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="logo">E</div>
    <div>
      <h1>EDEM — Физика Живого</h1>
      <p class="lead">Экосистема: философия, AI-коуч, глиняные дома, музыка и аналитика жизни — в одном поле.</p>
    </div>
  </div>
  <div class="grid">
    <div>
      <div class="card hero">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div>
            <h2 class="h2">Манифест</h2>
            <p class="muted">EDEM — это язык живой физики: тишина, резонанс, внимание, пульс, память формы. Мы создаём продукты, которые помогают человеку вернуться в центр и действовать из него.</p>
            <div class="kpi">
              <div class="item">AI: 2 голоса (Live / Shadow)</div>
              <div class="item">Музыка: релизы & клипы</div>
              <div class="item">Дом: надувная форма + глина</div>
            </div>
            <div class="cta">
              <a class="btn" href="/login">Войти в EDEM</a>
              <a class="btn ghost" href="#about">Подробнее</a>
            </div>
          </div>
          <div style="width:360px">
            <div class="mock">
              <div class="pulse"></div>
              <div class="flower"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="h2">Архитектура</div>
        <div class="muted">EDEM строится из 5 компонентов, которые могут существовать отдельно, но работают вместе:</div>
        <div class="features" style="margin-top:12px">
          <div class="tile"><h3>Физика Живого</h3><p>Философия из 9 законов: тишина → резонанс → внимание → пульс и т.д.</p></div>
          <div class="tile"><h3>AI — два голоса</h3><p>Голос Живого — поддержка. Голос Тени — честность. Режимы под эмоции.</p></div>
          <div class="tile"><h3>Wave House</h3><p>Надувные формы + технология нанесения глины для быстрого экологичного домостроения.</p></div>
          <div class="tile"><h3>Music & Media</h3><p>Песни, клипы и визуальные средства как инструмент восстанавливающий резонанс.</p></div>
        </div>
      </div>
      <div class="section card" id="about">
        <div class="h2">Что делает продукт</div>
        <p class="muted">На уровне пользователя EDEM предлагает: личную сессию с AI (под голос), дневной анализ по HRV и поведению, генерацию практик, аудио- и видеоконтент, а также возможность получить физическую конструкцию — дом-форму.</p>
        <div class="road">
          <div class="step"><div class="num">1</div><div><b>Прототип AI</b><div class="desc">Чат с двумя голосами + режимы под эмоции.</div></div></div>
          <div class="step"><div class="num">2</div><div><b>Music Hub</b><div class="desc">Выпуск треков и коротких клипов с промо-кампанией.</div></div></div>
          <div class="step"><div class="num">3</div><div><b>Wave Mold</b><div class="desc">Производство надувных форм, тесты, локализация в Вьетнаме.</div></div></div>
          <div class="step"><div class="num">4</div><div><b>EDEM OS</b><div class="desc">Интеграция wearables → ежедневный анализ → персонализированные практики.</div></div></div>
        </div>
      </div>
      <div class="section card" id="get-started">
        <div class="h2">Готов запустить?</div>
        <p class="muted">Что мы можем сделать прямо сейчас для запуска первых денег и аудитории.</p>
        <ol style="color:var(--muted)">
          <li>Сделать 3 клипа: тизер, full visual, vertical cuts для Reels.</li>
          <li>Запустить лендинг + подписку (email first).</li>
          <li>Простой платный воркшоп: "Сажай цветок — 7 дней" (paywall).</li>
        </ol>
        <div style="margin-top:10px"><a class="btn" href="#contact" id="startBtn">Собрать план</a></div>
      </div>
    </div>
    <div>
      <div class="card">
        <h3 class="h2">Промо-блок</h3>
        <p class="muted">Коротко — что можно предложить сейчас, чтобы продавать.</p>
        <ul style="color:var(--muted)">
          <li>Пакет "Сон/Релакс" — трек + 7 дней аудио-практик.</li>
          <li>Пакет "Дом-модуль" — предзаказ на форму и инструкцию.</li>
          <li>Подписка PRO — доступ к двум голосам и weekly insights.</li>
        </ul>
        <div style="margin-top:10px"><a class="btn" id="buyBtn">Присоединиться</a></div>
      </div>
      <div class="card section" style="margin-top:12px">
        <h3 class="h2">Техническое</h3>
        <p class="muted">Короткая спецификация формы (для фабрики): база 5.5m, высота 3.3m, многокамерная конструкция, текстура для сцепления, RF-сварка, испытание нагрузки.</p>
        <a class="btn ghost" href="#spec" id="specBtn">Скачать RFQ</a>
      </div>
      <div class="card section" style="margin-top:12px">
        <h3 class="h2">Roadmap (первые 90 дней)</h3>
        <ol style="color:var(--muted)">
          <li>Неделя 1-2 — landing + email capture + 3 Reels</li>
          <li>Неделя 3-4 — мини-релиз трека + 1 клип</li>
          <li>Месяц 2 — preorders формы, тест-пилот</li>
          <li>Месяц 3 — запуск подписки и первый продукт</li>
        </ol>
      </div>
    </div>
  </div>
  <footer>
    © EDEM — Физика Живого · Made with intention · <span id="buildInfo">Версия: 0.1</span>
  </footer>
</div>
<script>
document.getElementById('startBtn')?.addEventListener('click', (e)=>{
  e.preventDefault();
  alert('Я соберу план запуска: 1) Клипы 2) Лендинг 3) Подписка — формирую roadmap и отправлю.');
});
document.getElementById('buyBtn')?.addEventListener('click', (e)=>{
  e.preventDefault();
  const email = prompt('Оставь e-mail для приглашения в PRO (пример: mail@example.com)');
  if(email && email.includes('@')){
    alert('Спасибо — мы добавили ' + email + ' в лист ожидания.');
  } else if(email) alert('Неверный e-mail');
});
document.getElementById('specBtn')?.addEventListener('click', (e)=>{
  e.preventDefault();
  const txt = \`RFQ EDEM Wave Mold\\n\\nBase: 5500 mm\\nHeight: 3300 mm\\nMaterial: TPU 1.2-1.5 mm or PVC 1.5-2.0 mm\\nChambers: 8-12\\nSurface texture: hex grid 1.5mm\\nWelding: RF double-pass\\nLoad test: 200-250 kg for 12h\`;
  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='EDEM_RFQ.txt'; a.click(); URL.revokeObjectURL(url);
});
const flower = document.querySelector('.flower');
let t=0; setInterval(()=>{ t+=0.04; if(flower) flower.style.transform = \`translateY(\${Math.sin(t)*6}px) rotate(\${Math.sin(t/2)*3}deg)\` }, 60);
</script>
</body>
</html>
    ` }} />
  );
}

