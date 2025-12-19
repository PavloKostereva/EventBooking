# Налаштування Google OAuth в Supabase

Якщо ви бачите помилку "Firebase: Error (auth/unauthorized-domain)" при спробі увійти через Google, це означає, що Google OAuth не налаштований в Supabase.

## Крок 1: Налаштування Google OAuth в Supabase

1. Відкрийте Supabase Dashboard: https://app.supabase.com
2. Виберіть ваш проект
3. Перейдіть: **Authentication** → **Providers**
4. Знайдіть **Google** в списку провайдерів
5. Увімкніть Google провайдер (toggle switch)
6. Заповніть необхідні поля:
   - **Client ID (for OAuth)**
   - **Client Secret (for OAuth)**

## Крок 2: Отримання Google OAuth Credentials

Якщо у вас немає Google OAuth credentials:

1. Перейдіть на Google Cloud Console: https://console.cloud.google.com
2. Створіть новий проект або виберіть існуючий
3. Перейдіть: **APIs & Services** → **Credentials**
4. Натисніть **Create Credentials** → **OAuth client ID**
5. Виберіть тип: **Web application**
6. Додайте **Authorized redirect URIs**:
   ```
   https://ваш-проект.supabase.co/auth/v1/callback
   ```
   Замініть `ваш-проект` на ваш Supabase проект ID
7. Скопіюйте **Client ID** та **Client Secret**
8. Вставте їх в Supabase Dashboard

## Крок 3: Додавання Redirect URL в Supabase

В Supabase Dashboard:

1. Перейдіть: **Authentication** → **URL Configuration**
2. Додайте ваші домени в **Redirect URLs**:
   - Для локальної розробки: `http://localhost:3000/**`
   - Для Vercel: `https://ваш-домен.vercel.app/**`

## Крок 4: Перевірка налаштувань

Після налаштування:

1. Перезапустіть dev сервер
2. Спробуйте увійти через Google
3. Якщо все налаштовано правильно, вас перенаправить на Google для авторизації

## Альтернатива: Використання тільки Email/Password

Якщо не хочете налаштовувати Google OAuth, можете тимчасово приховати кнопку "Увійти через Google" або видалити її з компонента.
