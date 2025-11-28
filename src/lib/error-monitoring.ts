/**
 * EDEM Error Monitoring
 * Базовая система мониторинга ошибок
 * В будущем можно интегрировать с Sentry, LogRocket и т.д.
 */

export interface ErrorContext {
  userId?: string;
  email?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

class ErrorMonitor {
  private enabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.enabled = 
      typeof window !== 'undefined' && 
      (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED === 'true');
  }

  /**
   * Инициализация мониторинга
   */
  init(userId?: string) {
    if (!this.enabled) return;
    
    this.userId = userId || null;

    // Перехватываем необработанные ошибки
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'unhandled_error',
        });
      });

      // Перехватываем необработанные промисы
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          {
            type: 'unhandled_promise_rejection',
          }
        );
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[ErrorMonitor] Initialized', { userId: this.userId });
    }
  }

  /**
   * Захват ошибки
   */
  captureError(error: Error, context?: ErrorContext) {
    if (!this.enabled) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context: {
        ...context,
        userId: this.userId,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      },
    };

    // Логируем в консоль для отладки
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorMonitor]', errorData);
    }

    // Отправляем на сервер
    this.sendToServer(errorData);

    // Здесь можно добавить отправку в Sentry:
    // Sentry.captureException(error, { extra: context });
  }

  /**
   * Захват сообщения (не ошибка, но важное событие)
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (!this.enabled) return;

    const messageData = {
      message,
      level,
      context: {
        ...context,
        userId: this.userId,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ErrorMonitor ${level.toUpperCase()}]`, messageData);
    }

    this.sendToServer(messageData);
  }

  /**
   * Отправка на сервер
   */
  private async sendToServer(data: any) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Не блокируем выполнение при ошибке мониторинга
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ErrorMonitor] Failed to send error report:', error);
      }
    }
  }

  /**
   * Установка пользователя
   */
  setUser(userId: string, traits?: Record<string, any>) {
    if (!this.enabled) return;
    
    this.userId = userId;
    
    // Здесь можно добавить идентификацию в Sentry:
    // Sentry.setUser({ id: userId, ...traits });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[ErrorMonitor] User set', { userId, traits });
    }
  }

  /**
   * Сброс пользователя
   */
  reset() {
    if (!this.enabled) return;
    
    this.userId = null;
    
    // Здесь можно добавить сброс в Sentry:
    // Sentry.setUser(null);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[ErrorMonitor] Reset');
    }
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

// Хелперы
export const captureError = (error: Error, context?: ErrorContext) => {
  errorMonitor.captureError(error, context);
};

export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext) => {
  errorMonitor.captureMessage(message, level, context);
};

