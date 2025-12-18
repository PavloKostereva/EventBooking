import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { adminDb } from './src/firebase-admin.js';

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: true,       // Reflects the request origin
  credentials: true   // Allows cookies and credentials
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/events/:eventId/ratings', async (req, res) => {
  try {
    const { eventId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const offset = (page - 1) * limit;

    // Спочатку отримаємо подію, щоб дізнатися її title
    let eventTitle = null;
    try {
      const eventDoc = await adminDb.collection('events').doc(eventId).get();
      if (eventDoc.exists) {
        eventTitle = eventDoc.data().title;
      }
    } catch (err) {
      // Мовчазно ігноруємо помилку
    }

    const ratingsRef = adminDb.collection('ratingOfEvents');
    
    // Шукаємо рейтинги за eventId (doc.id)
    let snapshot = await ratingsRef.where('eventId', '==', eventId).get();

    // Якщо не знайдено за eventId, спробуємо знайти за title
    if (snapshot.size === 0 && eventTitle) {
      snapshot = await ratingsRef.where('eventId', '==', eventTitle).get();
    }

    const allRatings = [];
    const userIds = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      allRatings.push(data);
      userIds.add(data.userId);
    });

    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, item) => sum + item.rating, 0) / allRatings.length
      : 0;

    // Отримати emails по userIds
    const userEmails = {};
    const userPromises = Array.from(userIds).map(async userId => {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      if (userDoc.exists) {
        userEmails[userId] = userDoc.data().email;
      } else {
        userEmails[userId] = 'Невідомий';
      }
    });
    await Promise.all(userPromises);

    // Додати email до кожного рейтингу
    const enrichedRatings = allRatings.map(rating => ({
      ...rating,
      email: userEmails[rating.userId] || 'Невідомий'
    }));

    const paginatedRatings = enrichedRatings.slice(offset, offset + limit);

    res.json({
      success: true,
      averageRating: averageRating.toFixed(1),
      ratings: paginatedRatings,
      totalRatings: allRatings.length,
      currentPage: page,
      totalPages: Math.ceil(allRatings.length / limit)
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings'
    });
  }
});

app.post('/api/events/:eventId/rate', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const now = new Date().toISOString();
    const ratingRef = adminDb.collection('ratingOfEvents').doc(`${eventId}_${userId}`);
    const docSnap = await ratingRef.get();

    if (docSnap.exists) {
      await ratingRef.set({
        ...docSnap.data(),
        rating,
        comment,
        updatedAt: now
      });
    } else {
      await ratingRef.set({
        eventId,
        userId,
        rating,
        comment,
        createdAt: now,
        updatedAt: now
      });
    }

    // Після запису повертаємо оновлену середню оцінку та рейтинг
    const snapshot = await adminDb
      .collection('ratingOfEvents')
      .where('eventId', '==', eventId)
      .get();

    const ratings = [];
    const userIds = new Set();
    snapshot.forEach(doc => ratings.push(doc.data()));
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    // Пагінація для відгуків (опційно)
    const limit = 2; // Наприклад, обмеження для відгуків
    const paginatedRatings = ratings.slice(0, limit); // Якщо потрібно обмежити кількість

    res.json({ success: true, averageRating: avgRating.toFixed(1), ratings: paginatedRatings });

  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ success: false, message: 'Failed to save rating' });
  }
});

app.get('/api/users/:userId/ratings', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('API: Fetching ratings for userId:', userId);

    const ratingsRef = adminDb.collection('ratingOfEvents');
    const snapshot = await ratingsRef.where('userId', '==', userId).get();

    console.log('API: Found ratings documents:', snapshot.size);

    const ratings = [];
    const eventIds = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('API: Rating document:', doc.id, 'Data:', JSON.stringify(data));
      ratings.push({
        ...data,
        id: doc.id
      });
      // Додаємо eventId як рядок і як число для надійності
      if (data.eventId !== undefined && data.eventId !== null) {
        eventIds.add(String(data.eventId));
        // Якщо eventId - число, також додаємо його як рядок
        if (typeof data.eventId === 'number') {
          eventIds.add(data.eventId.toString());
        }
      }
    });

    console.log('API: Total ratings found:', ratings.length);
    console.log('API: Found eventIds in ratings:', Array.from(eventIds));

    // Отримати всі події один раз для швидшого пошуку
    const allEventsSnapshot = await adminDb.collection('events').get();
    const allEventsMap = {};
    const eventsArray = [];
    
    allEventsSnapshot.forEach(doc => {
      const eventData = doc.data();
      allEventsMap[doc.id] = eventData;
      eventsArray.push({
        id: doc.id,
        ...eventData
      });
    });
    
    // Сортуємо події за датою для узгодженості
    eventsArray.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateA - dateB;
    });
    
    // Створюємо мапу за числовими індексами (1, 2, 3...)
    // Це для сумісності зі старими відгуками, де eventId - це індекс
    eventsArray.forEach((event, index) => {
      const numericId = String(index + 1);
      allEventsMap[numericId] = event;
      allEventsMap[index + 1] = event;
    });
    
    console.log('API: Total events in database:', allEventsSnapshot.size);
    console.log('API: Event IDs in database:', Object.keys(allEventsMap).slice(0, 10));
    console.log('API: First few events:', eventsArray.slice(0, 3).map(e => ({ id: e.id, title: e.title, numericIndex: eventsArray.indexOf(e) + 1 })));

    // Отримати інформацію про події
    const eventsMap = {};
    
    // Для кожного eventId з відгуків знаходимо відповідну подію
    Array.from(eventIds).forEach(eventId => {
      const eventIdStr = String(eventId);
      const eventIdNum = !isNaN(eventId) ? Number(eventId) : null;
      
      // Спочатку шукаємо в кеші всіх подій
      let eventData = null;
      
      if (allEventsMap[eventIdStr]) {
        eventData = allEventsMap[eventIdStr];
      } else if (eventIdNum !== null && allEventsMap[eventIdNum]) {
        eventData = allEventsMap[eventIdNum];
      }
      
      if (eventData) {
        // Якщо знайшли подію, додаємо її в eventsMap
        eventsMap[eventId] = {
          title: eventData.title || 'Невідома подія',
          date: eventData.date || 'Невідома дата',
          location: eventData.location || '',
          price: eventData.price || '',
          id: eventData.id || eventIdStr
        };
      } else {
        // Якщо не знайдено в кеші, встановлюємо значення за замовчуванням
        eventsMap[eventId] = { title: 'Невідома подія', date: 'Невідома дата' };
      }
     });

     console.log('API: Created eventsMap with keys:', Object.keys(eventsMap));

     // Сортувати за датою (найновіші спочатку)
     ratings.sort((a, b) => {
       const dateA = a.updatedAt || a.createdAt || '';
       const dateB = b.updatedAt || b.createdAt || '';
       return dateB.localeCompare(dateA);
     });

     console.log('API: Sending response with', ratings.length, 'ratings and', Object.keys(eventsMap).length, 'events');

     res.json({
       success: true,
       ratings,
       eventsMap,
       totalRatings: ratings.length
     });

  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user ratings'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});