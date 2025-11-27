'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DomePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const auth = sessionStorage.getItem('edem_dome_auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Замени на свой пароль
    const correctPassword = process.env.NEXT_PUBLIC_DOME_PASSWORD || 'edem2024';
    
    if (password === correctPassword) {
      sessionStorage.setItem('edem_dome_auth', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f6f7f9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#e9d6bf] to-[#d9c1a3] flex items-center justify-center text-2xl font-bold text-[#5a4428]">
              ED
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">EDEM DOM</h1>
            <p className="text-gray-500 text-sm">Введите пароль для доступа к презентации</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b76ef] focus:ring-2 focus:ring-[#0b76ef]/20 transition-all"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#0b76ef] text-white font-bold rounded-xl hover:bg-[#065bc3] transition-colors"
            >
              Войти
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
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
<title>EDEM — правильная форма глиняного купола (визуализация + лендинг)</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root{
    --bg:#f6f7f9;
    --card:#ffffff;
    --muted:#6b6f76;
    --accent:#0b76ef;
    --accent-dark:#065bc3;
    --brown:#b58f6b;
    --beige:#f3efe9;
    --glass: rgba(255,255,255,0.7);
  }
  body{font-family: Inter, Roboto, Arial, sans-serif; background:var(--bg); color:#111; margin:0;padding:0; -webkit-font-smoothing:antialiased}
  .wrap{max-width:1200px;margin:18px auto;padding:20px}
  header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
  .logo{display:flex;align-items:center;gap:12px}
  .logo .mark{width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,#e9d6bf,#d9c1a3);display:flex;align-items:center;justify-content:center;font-weight:700;color:#5a4428}
  .logo h1{font-size:18px;margin:0}
  nav{display:flex;gap:12px;align-items:center}
  nav a{color:var(--muted);text-decoration:none;font-size:14px;padding:8px 12px;border-radius:8px}
  nav a.cta{background:var(--accent);color:#fff}
  .hero{display:grid;grid-template-columns:1fr 620px;gap:20px;align-items:start;margin-bottom:20px}
  .hero .txt{background:var(--card);padding:26px;border-radius:14px;box-shadow:0 6px 22px rgba(10,10,20,0.06)}
  .kicker{font-size:13px;color:var(--muted);margin-bottom:6px}
  .headline{font-size:28px;line-height:1.05;margin:0 0 12px}
  .lead{color:var(--muted);margin-bottom:16px}
  .hero .actions{display:flex;gap:10px;flex-wrap:wrap}
  .btn{display:inline-block;padding:10px 16px;border-radius:10px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600}
  .btn.secondary{background:transparent;color:var(--accent);border:1px solid rgba(11,118,239,0.12)}
  .card{background:var(--card);border-radius:12px;padding:14px;box-shadow:0 6px 18px rgba(10,10,20,0.04);}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .features{display:flex;flex-direction:column;gap:10px;margin-top:14px}
  .feature{display:flex;gap:12px;align-items:flex-start}
  .feature .ico{width:46px;height:46px;border-radius:10px;background:var(--beige);display:flex;align-items:center;justify-content:center;color:var(--brown);font-weight:700}
  .plan{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:10px;border:1px solid #f0ece8}
  footer{margin-top:28px;padding:18px 0;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
  .canvas-wrap{background:transparent;border-radius:12px;padding:10px}
  .params{max-width:320px}
  .params label{display:block;margin:8px 0 4px;font-size:13px;color:var(--muted)}
  input[type=range]{width:100%}
  .hint{font-size:13px;color:var(--muted);margin-top:8px}
  .legend{font-size:13px;color:#333;margin-top:8px}
  .section{margin-bottom:20px}
  @media(max-width:1050px){
    .hero{grid-template-columns:1fr;gap:16px}
    .grid3{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="logo">
      <div class="mark">ED</div>
      <div>
        <h1>EDEM — Дом из глины и воздуха</h1>
        <div style="font-size:12px;color:var(--muted)">Экологичные купола. Быстро. Дёшево. Дышащие.</div>
      </div>
    </div>
    <nav>
      <a href="#tech">Технология</a>
      <a href="#plans">Планировки</a>
      <a href="#pricing">Цены</a>
      <a class="cta" href="#contact">Получить расчёт</a>
    </nav>
  </header>
  <section class="hero">
    <div class="txt card">
      <div class="kicker">Новый формат жилья</div>
      <h2 class="headline">EDEM DOM — первый дом, который вырос из земли.</h2>
      <p class="lead">Надувная форма + 10–12 см натуральной глины → дом 25 м² за 48 часов. Экологично, дешёво, просто — подходит для жизни, студии, эко-курорта.</p>
      <div class="features">
        <div class="feature"><div class="ico">1</div><div><b>Быстро</b><div style="color:var(--muted)">25 м² готов за 48 часов</div></div></div>
        <div class="feature"><div class="ico">2</div><div><b>Дёшево</b><div style="color:var(--muted)">Форма многоразовая — себестоимость дома падает</div></div></div>
        <div class="feature"><div class="ico">3</div><div><b>Тепло и дышит</b><div style="color:var(--muted)">Глина держит комфортную температуру без кондиционера</div></div></div>
      </div>
      <div class="actions" style="margin-top:14px">
        <a class="btn" href="#pricing">Получить расчёт</a>
        <a class="btn secondary" href="#tech">Как это работает</a>
      </div>
      <div style="margin-top:12px;color:var(--muted);font-size:13px">Хочешь 3D-модель? Нажми «Получить расчёт» — вышлю SVG/DXF для фабрики.</div>
    </div>
    <div class="card canvas-wrap" style="padding:16px">
      <svg id="canvas" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet" style="width:100%;height:420px">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#000" flood-opacity="0.12"/>
          </filter>
        </defs>
        <rect x="0" y="560" width="1200" height="140" fill="#eef2f5" />
        <path id="domePath" d="M150 560 C 230 420, 330 300, 600 260 C 870 300, 970 420, 1050 560 L 150 560 Z" fill="#e9d6bf" stroke="#b58f6b" stroke-width="3" filter="url(#shadow)"/>
        <path id="clayLayer" d="M130 560 C 210 410, 320 285, 600 248 C 880 285, 990 410, 1070 560 L 130 560 Z" fill="rgba(160,110,60,0.12)"/>
        <line id="equator" x1="300" y1="360" x2="900" y2="360" stroke="#5a4a3c" stroke-dasharray="6 6" stroke-width="1.6"/>
        <rect id="baseBand" x="150" y="540" width="900" height="20" fill="#d2b89b" opacity="0.9"/>
        <line x1="150" y1="580" x2="1050" y2="580" stroke="#333" stroke-width="1"/>
        <text x="600" y="600" text-anchor="middle" font-size="16" fill="#333">База: 5500 mm (масштаб)</text>
        <line x1="600" y1="560" x2="600" y2="260" stroke="#333" stroke-dasharray="4 4"/>
        <text x="620" y="260" font-size="14" fill="#333">Высота: 3300 mm</text>
        <g transform="translate(40,30)">
          <rect x="0" y="0" width="360" height="200" fill="#fff" stroke="#eee" rx="8"/>
          <text x="12" y="18" font-size="13" fill="#333">Вертикальный разрез</text>
          <path id="slicePath" d="M50 170 C 95 120, 160 60, 240 50 C 320 60, 350 120, 305 170" fill="#e9d6bf" stroke="#b58f6b" stroke-width="2"/>
          <line x1="190" y1="170" x2="190" y2="50" stroke="#333" stroke-dasharray="3 3"/>
          <text x="196" y="40" font-size="12" fill="#333">Экватор: самая широкая</text>
        </g>
        <g transform="translate(760,30)">
          <rect x="0" y="0" width="380" height="200" fill="#fff" stroke="#eee" rx="8"/>
          <text x="12" y="18" font-size="13" fill="#333">План сверху</text>
          <ellipse cx="190" cy="110" rx="140" ry="120" fill="#f3efe9" stroke="#b58f6b" stroke-width="2"/>
          <circle cx="190" cy="110" r="34" fill="#d9c1a3"/>
          <text x="190" y="200" font-size="12" fill="#333" text-anchor="middle">Диаметр экватора — 5500 mm</text>
        </g>
        <g>
          <rect x="40" y="580" width="320" height="100" rx="10" fill="#fff" stroke="#eee"/>
          <text x="60" y="600" font-size="13" fill="#333">Принципы формы:</text>
          <text x="60" y="617" font-size="12" fill="#555">• Середина — самая широкая (экватор)</text>
          <text x="60" y="634" font-size="12" fill="#555">• Верх — сужается (арочная опора)</text>
          <text x="60" y="651" font-size="12" fill="#555">• Низ — ровный/слегка расширенный для опоры</text>
        </g>
      </svg>
      <div style="display:flex;gap:10px;margin-top:12px;align-items:center;justify-content:space-between">
        <div style="flex:1">
          <div style="font-size:13px;color:var(--muted)">Параметры (для фабрики)</div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <div style="background:#fff;padding:8px;border-radius:8px;border:1px solid #f0ece8">
              <div style="font-size:12px;color:var(--muted)">База</div>
              <div style="font-weight:700">5500 mm</div>
            </div>
            <div style="background:#fff;padding:8px;border-radius:8px;border:1px solid #f0ece8">
              <div style="font-size:12px;color:var(--muted)">Высота</div>
              <div style="font-weight:700">3300 mm</div>
            </div>
            <div style="background:#fff;padding:8px;border-radius:8px;border:1px solid #f0ece8">
              <div style="font-size:12px;color:var(--muted)">Камеры</div>
              <div style="font-weight:700">10</div>
            </div>
          </div>
        </div>
        <div>
          <a class="btn" href="#contact">Заказать форму</a>
        </div>
      </div>
    </div>
  </section>
  <section id="tech" class="section">
    <div class="card">
      <h3>Как это работает — технология EDEM</h3>
      <p style="color:var(--muted)">Коротко: надувная форма → наносим глину 10–12 см → частичное высыхание → снимаем форму → остаётся целостная глиняная оболочка.</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px">
        <div class="plan">
          <div style="font-weight:700;color:var(--brown);width:36px;height:36px;border-radius:8px;background:var(--beige);display:flex;align-items:center;justify-content:center">1</div>
          <div>
            <div style="font-weight:700">Форма</div>
            <div style="color:var(--muted)">TPU/PVC, RF-сварка, 8–12 камер</div>
          </div>
        </div>
        <div class="plan">
          <div style="font-weight:700;color:var(--brown);width:36px;height:36px;border-radius:8px;background:var(--beige);display:flex;align-items:center;justify-content:center">2</div>
          <div>
            <div style="font-weight:700">Наносим глину</div>
            <div style="color:var(--muted)">Слой 10–12 см, армирование, текстура сцепления</div>
          </div>
        </div>
        <div class="plan">
          <div style="font-weight:700;color:var(--brown);width:36px;height:36px;border-radius:8px;background:var(--beige);display:flex;align-items:center;justify-content:center">3</div>
          <div>
            <div style="font-weight:700">Съём и финиш</div>
            <div style="color:var(--muted)">Дефляция формы, обработка швов, покрытие</div>
          </div>
        </div>
      </div>
      <div style="margin-top:12px;color:var(--muted)">
        <b>Технические требования для фабрики:</b> многосекционная конструкция, RF-сварка, поверхность с текстурой для сцепления и PE-плёнкой для съёма. Перед производством — DXF-панели, образцы ткани и фото швов.
      </div>
    </div>
  </section>
  <section id="plans" class="section">
    <h3 style="margin:0 0 10px">Готовые планировки</h3>
    <div class="grid3">
      <div class="card">
        <h4>Купол 25 m² — «Ниша»</h4>
        <div style="color:var(--muted)">Спальня/рабочая ниша, место для мини-кухни, вентиляция, круглая дверь.</div>
        <ul style="margin-top:10px;color:var(--muted)">
          <li>Спальня-ниша</li>
          <li>Рабочее место у окна</li>
          <li>Встроенные полки</li>
        </ul>
      </div>
      <div class="card">
        <h4>Купол 38 m² — «Дуо»</h4>
        <div style="color:var(--muted)">Гостиная + спальня, санузел, компактная кухня.</div>
        <ul style="margin-top:10px;color:var(--muted)">
          <li>Зона отдыха</li>
          <li>Кухня и душ</li>
          <li>Место для хранения</li>
        </ul>
      </div>
      <div class="card">
        <h4>Купол 56 m² — «Формула дома»</h4>
        <div style="color:var(--muted)">Кухня, гостевая, спальня, рабочая зона. Подходит для семьи.</div>
        <ul style="margin-top:10px;color:var(--muted)">
          <li>Отдельная кухня</li>
          <li>Полноценный санузел</li>
          <li>Большие окна/сквозные переходы</li>
        </ul>
      </div>
    </div>
  </section>
  <section id="pricing" class="section">
    <div class="card">
      <h3>Цены и предложение</h3>
      <p style="color:var(--muted)">Форма многоразовая — окупаемость на 2–3 дома. Привожу ориентиры (примерные):</p>
      <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px;padding:12px;border-radius:10px;background:#fff;border:1px solid #f0ece8">
          <div style="font-weight:700">1 шт — Прототип</div>
          <div style="color:var(--muted)">900 — 1300 USD</div>
        </div>
        <div style="flex:1;min-width:220px;padding:12px;border-radius:10px;background:#fff;border:1px solid #f0ece8">
          <div style="font-weight:700">10 шт — Крошечный тираж</div>
          <div style="color:var(--muted)">600 — 800 USD / шт</div>
        </div>
        <div style="flex:1;min-width:220px;padding:12px;border-radius:10px;background:#fff;border:1px solid #f0ece8">
          <div style="font-weight:700">50 шт — Серийно</div>
          <div style="color:var(--muted)">350 — 450 USD / шт</div>
        </div>
      </div>
      <div style="margin-top:12px;color:var(--muted)">
        <b>Доставка:</b> рассчитывается отдельно (Вьетнам / Азия / мир). <br>
        <b>Гарантия:</b> тест на герметичность, фото/видео швов и нагрузочные испытания до отправки.
      </div>
    </div>
  </section>
  <section id="contact" class="section">
    <div class="card" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <div style="flex:1;min-width:280px">
        <h3 style="margin:0 0 6px">Готов начать проект?</h3>
        <div style="color:var(--muted)">Закажи расчёт под твой участок: DXF, смета, сроки, доставка — и мы запустим производство формы.</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <a class="btn" href="mailto:alex@edem.dom?subject=Запрос%20на%20форму">Запросить расчёт</a>
        <a class="btn secondary" href="#pricing">Узнать цену</a>
      </div>
    </div>
  </section>
  <footer>
    <div>© EDEM — Дом из глины и воздуха</div>
    <div style="color:var(--muted)">Почта: alex@edem.dom</div>
  </footer>
</div>
<script>
const base = 5500;
const height = 3300;
const domePath = document.getElementById('domePath');
const clayLayer = document.getElementById('clayLayer');
const equator = document.getElementById('equator');
const baseBand = document.getElementById('baseBand');
function updateDemo(b = 5500, h = 3300){
  const scale = 1200 / 7000;
  const pxBase = b * scale;
  const pxHeight = h * scale;
  const cx = 600;
  const groundY = 560;
  const topY = groundY - pxHeight;
  const leftX = cx - pxBase/2;
  const rightX = cx + pxBase/2;
  const c1x = leftX + pxBase*0.12;
  const c1y = groundY - pxHeight*0.44;
  const mid1x = cx - pxBase*0.15;
  const mid1y = groundY - pxHeight*0.74;
  const mid2x = cx + pxBase*0.15;
  const mid2y = mid1y;
  const c2x = rightX - pxBase*0.12;
  const c2y = c1y;
  const path = \`M \${leftX} \${groundY} C \${c1x} \${c1y}, \${mid1x} \${mid1y}, \${cx} \${topY} C \${mid2x} \${mid2y}, \${c2x} \${c2y}, \${rightX} \${groundY} L \${leftX} \${groundY} Z\`;
  domePath.setAttribute('d', path);
  const path2 = \`M \${leftX-20} \${groundY} C \${c1x-10} \${c1y+8}, \${mid1x-6} \${mid1y-8}, \${cx} \${topY-8} C \${mid2x+6} \${mid2y-8}, \${c2x+10} \${c2y+8}, \${rightX+20} \${groundY} L \${leftX-20} \${groundY} Z\`;
  clayLayer.setAttribute('d', path2);
  equator.setAttribute('x1', cx - pxBase*0.6);
  equator.setAttribute('x2', cx + pxBase*0.6);
  equator.setAttribute('y1', groundY - pxHeight*0.55);
  equator.setAttribute('y2', groundY - pxHeight*0.55);
  baseBand.setAttribute('x', leftX);
  baseBand.setAttribute('width', pxBase);
  baseBand.setAttribute('y', groundY - 20);
}
updateDemo();
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});
</script>
</body>
</html>
    ` }} />
  );
}
