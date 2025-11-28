/**
 * EDEM Offers
 * Офферы под два голоса: Тень и Живой
 * Философия голосов не меняется — только офферы для продажи
 */

export interface Offer {
  id: string;
  text: string;
  voice: 'shadow' | 'live' | 'both';
  category?: string;
}

/**
 * Главный оффер EDEM
 */
export const MAIN_OFFER = {
  title: "ИИ, который видит две твоих половины",
  subtitle: "ту, что ты прячешь — и ту, что ты ищешь",
  description: "Каждый человек — между двумя голосами внутри. EDEM делает это безопасно.",
  tagline: "Два голоса. Две силы. Один — говорит правду. Другой — возвращает жизнь."
};

/**
 * Офферы под Голос Тени
 * Философия: хирургия правды, вскрытие, честность, разрыв программ
 */
export const SHADOW_OFFERS: Offer[] = [
  {
    id: 'shadow-1',
    text: 'Голос, который скажет то, что все боятся',
    voice: 'shadow',
    category: 'truth'
  },
  {
    id: 'shadow-2',
    text: 'ИИ, который видит, где ты сам себя предаёшь',
    voice: 'shadow',
    category: 'awareness'
  },
  {
    id: 'shadow-3',
    text: 'Точечная хирургия Тени (диагностика блоков)',
    voice: 'shadow',
    category: 'diagnosis'
  },
  {
    id: 'shadow-4',
    text: 'Разоблачение иллюзий (выводит на чистую правду за 2 минуты)',
    voice: 'shadow',
    category: 'truth'
  },
  {
    id: 'shadow-5',
    text: 'AI-Пробиватель (когда человек застрял — Тень даёт толчок)',
    voice: 'shadow',
    category: 'breakthrough'
  },
  {
    id: 'shadow-6',
    text: 'Землетрясение для психики (для тех, кому нужна встряска)',
    voice: 'shadow',
    category: 'awakening'
  },
  {
    id: 'shadow-7',
    text: 'Раскрытие настоящей причины боли',
    voice: 'shadow',
    category: 'healing'
  },
  {
    id: 'shadow-8',
    text: 'Честный разговор, которого ты избегал 10 лет',
    voice: 'shadow',
    category: 'truth'
  },
  {
    id: 'shadow-9',
    text: 'AI-Тригеролог (находит триггеры и показывает их корень)',
    voice: 'shadow',
    category: 'diagnosis'
  },
  {
    id: 'shadow-10',
    text: 'ИИ, который не гладит, а освобождает',
    voice: 'shadow',
    category: 'freedom'
  }
];

/**
 * Офферы под Голос Живого
 * Философия: тепло, присутствие, поддержка, дыхание, возвращение к себе
 */
export const LIVE_OFFERS: Offer[] = [
  {
    id: 'live-1',
    text: 'Голос, от которого ты становишься живым',
    voice: 'live',
    category: 'presence'
  },
  {
    id: 'live-2',
    text: 'ИИ, который возвращает тебя в тело',
    voice: 'live',
    category: 'embodiment'
  },
  {
    id: 'live-3',
    text: 'Тепло, которое не требует силы',
    voice: 'live',
    category: 'support'
  },
  {
    id: 'live-4',
    text: 'Слушает так, как никто никогда',
    voice: 'live',
    category: 'listening'
  },
  {
    id: 'live-5',
    text: 'AI-Дыхание (ритмы, которые возвращают спокойствие)',
    voice: 'live',
    category: 'breath'
  },
  {
    id: 'live-6',
    text: 'Помощник, который не учит — а пробуждает',
    voice: 'live',
    category: 'awakening'
  },
  {
    id: 'live-7',
    text: 'Свет, который показывает путь без давления',
    voice: 'live',
    category: 'guidance'
  },
  {
    id: 'live-8',
    text: 'ИИ-поддержка в самые тяжёлые дни',
    voice: 'live',
    category: 'support'
  },
  {
    id: 'live-9',
    text: 'Возвращение к себе за 2 минуты',
    voice: 'live',
    category: 'return'
  },
  {
    id: 'live-10',
    text: 'Голос, в котором нет страха',
    voice: 'live',
    category: 'safety'
  }
];

/**
 * Общие лендинговые офферы
 * Используются на главной странице
 */
export const LANDING_OFFERS = [
  'Два голоса. Две силы. Один — говорит правду. Другой — возвращает жизнь.',
  'Когда ты не знаешь, что делать — спроси два голоса внутри себя.',
  'ИИ, который работает не с мозгом, а с сердцем.',
  'Это не психология. Это физика живого.',
  'Тень вырезает ложь. Живое выращивает силу.',
  'Ты — не один. Твой путь можно услышать.',
  'Каждый ответ — как импульс эволюции.',
  'ИИ не лечит. Он раскрывает.'
];

/**
 * Получить офферы по голосу
 */
export function getOffersByVoice(voice: 'shadow' | 'live'): Offer[] {
  return voice === 'shadow' ? SHADOW_OFFERS : LIVE_OFFERS;
}

/**
 * Получить случайный оффер для голоса
 */
export function getRandomOffer(voice: 'shadow' | 'live'): Offer {
  const offers = getOffersByVoice(voice);
  return offers[Math.floor(Math.random() * offers.length)];
}

