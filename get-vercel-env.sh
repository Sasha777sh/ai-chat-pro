#!/bin/bash

# Команда для получения переменных окружения для импорта в Vercel
# Использование: ./get-vercel-env.sh

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Файл $ENV_FILE не найден!" >&2
    exit 1
fi

# Выводим только переменные без комментариев, в формате для импорта
grep -E "^NEXT_PUBLIC_SUPABASE_URL=" "$ENV_FILE" 2>/dev/null
grep -E "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^SUPABASE_SERVICE_ROLE_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^OPENAI_API_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^YK_SHOP_ID=" "$ENV_FILE" 2>/dev/null
grep -E "^YK_SECRET_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^NEXT_PUBLIC_APP_URL=" "$ENV_FILE" 2>/dev/null | sed 's|http://localhost:3000|https://chatedem.com|'
grep -E "^CRYPTO_IPN_SECRET=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_CARD=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_NAME=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_BANK=" "$ENV_FILE" 2>/dev/null
grep -E "^SUPPORT_EMAIL=" "$ENV_FILE" 2>/dev/null

