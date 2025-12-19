# Як отримати ключі з Supabase

## Крок 1: Відкрийте Supabase Dashboard
1. Перейдіть на https://app.supabase.com
2. Увійдіть у свій акаунт
3. Виберіть ваш проект (або створіть новий)

## Крок 2: Відкрийте налаштування API
1. У лівому меню натисніть на **Settings** (⚙️ Налаштування)
2. Виберіть **API** в підменю

## Крок 3: Знайдіть потрібні ключі

На сторінці API ви побачите кілька секцій:

### Project URL (URL проекту)
Це ваш `NEXT_PUBLIC_SUPABASE_URL`
- Знаходиться в секції **Project URL**
- Виглядає як: `https://xxxxxxxxxxxxx.supabase.co`
- **Це потрібно для `.env.local`:**
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
  ```

### API Keys (Ключі API)
Тут є два ключі:

#### 1. anon / public key (Публічний ключ)
Це ваш `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Знаходиться в секції **Project API keys**
- Найчастіше це перший ключ (позначений як `anon` або `public`)
- **Це потрібно для `.env.local`:**
  ```
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

#### 2. service_role key (Серверний ключ)
Це ваш `SUPABASE_SERVICE_ROLE_KEY`
- Знаходиться в тій же секції **Project API keys**
- Позначений як `service_role`
- ⚠️ **ВАЖЛИВО:** Цей ключ має повний доступ до бази даних, обходять RLS (Row Level Security)
- **НЕ використовуйте його в клієнтському коді!** Тільки на сервері (Next.js API routes)
- **Це потрібно для `.env.local`:**
  ```
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

## Крок 4: Додайте ключі до `.env.local`

Створіть або відредагуйте файл `.env.local` в корені вашого проекту:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key-тут
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-key-тут
```

## Важливо:

1. **`.env.local` не потрібно комітити в git** (він вже в `.gitignore`)
2. **На Vercel** додайте ці змінні в **Settings → Environment Variables**
3. **service_role key** - це секретний ключ, не діліться ним публічно
4. Після додавання змінних на Vercel потрібно **перезапустити deployment**

## Як додати змінні на Vercel:

1. Перейдіть в ваш проект на Vercel
2. Відкрийте **Settings** → **Environment Variables**
3. Додайте кожну змінну окремо:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ваш-проект.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `ваш-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `ваш-service-role-key`
4. Натисніть **Save**
5. Перезапустіть deployment (Redeploy)

