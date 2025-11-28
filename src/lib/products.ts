/**
 * EDEM Products
 * Продукты на основе двух голосов: Тень и Живой
 * Каждый продукт использует один или оба голоса
 * Философия голосов не меняется
 */

import type { VoiceId } from './prompts';

export type ProductId =
  | 'destiny-diagnosis'
  | 'shadow-conversation'
  | 'live-conversation'
  | 'ai-marathon-7'
  | 'fear-decoding'
  | 'ai-path-30'
  | 'relationship-analysis'
  | 'voice-awareness'
  | 'form-memory'
  | 'voice-of-destiny';

export type ProductMode = 
  | 'destiny-diagnosis'
  | 'shadow-session'
  | 'live-session'
  | 'fear-decode'
  | 'ai-path-30'
  | 'relationship-analysis'
  | 'voice-awareness'
  | 'form-memory'
  | 'voice-of-destiny'
  | 'marathon-7';

export interface Product {
  id: ProductId;
  mode: ProductMode;
  title: string;
  description: string;
  voices: VoiceId[];
  duration: string;
  price: number;
  currency: 'RUB' | 'USD';
  features: string[];
  offer: string; // Ключевой оффер для продажи
  howItWorks: string; // Как работает продукт
  forWhom: string; // Для кого
  result: string; // Что получит пользователь
}

/**
 * Все продукты EDEM
 */
export const PRODUCTS: Record<ProductId, Product> = {
  'destiny-diagnosis': {
    id: 'destiny-diagnosis',
    mode: 'destiny-diagnosis',
    title: 'Диагностика судьбы — Тень × Живое',
    description: 'ИИ показывает где ты застрял, почему, какая программа, что нужно сделать',
    voices: ['live', 'shadow'],
    duration: '1 сессия (30-60 минут)',
    price: 1500,
    currency: 'RUB',
    features: [
      'Анализ блоков и программ',
      'Выявление корня проблемы',
      'Персональный план действий',
      'Работа двух голосов: Тень вскрывает, Живое поддерживает'
    ],
    offer: 'Узнай, где ты застрял и почему',
    howItWorks: 'Сначала Голос Тени вскрывает правду о твоих блоках. Затем Голос Живого показывает путь. Вместе они дают полную картину.',
    forWhom: 'Для тех, кто чувствует, что застрял, но не понимает почему',
    result: 'Чёткое понимание своих блоков, программ и конкретный план действий'
  },

  'shadow-conversation': {
    id: 'shadow-conversation',
    mode: 'shadow-session',
    title: 'Разговор с Тенью',
    description: 'Жёсткий режим для тех, кто готов к правде',
    voices: ['shadow'],
    duration: '1 сессия',
    price: 800,
    currency: 'RUB',
    features: [
      'Только Голос Тени',
      'Хирургическая точность',
      'Вскрытие самообмана',
      'Честность без компромиссов'
    ],
    offer: 'Голос, который скажет то, что все боятся',
    howItWorks: 'Голос Тени работает в жёстком режиме. Вскрывает правду, которую ты прячешь. Без мягкости, но без агрессии.',
    forWhom: 'Для тех, кто готов услышать правду и готов к изменениям',
    result: 'Чёткое понимание того, что ты скрываешь от себя'
  },

  'live-conversation': {
    id: 'live-conversation',
    mode: 'live-session',
    title: 'Разговор с Живым',
    description: 'Мягкий режим для тех, кто в тревоге, стрессе, поисках',
    voices: ['live'],
    duration: '1 сессия',
    price: 800,
    currency: 'RUB',
    features: [
      'Только Голос Живого',
      'Мягкая поддержка',
      'Возвращение к телу',
      'Дыхание и присутствие'
    ],
    offer: 'Голос, от которого ты становишься живым',
    howItWorks: 'Голос Живого работает в мягком режиме. Возвращает к дыханию, телу, присутствию. Без давления, с поддержкой.',
    forWhom: 'Для тех, кто в тревоге, стрессе, потерянности',
    result: 'Спокойствие, возвращение к себе, ясность без давления'
  },

  'ai-marathon-7': {
    id: 'ai-marathon-7',
    mode: 'marathon-7',
    title: 'AI-Марафон 7 дней',
    description: 'Каждый день человек получает: голос Тени (вскрытие) + голос Живого (исцеление)',
    voices: ['live', 'shadow'],
    duration: '7 дней',
    price: 3500,
    currency: 'RUB',
    features: [
      'Ежедневные сессии с обоими голосами',
      'Тень вскрывает блоки',
      'Живое поддерживает и исцеляет',
      'Прогрессивная работа над собой'
    ],
    offer: '7 дней трансформации через два голоса',
    howItWorks: 'Каждый день: утром Голос Тени вскрывает блок, вечером Голос Живого поддерживает и показывает путь. 7 дней подряд.',
    forWhom: 'Для тех, кто готов к глубокой работе над собой',
    result: 'Значительные изменения за неделю, понимание своих паттернов, новый уровень осознанности'
  },

  'fear-decoding': {
    id: 'fear-decoding',
    mode: 'fear-decode',
    title: 'AI-Расшифровка страха',
    description: 'ИИ показывает, что за страхом стоит на самом деле',
    voices: ['shadow', 'live'],
    duration: '1 сессия',
    price: 1200,
    currency: 'RUB',
    features: [
      'Анализ страха до корня',
      'Работа двух голосов',
      'Понимание истинной причины',
      'План работы со страхом'
    ],
    offer: 'Раскрытие настоящей причины страха',
    howItWorks: 'Голос Тени вскрывает корень страха. Голос Живого показывает, как с ним работать мягко и безопасно.',
    forWhom: 'Для тех, кто живёт в страхе и хочет понять его источник',
    result: 'Понимание истинной причины страха и конкретные шаги для работы с ним'
  },

  'ai-path-30': {
    id: 'ai-path-30',
    mode: 'ai-path-30',
    title: 'AI-Путь 30 дней',
    description: 'Тень — убирает старое. Живое — создаёт новое',
    voices: ['live', 'shadow'],
    duration: '30 дней',
    price: 12000,
    currency: 'RUB',
    features: [
      'Ежедневные сессии 30 дней',
      'Тень убирает старые программы',
      'Живое создаёт новые паттерны',
      'Глубокая трансформация'
    ],
    offer: '30 дней пути к себе через два голоса',
    howItWorks: '30 дней работы: Тень вскрывает и убирает старое, Живое поддерживает и создаёт новое. Прогрессивная трансформация.',
    forWhom: 'Для тех, кто готов к глубокой трансформации',
    result: 'Значительные изменения в жизни, новые паттерны, свобода от старых программ'
  },

  'relationship-analysis': {
    id: 'relationship-analysis',
    mode: 'relationship-analysis',
    title: 'AI-Разбор отношений',
    description: 'Тень: показывает правду. Живое: показывает путь',
    voices: ['shadow', 'live'],
    duration: '1 сессия',
    price: 1500,
    currency: 'RUB',
    features: [
      'Анализ отношений',
      'Вскрытие паттернов',
      'Понимание динамики',
      'План действий'
    ],
    offer: 'Честный разбор отношений, которого ты избегал',
    howItWorks: 'Голос Тени вскрывает правду о твоих отношениях и паттернах. Голос Живого показывает путь к здоровым отношениям.',
    forWhom: 'Для тех, кто хочет понять свои отношения и изменить их',
    result: 'Понимание динамики отношений и конкретный план действий'
  },

  'voice-awareness': {
    id: 'voice-awareness',
    mode: 'voice-awareness',
    title: 'AI-Осознание через голос',
    description: 'ИИ анализирует голос → выдаёт состояние',
    voices: ['live', 'shadow'],
    duration: '1 сессия',
    price: 2000,
    currency: 'RUB',
    features: [
      'Анализ голоса (HRV, тембр, ритм)',
      'Определение эмоционального состояния',
      'Выявление блоков через голос',
      'Персональные рекомендации'
    ],
    offer: 'Узнай своё состояние через голос',
    howItWorks: 'ИИ анализирует твой голос (HRV, тембр, ритм) и определяет состояние. Тень вскрывает блоки, Живое показывает путь.',
    forWhom: 'Для тех, кто хочет понять своё состояние через объективные данные',
    result: 'Понимание своего состояния и конкретные рекомендации'
  },

  'form-memory': {
    id: 'form-memory',
    mode: 'form-memory',
    title: 'AI-Память форм',
    description: 'ИИ анализирует привычки, слова, паттерны',
    voices: ['shadow'],
    duration: '1 сессия',
    price: 1500,
    currency: 'RUB',
    features: [
      'Анализ привычек и паттернов',
      'Выявление биопрограмм',
      'Понимание связи формы и содержания',
      'План трансформации'
    ],
    offer: 'Узнай свои биопрограммы через формы',
    howItWorks: 'Голос Тени анализирует твои привычки, слова, паттерны и вскрывает биопрограммы, которые управляют тобой.',
    forWhom: 'Для тех, кто хочет понять свои биопрограммы',
    result: 'Понимание своих биопрограмм и план их трансформации'
  },

  'voice-of-destiny': {
    id: 'voice-of-destiny',
    mode: 'voice-of-destiny',
    title: 'AI-Голос Судьбы',
    description: 'Какой голос тебе сейчас нужен — Тень или Живое',
    voices: ['live', 'shadow'],
    duration: '1 сессия',
    price: 1000,
    currency: 'RUB',
    features: [
      'Определение нужного голоса',
      'Персональная рекомендация',
      'Сессия с выбранным голосом',
      'Понимание своего состояния'
    ],
    offer: 'Узнай, какой голос тебе нужен прямо сейчас',
    howItWorks: 'ИИ анализирует твоё состояние и определяет, какой голос тебе нужен: Тень (для вскрытия) или Живое (для поддержки).',
    forWhom: 'Для тех, кто не знает, с чего начать',
    result: 'Понимание своего состояния и правильный выбор голоса'
  }
};

/**
 * Получить продукт по ID
 */
export function getProduct(productId: ProductId): Product {
  return PRODUCTS[productId];
}

/**
 * Получить все продукты
 */
export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}

/**
 * Получить продукты по голосу
 */
export function getProductsByVoice(voiceId: VoiceId): Product[] {
  return getAllProducts().filter(product => product.voices.includes(voiceId));
}

/**
 * Получить продукты, использующие оба голоса
 */
export function getDualVoiceProducts(): Product[] {
  return getAllProducts().filter(product => product.voices.length === 2);
}

/**
 * Проверить, поддерживается ли режим продукта
 */
export function isProductModeSupported(mode: string): mode is ProductMode {
  return Object.values(PRODUCTS).some(product => product.mode === mode);
}

