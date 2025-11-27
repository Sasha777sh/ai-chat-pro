/**
 * EDEM Analytics
 * Базовая аналитика для отслеживания ключевых событий
 */

type AnalyticsEvent = 
  | 'user_registered'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'chat_message_sent'
  | 'chat_message_received'
  | 'voice_selected'
  | 'emotion_detected'
  | 'test_mode_started'
  | 'test_mode_ended'
  | 'paywall_shown'
  | 'subscription_started'
  | 'subscription_completed'
  | 'payment_method_selected'
  | 'landing_page_viewed'
  | 'pricing_viewed'
  | 'error_occurred';

interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class Analytics {
  private enabled: boolean;
  private userId: string | null = null;

  constructor() {
    // Включаем аналитику только в продакшене или если явно включено
    this.enabled = 
      typeof window !== 'undefined' && 
      (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true');
  }

  /**
   * Инициализация аналитики
   */
  init(userId?: string) {
    if (!this.enabled) return;
    
    this.userId = userId || null;
    
    // Здесь можно добавить инициализацию внешних сервисов
    // Например: Mixpanel, Amplitude, Google Analytics и т.д.
    
    if (typeof window !== 'undefined') {
      console.log('[Analytics] Initialized', { userId: this.userId });
    }
  }

  /**
   * Отслеживание события
   */
  track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (!this.enabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    // Логируем в консоль для отладки
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventData);
    }

    // Отправляем на сервер для сохранения
    this.sendToServer(eventData);

    // Здесь можно добавить отправку во внешние сервисы
    // Например: Mixpanel.track(event, properties)
  }

  /**
   * Отправка события на сервер
   */
  private async sendToServer(data: any) {
    try {
      // Отправляем на API endpoint для сохранения аналитики
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Не блокируем выполнение при ошибке аналитики
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] Failed to send event:', error);
      }
    }
  }

  /**
   * Установка пользователя
   */
  identify(userId: string, traits?: AnalyticsProperties) {
    if (!this.enabled) return;
    
    this.userId = userId;
    
    // Здесь можно добавить идентификацию во внешних сервисах
    // Например: Mixpanel.identify(userId, traits)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] User identified', { userId, traits });
    }
  }

  /**
   * Сброс пользователя (при выходе)
   */
  reset() {
    if (!this.enabled) return;
    
    this.userId = null;
    
    // Здесь можно добавить сброс во внешних сервисах
    // Например: Mixpanel.reset()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Reset');
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

// Хелперы для частых событий
export const trackRegistration = (email: string) => {
  analytics.track('user_registered', { email });
};

export const trackLogin = (email: string) => {
  analytics.track('user_logged_in', { email });
};

export const trackChatMessage = (voiceId: string, messageLength: number, emotion?: string) => {
  analytics.track('chat_message_sent', {
    voiceId,
    messageLength,
    emotion,
  });
};

export const trackVoiceSelection = (voiceId: string) => {
  analytics.track('voice_selected', { voiceId });
};

export const trackPaywall = (reason: string) => {
  analytics.track('paywall_shown', { reason });
};

export const trackSubscription = (plan: string, amount: number) => {
  analytics.track('subscription_started', { plan, amount });
};

export const trackError = (error: string, context?: string) => {
  analytics.track('error_occurred', {
    error,
    context,
  });
};

