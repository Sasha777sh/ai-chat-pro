import type { VoiceId } from './prompts';

export type PlanId = 'free' | 'basic' | 'plus' | 'pro';

export interface PlanConfig {
  id: PlanId;
  name: string;
  priceLabel: string;
  priceMonthly: number;
  description: string;
  includedVoices: VoiceId[];
  features: string[];
  stripePriceEnv?: string;
  highlight?: boolean;
}

export const FREE_MESSAGE_LIMIT = 2;

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceLabel: '$0',
    priceMonthly: 0,
    description: '2 сообщения для знакомства',
    includedVoices: ['live'],
    features: [
      'Доступ к голосу Живого',
      'Лимит 2 сообщения',
      'История текущей сессии',
    ],
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    priceLabel: '1500₽',
    priceMonthly: 1500,
    description: 'Глубокая поддержка через Голос Живого',
    includedVoices: ['live'],
    features: [
      'Неограниченный доступ к голосу Живого',
      'Полная история чатов',
      'Приоритет очереди',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    priceLabel: '2900₽',
    priceMonthly: 2900,
    description: 'Живое + Зеркало + Ребёнок',
    includedVoices: ['live', 'mirror', 'child'],
    features: [
      'Голос Зеркала (вопросы)',
      'Голос Ребёнка (мягкость)',
      'Доступ к дневнику состояний',
    ],
    highlight: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceLabel: '4900₽',
    priceMonthly: 4900,
    description: 'Вся палитра голосов',
    includedVoices: ['live', 'mirror', 'child', 'shadow', 'sage'],
    features: [
      'Голос Тени (вскрывает правду)',
      'Голос Мудреца (опора)',
      'Премиальная поддержка',
    ],
  },
};

export const PLAN_VOICE_ACCESS: Record<PlanId, VoiceId[]> = {
  free: PLAN_CONFIG.free.includedVoices,
  basic: PLAN_CONFIG.basic.includedVoices,
  plus: PLAN_CONFIG.plus.includedVoices,
  pro: PLAN_CONFIG.pro.includedVoices,
};

export const ORDERED_PLANS: PlanId[] = ['free', 'basic', 'plus', 'pro'];

export function getPlanConfig(plan: PlanId): PlanConfig {
  return PLAN_CONFIG[plan];
}

export function getAllowedVoices(plan: PlanId): VoiceId[] {
  return PLAN_VOICE_ACCESS[plan];
}


