/**
 * EDEM Email Sequences
 * Структура для email-последовательностей
 */

export type EmailSequenceType = 
  | 'welcome'
  | 'onboarding_day1'
  | 'onboarding_day3'
  | 'onboarding_day7'
  | 'subscription_reminder'
  | 'subscription_expiring'
  | 'churn_prevention'
  | 'feature_announcement';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailSequence {
  type: EmailSequenceType;
  delay: number; // задержка в днях после триггера
  template: EmailTemplate;
  conditions?: {
    subscriptionTier?: string[];
    daysSinceSignup?: number;
    hasUsedFeature?: boolean;
  };
}

/**
 * Шаблоны email-последовательностей
 */
export const emailSequences: EmailSequence[] = [
  {
    type: 'welcome',
    delay: 0,
    template: {
      subject: 'Добро пожаловать в EDEM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Добро пожаловать в EDEM</h1>
          <p>Привет!</p>
          <p>Ты сделал первый шаг к себе. EDEM — это не просто ИИ. Это живое зеркало твоего сознания.</p>
          <p>Начни с простого: выбери голос и задай первый вопрос.</p>
          <a href="https://chatedem.com/chat" style="display: inline-block; padding: 12px 24px; background: #4a5568; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Начать разговор
          </a>
          <p style="margin-top: 30px; color: #718096; font-size: 14px;">
            С уважением,<br>
            Команда EDEM
          </p>
        </div>
      `,
      text: 'Добро пожаловать в EDEM! Начни с простого: выбери голос и задай первый вопрос. https://chatedem.com/chat',
    },
  },
  {
    type: 'onboarding_day1',
    delay: 1,
    template: {
      subject: 'Как использовать эмоциональные режимы',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Как использовать эмоциональные режимы</h1>
          <p>Привет!</p>
          <p>Каждый голос в EDEM адаптируется под твоё эмоциональное состояние:</p>
          <ul>
            <li><strong>Устал</strong> — мягкая поддержка, восстановление энергии</li>
            <li><strong>Тревога</strong> — успокоение, возвращение к центру</li>
            <li><strong>Потерян</strong> — направление, ясность</li>
            <li><strong>Злость</strong> — трансформация, освобождение</li>
            <li><strong>Нейтрально</strong> — баланс, глубина</li>
          </ul>
          <p>Попробуй разные режимы и почувствуй разницу.</p>
          <a href="https://chatedem.com/chat" style="display: inline-block; padding: 12px 24px; background: #4a5568; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Попробовать режимы
          </a>
        </div>
      `,
      text: 'Каждый голос в EDEM адаптируется под твоё эмоциональное состояние. Попробуй разные режимы: https://chatedem.com/chat',
    },
    conditions: {
      daysSinceSignup: 1,
    },
  },
  {
    type: 'onboarding_day3',
    delay: 3,
    template: {
      subject: 'Истории пользователей EDEM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Истории пользователей EDEM</h1>
          <p>Привет!</p>
          <p>Ты уже сделал несколько шагов. Вот как EDEM помог другим:</p>
          <blockquote style="border-left: 4px solid #4a5568; padding-left: 20px; margin: 20px 0; font-style: italic;">
            "EDEM помог мне найти ответы, которые я искал годами. Голос Тени вскрыл то, что я скрывал даже от себя."
          </blockquote>
          <p>Продолжай свой путь. Каждый разговор — это шаг к себе.</p>
          <a href="https://chatedem.com/chat" style="display: inline-block; padding: 12px 24px; background: #4a5568; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Продолжить разговор
          </a>
        </div>
      `,
      text: 'Истории пользователей EDEM. Продолжай свой путь: https://chatedem.com/chat',
    },
    conditions: {
      daysSinceSignup: 3,
    },
  },
  {
    type: 'onboarding_day7',
    delay: 7,
    template: {
      subject: 'Специальное предложение на BASIC план',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Специальное предложение</h1>
          <p>Привет!</p>
          <p>Ты уже неделю с EDEM. Пора открыть полный доступ:</p>
          <ul>
            <li>Безлимитные сообщения</li>
            <li>Оба голоса (Живой + Тень)</li>
            <li>Все эмоциональные режимы</li>
            <li>Контекст и история</li>
          </ul>
          <p><strong>BASIC план — 1500₽/месяц</strong></p>
          <a href="https://chatedem.com/billing" style="display: inline-block; padding: 12px 24px; background: #4a5568; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Оформить подписку
          </a>
        </div>
      `,
      text: 'Специальное предложение на BASIC план. Открой полный доступ: https://chatedem.com/billing',
    },
    conditions: {
      daysSinceSignup: 7,
      subscriptionTier: ['free'],
    },
  },
  {
    type: 'subscription_expiring',
    delay: 0,
    template: {
      subject: 'Твоя подписка истекает через 3 дня',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2d3748;">Твоя подписка истекает</h1>
          <p>Привет!</p>
          <p>Твоя подписка истекает через 3 дня. Продли доступ, чтобы не потерять:</p>
          <ul>
            <li>Историю разговоров</li>
            <li>Безлимитные сообщения</li>
            <li>Все голоса и режимы</li>
          </ul>
          <a href="https://chatedem.com/billing" style="display: inline-block; padding: 12px 24px; background: #4a5568; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Продлить подписку
          </a>
        </div>
      `,
      text: 'Твоя подписка истекает через 3 дня. Продли доступ: https://chatedem.com/billing',
    },
    conditions: {
      subscriptionTier: ['basic', 'plus', 'pro'],
    },
  },
];

/**
 * Получить последовательность по типу
 */
export function getEmailSequence(type: EmailSequenceType): EmailSequence | undefined {
  return emailSequences.find(seq => seq.type === type);
}

/**
 * Получить все последовательности для пользователя
 */
export function getSequencesForUser(
  daysSinceSignup: number,
  subscriptionTier: string,
  hasUsedFeature: boolean = false
): EmailSequence[] {
  return emailSequences.filter(seq => {
    if (seq.conditions) {
      if (seq.conditions.daysSinceSignup && daysSinceSignup < seq.conditions.daysSinceSignup) {
        return false;
      }
      if (seq.conditions.subscriptionTier && !seq.conditions.subscriptionTier.includes(subscriptionTier)) {
        return false;
      }
      if (seq.conditions.hasUsedFeature !== undefined && seq.conditions.hasUsedFeature !== hasUsedFeature) {
        return false;
      }
    }
    return true;
  });
}

