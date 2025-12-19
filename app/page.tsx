'use client';
import Link from 'next/link';
import PastEvents from './components/Home/PastEvents';
import Features from './components/Home/Features';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <section className="mb-12">
        <div className="max-w-full mx-auto mb-8 text-center rounded-2xl overflow-hidden shadow-lg">
          <img src="/images/homeimage.jpg" alt="Початкове зображення" className="w-full h-auto block object-cover" />
        </div>
        <div className="bg-gradient-to-br from-primary to-secondary text-center text-white p-12 rounded-2xl shadow-lg mb-8">
          <h3 className="text-3xl md:text-4xl mb-4 font-semibold">Ласкаво просимо на платформу онлайн-бронювання квитків!</h3>
          <p className="text-lg md:text-xl mb-6 opacity-95">Оберіть подію, забронюйте квиток і насолоджуйтесь незабутніми враженнями.</p>
          <Link 
            href="/events" 
            className="inline-block bg-accent text-white px-8 py-3.5 mt-4 no-underline rounded-md font-medium transition-all duration-300 shadow-md hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg">
            Переглянути події
          </Link>
        </div>
      </section>

      <Features />

      <PastEvents />

      <section className="my-16 py-12 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[1200px] mx-auto px-8">
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">1000+</div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Подій</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">50K+</div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Задоволених клієнтів</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">99%</div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Позитивних відгуків</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">24/7</div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Підтримка</div>
          </div>
        </div>
      </section>

      <div className="text-center mt-12 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
        <h4 className="text-2xl text-text-primary dark:text-slate-100 font-semibold">Якщо не хочеш пропустити наяскравіші події, бронюй білети з нами!</h4>
      </div>
    </>
  );
}
