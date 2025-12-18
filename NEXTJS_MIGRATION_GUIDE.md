# Інструкція по завершенню міграції на Next.js

## Що вже зроблено:

✅ Створена структура Next.js з App Router
✅ Оновлено package.json
✅ Створено Supabase клієнти (lib/supabase.js, lib/supabase-server.js)
✅ Мігровано AuthContext для Supabase
✅ Мігровано BookingContext для Supabase
✅ Створено API routes для рейтингів
✅ Створено базовий layout та головну сторінку
✅ Адаптовано Header компонент для Next.js

## Що потрібно зробити:

### 1. Встановити залежності

```bash
npm install
```

### 2. Створити файл .env.local

**Важливо:** Використовуйте один файл `.env.local` з усіма змінними:

```env
NEXT_PUBLIC_SUPABASE_URL=https://izsiftvkofvqmqmwvfol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yP-RKNRD423odW-8yvhkfw_jdDGqx5m
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Отримайте `SUPABASE_SERVICE_ROLE_KEY` з Supabase Dashboard > Settings > API > service_role key

### 3. Адаптувати компоненти для Next.js

Всі компоненти, які використовують `react-router-dom`, потрібно адаптувати:

**Замінити:**

- `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`
- `import { useNavigate } from 'react-router-dom'` → `import { useRouter } from 'next/navigation'`
- `import { useLocation } from 'react-router-dom'` → `import { usePathname } from 'next/navigation'`
- `<Link to="/path">` → `<Link href="/path">`
- `navigate('/path')` → `router.push('/path')`
- `location.pathname` → `pathname`

**Додати 'use client' директиву** на початку всіх компонентів, які використовують хуки або браузерні API.

### 4. Створити сторінки в app/ директорії

Створіть наступні файли:

- `app/events/page.jsx` - для сторінки подій
- `app/events/[id]/page.jsx` - для деталей події
- `app/booking/page.jsx` - для сторінки бронювань
- `app/about/page.jsx` - для сторінки про нас
- `app/profile/page.jsx` - для профілю користувача
- `app/logIn/page.jsx` - для сторінки входу

Кожна сторінка повинна містити 'use client' директиву, якщо використовує хуки.

### 5. Адаптувати LogInForms компонент для Supabase

Замінити Firebase Auth на Supabase Auth:

```javascript
// Замість
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

// Використовувати
import { supabase } from '../../../lib/supabase';

// Замість createUserWithEmailAndPassword
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// Замість signInWithEmailAndPassword
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### 6. Адаптувати EventList та інші компоненти для Supabase

Всі компоненти, які працюють з Firestore, потрібно адаптувати для Supabase:

**Замість Firestore:**

```javascript
import { collection, getDocs } from 'firebase/firestore';
const snapshot = await getDocs(collection(db, 'events'));
```

**Використовувати Supabase:**

```javascript
import { supabase } from '../../lib/supabase';
const { data, error } = await supabase.from('events').select('*');
```

### 7. Перемістити статичні файли

Переконайтеся, що всі зображення з `public/images/` доступні. Next.js автоматично обслуговує файли з `public/`.

### 8. Адаптувати стилі

Всі CSS файли вже скопійовані в `app/styles/`. Переконайтеся, що імпорти в компонентах правильні.

### 9. Видалити старі файли (опціонально)

Після успішної міграції можна видалити:

- `src/` директорію (якщо все працює)
- `vite.config.js`
- `server.js` (Express сервер, замінений на Next.js API routes)
- `index.html` (не потрібен для Next.js)

### 10. Запустити проект

```bash
npm run dev
```

Проект буде доступний на `http://localhost:3000`

## Важливі нотатки:

1. **'use client' директива**: Всі компоненти, які використовують React хуки або браузерні API, повинні мати 'use client' на початку файлу.

2. **Server Components**: Next.js використовує Server Components за замовчуванням. Якщо компонент не потребує інтерактивності, можна залишити його як Server Component.

3. **Метадані**: Використовуйте `metadata` export для SEO оптимізації сторінок.

4. **API Routes**: Всі API routes мають бути в `app/api/` директорії з файлом `route.js`.

5. **Supabase Auth**: Supabase має вбудовану систему автентифікації, яка автоматично створює користувачів в `auth.users` таблиці.
