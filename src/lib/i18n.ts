// Система локализации для EDEM Intelligence

export type Locale = 'ru' | 'en';

export interface Translations {
  // Общие
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
  };
  // Навигация
  nav: {
    home: string;
    chat: string;
    account: string;
    billing: string;
    logout: string;
  };
  // Аутентификация
  auth: {
    login: string;
    signup: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    alreadyHaveAccount: string;
    noAccount: string;
    invalidCredentials: string;
    emailNotConfirmed: string;
  };
  // Чат
  chat: {
    sendMessage: string;
    placeholder: string;
    chooseVoice: string;
    voiceDescription: string;
    messagesLeft: string;
    freeLimitReached: string;
    upgradeRequired: string;
  };
  // Тарифы
  billing: {
    title: string;
    subtitle: string;
    currentPlan: string;
    choosePlan: string;
    perMonth: string;
    upgrade: string;
    features: string;
  };
  // Голоса
  voices: {
    live: {
      title: string;
      tagline: string;
      description: string;
    };
    shadow: {
      title: string;
      tagline: string;
      description: string;
    };
    mirror: {
      title: string;
      tagline: string;
      description: string;
    };
    child: {
      title: string;
      tagline: string;
      description: string;
    };
    sage: {
      title: string;
      tagline: string;
      description: string;
    };
  };
  // Оплата
  payment: {
    chooseMethod: string;
    yookassa: string;
    crypto: string;
    card: string;
    manual: string;
    processing: string;
    success: string;
    failed: string;
  };
}

const translations: Record<Locale, Translations> = {
  ru: {
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть',
    },
    nav: {
      home: 'Главная',
      chat: 'Чат',
      account: 'Кабинет',
      billing: 'Тарифы',
      logout: 'Выйти',
    },
    auth: {
      login: 'Вход',
      signup: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      forgotPassword: 'Забыли пароль?',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
      invalidCredentials: 'Неверный email или пароль',
      emailNotConfirmed: 'Email не подтверждён',
    },
    chat: {
      sendMessage: 'Отправить',
      placeholder: 'Напиши сообщение...',
      chooseVoice: 'Выбери голос',
      voiceDescription: 'Тень. Свет. Глубина. Сейчас тебе нужен один из них.',
      messagesLeft: 'Осталось {count} бесплатных сообщений',
      freeLimitReached: 'Бесплатный лимит исчерпан',
      upgradeRequired: 'Оформите подписку для продолжения',
    },
    billing: {
      title: 'Тарифы',
      subtitle: 'Выбери план и получи доступ к голосам',
      currentPlan: 'Текущий план',
      choosePlan: 'Оформить подписку',
      perMonth: 'в месяц',
      upgrade: 'Обновить',
      features: 'Возможности',
    },
    voices: {
      live: {
        title: 'Голос Живого',
        tagline: 'Дыхание. Тепло. Спокойная ясность.',
        description: 'Он отвечает мягко, честно и светло. Возвращает ясность без давления.',
      },
      shadow: {
        title: 'Голос Тени',
        tagline: 'Честно. Прямо. Без сахара.',
        description: 'Он видит то, что ты скрываешь. Говорит суть — без украшений и компромиссов.',
      },
      mirror: {
        title: 'Голос Зеркала',
        tagline: 'Твои ответы — внутри.',
        description: 'Он не объясняет. Он задаёт вопросы, которые двигают тебя внутрь.',
      },
      child: {
        title: 'Голос Ребёнка',
        tagline: 'Тепло. Чувства. Искренность.',
        description: 'Говорит просто и по-настоящему. Возвращает мягкость и доверие миру.',
      },
      sage: {
        title: 'Голос Мудреца',
        tagline: 'Тишина, которая слышит.',
        description: 'Мало слов — много смысла. Глубокий, спокойный, древний тон.',
      },
    },
    payment: {
      chooseMethod: 'Выберите способ оплаты',
      yookassa: 'ЮKassa',
      crypto: 'Криптовалюта',
      card: 'Банковская карта',
      manual: 'Перевод на карту',
      processing: 'Обработка платежа...',
      success: 'Оплата успешна',
      failed: 'Ошибка оплаты',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
    },
    nav: {
      home: 'Home',
      chat: 'Chat',
      account: 'Account',
      billing: 'Billing',
      logout: 'Logout',
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      invalidCredentials: 'Invalid email or password',
      emailNotConfirmed: 'Email not confirmed',
    },
    chat: {
      sendMessage: 'Send',
      placeholder: 'Type a message...',
      chooseVoice: 'Choose Voice',
      voiceDescription: 'Shadow. Light. Depth. You need one of them now.',
      messagesLeft: '{count} free messages left',
      freeLimitReached: 'Free limit reached',
      upgradeRequired: 'Subscribe to continue',
    },
    billing: {
      title: 'Plans',
      subtitle: 'Choose a plan and get access to voices',
      currentPlan: 'Current Plan',
      choosePlan: 'Subscribe',
      perMonth: 'per month',
      upgrade: 'Upgrade',
      features: 'Features',
    },
    voices: {
      live: {
        title: 'Voice of Living',
        tagline: 'Breath. Warmth. Calm clarity.',
        description: 'Responds softly, honestly, and clearly. Returns clarity without pressure.',
      },
      shadow: {
        title: 'Voice of Shadow',
        tagline: 'Honest. Direct. No sugar.',
        description: 'Sees what you hide. Speaks the essence — without decorations and compromises.',
      },
      mirror: {
        title: 'Voice of Mirror',
        tagline: 'Your answers are within.',
        description: "Doesn't explain. Asks questions that move you inward.",
      },
      child: {
        title: 'Voice of Child',
        tagline: 'Warmth. Feelings. Sincerity.',
        description: 'Speaks simply and truly. Returns softness and trust in the world.',
      },
      sage: {
        title: 'Voice of Sage',
        tagline: 'Silence that hears.',
        description: 'Few words — much meaning. Deep, calm, ancient tone.',
      },
    },
    payment: {
      chooseMethod: 'Choose payment method',
      yookassa: 'YooKassa',
      crypto: 'Cryptocurrency',
      card: 'Bank Card',
      manual: 'Card Transfer',
      processing: 'Processing payment...',
      success: 'Payment successful',
      failed: 'Payment failed',
    },
  },
};

export function getTranslations(locale: Locale = 'ru'): Translations {
  return translations[locale] || translations.ru;
}

export function t(key: string, locale: Locale = 'ru', params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations.ru;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to Russian
      value = translations.ru;
      for (const k2 of keys) {
        value = value?.[k2];
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace placeholders
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''));
  }
  
  return value;
}

export function formatCurrency(amount: number, locale: Locale = 'ru'): string {
  if (locale === 'en') {
    return `$${amount}`;
  }
  return `${amount}₽`;
}

