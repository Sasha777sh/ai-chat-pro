#!/bin/bash

# Скрипт для экспорта переменных окружения для Vercel
# Использование: ./export-env-for-vercel.sh

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Файл $ENV_FILE не найден!"
    exit 1
fi

echo "📋 Переменные окружения для импорта в Vercel:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Критические переменные (обязательные)
echo "# 🔴 КРИТИЧЕСКИЕ (обязательные)"
grep -E "^NEXT_PUBLIC_SUPABASE_URL=" "$ENV_FILE" 2>/dev/null
grep -E "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^SUPABASE_SERVICE_ROLE_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^OPENAI_API_KEY=" "$ENV_FILE" 2>/dev/null
echo ""

# Важные переменные (для оплаты)
echo "# 🟡 ВАЖНЫЕ (для оплаты)"
grep -E "^YK_SHOP_ID=" "$ENV_FILE" 2>/dev/null
grep -E "^YK_SECRET_KEY=" "$ENV_FILE" 2>/dev/null
grep -E "^NEXT_PUBLIC_APP_URL=" "$ENV_FILE" 2>/dev/null
echo ""

# Опциональные переменные
echo "# 🟢 ОПЦИОНАЛЬНЫЕ"
grep -E "^CRYPTO_IPN_SECRET=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_CARD=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_NAME=" "$ENV_FILE" 2>/dev/null
grep -E "^MANUAL_PAYMENT_BANK=" "$ENV_FILE" 2>/dev/null
grep -E "^SUPPORT_EMAIL=" "$ENV_FILE" 2>/dev/null
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Скопируй все переменные выше (без комментариев) и импортируй в Vercel"
echo ""
echo "📝 Инструкция:"
echo "1. Скопируй переменные (без строк с #)"
echo "2. Vercel Dashboard → Проект → Settings → Environment Variables"
echo "3. Нажми 'Import' или добавь вручную"
echo "4. Выбери окружения: Production, Preview"
echo "5. Сохрани и передеплой проект"
echo ""

