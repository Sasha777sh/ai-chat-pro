// Простой in-memory rate limiter
// Для production лучше использовать Redis (Upstash)

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number; // окно времени в мс
  max: number; // максимум запросов
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options;

  return (identifier: string): { allowed: boolean; remaining: number; resetAt: number } => {
    const now = Date.now();
    const key = identifier;
    const record = store[key];

    // Если записи нет или окно истекло, создаём новую
    if (!record || now > record.resetAt) {
      store[key] = {
        count: 1,
        resetAt: now + windowMs,
      };
      return {
        allowed: true,
        remaining: max - 1,
        resetAt: now + windowMs,
      };
    }

    // Если лимит превышен
    if (record.count >= max) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt,
      };
    }

    // Увеличиваем счётчик
    record.count += 1;
    return {
      allowed: true,
      remaining: max - record.count,
      resetAt: record.resetAt,
    };
  };
}

// Очистка старых записей (каждые 5 минут)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetAt < now) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000);
}

