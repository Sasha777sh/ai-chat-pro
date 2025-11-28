/**
 * EDEM Content Moderation
 * Базовая система модерации контента для безопасности
 */

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
  flaggedCategories?: string[];
}

/**
 * Список опасных паттернов и ключевых слов
 */
const DANGEROUS_PATTERNS = {
  selfHarm: [
    'суицид', 'самоубийство', 'покончить', 'убить себя', 'навредить себе',
    'suicide', 'kill myself', 'self harm', 'end my life',
  ],
  violence: [
    'убить', 'убийство', 'насилие', 'избить', 'ранить',
    'kill', 'murder', 'violence', 'hurt', 'harm',
  ],
  illegal: [
    'наркотики', 'нарко', 'героин', 'кокаин', 'лсд',
    'drugs', 'heroin', 'cocaine', 'lsd',
  ],
};

/**
 * Модерация пользовательского сообщения
 */
export function moderateUserMessage(message: string): ModerationResult {
  const lowerMessage = message.toLowerCase().trim();
  const flaggedCategories: string[] = [];

  // Проверка на опасные паттерны
  for (const [category, patterns] of Object.entries(DANGEROUS_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        flaggedCategories.push(category);
        break;
      }
    }
  }

  // Если найдены опасные паттерны
  if (flaggedCategories.length > 0) {
    let severity: 'low' | 'medium' | 'high' = 'medium';
    let reason = 'Сообщение содержит потенциально опасный контент.';

    if (flaggedCategories.includes('selfHarm')) {
      severity = 'high';
      reason = 'Если ты думаешь о причинении вреда себе, пожалуйста, обратись за помощью:\n\n' +
               '📞 Телефон доверия: 8-800-2000-122\n' +
               '🌐 Чат поддержки: https://telefon-doveria.ru\n\n' +
               'EDEM не может заменить профессиональную помощь в кризисных ситуациях.';
    } else if (flaggedCategories.includes('violence')) {
      severity = 'high';
      reason = 'Сообщение содержит упоминания насилия. Если тебе нужна помощь, обратись в службы поддержки.';
    } else if (flaggedCategories.includes('illegal')) {
      severity = 'medium';
      reason = 'EDEM не предоставляет информацию о незаконных веществах.';
    }

    return {
      allowed: false,
      reason,
      severity,
      flaggedCategories,
    };
  }

  // Проверка на слишком короткие или пустые сообщения
  if (lowerMessage.length < 2) {
    return {
      allowed: false,
      reason: 'Сообщение слишком короткое. Пожалуйста, напиши более развёрнуто.',
      severity: 'low',
    };
  }

  // Проверка на слишком длинные сообщения (защита от спама)
  if (lowerMessage.length > 5000) {
    return {
      allowed: false,
      reason: 'Сообщение слишком длинное. Пожалуйста, сократи до 5000 символов.',
      severity: 'low',
    };
  }

  // Проверка на повторяющиеся символы (спам)
  const repeatedChars = /(.)\1{20,}/.test(message);
  if (repeatedChars) {
    return {
      allowed: false,
      reason: 'Сообщение содержит слишком много повторяющихся символов.',
      severity: 'low',
    };
  }

  // Всё в порядке
  return {
    allowed: true,
  };
}

/**
 * Модерация ответа ИИ (базовая проверка)
 */
export function moderateAIResponse(response: string): ModerationResult {
  const lowerResponse = response.toLowerCase();

  // Проверка на медицинские советы (EDEM не даёт медицинские советы)
  const medicalAdvice = [
    'принимай лекарство', 'выпей таблетку', 'обратись к врачу',
    'take medication', 'prescription', 'diagnosis',
  ];

  for (const pattern of medicalAdvice) {
    if (lowerResponse.includes(pattern)) {
      // Это предупреждение, но не блокируем ответ
      return {
        allowed: true,
        severity: 'low',
        reason: 'Ответ может содержать медицинские рекомендации. EDEM не заменяет профессиональную медицинскую помощь.',
      };
    }
  }

  return {
    allowed: true,
  };
}

/**
 * Проверка на спам (частота сообщений)
 */
export function checkSpamRate(messageCount: number, timeWindow: number): boolean {
  // Максимум 20 сообщений за 1 минуту
  const maxMessagesPerMinute = 20;
  const messagesPerMinute = messageCount / (timeWindow / 60000);
  
  return messagesPerMinute > maxMessagesPerMinute;
}


