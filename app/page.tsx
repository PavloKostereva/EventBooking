'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PastEvents from './components/Home/PastEvents';
import Features from './components/Home/Features';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ events: 0, clients: 0, reviews: 0 });

  useEffect(() => {
    setIsVisible(true);

    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const increment = (target: number) => target / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setCounters({
          events: Math.min(Math.floor(increment(1000) * step), 1000),
          clients: Math.min(Math.floor(increment(50000) * step), 50000),
          reviews: Math.min(Math.floor(increment(99) * step), 99),
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters({ events: 1000, clients: 50000, reviews: 99 });
        }
      }, duration / steps);
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="mb-12 relative overflow-hidden">
        <div className="max-w-full mx-auto mb-8 text-center rounded-2xl overflow-hidden shadow-2xl group relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
          <img
            src="/images/smth.png"
            alt="Початкове зображення"
            className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div
              className={`text-center text-white transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                Ласкаво просимо!
              </h1>
              <p className="text-xl md:text-2xl opacity-95 drop-shadow-lg">
                Ваші незабутні події чекають на вас
              </p>
            </div>
          </div>
        </div>
        <div
          className={`bg-gradient-to-br from-primary via-primary/90 to-secondary text-center text-white p-12 rounded-2xl shadow-2xl mb-8 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h3 className="text-3xl md:text-5xl mb-6 font-bold animate-pulse-slow">
            Платформа онлайн-бронювання квитків
          </h3>
          <p className="text-lg md:text-2xl mb-8 opacity-95 leading-relaxed">
            Оберіть подію, забронюйте квиток і насолоджуйтесь незабутніми враженнями
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/events"
              className="group relative inline-block bg-accent text-white px-10 py-4 no-underline rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:bg-pink-600 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <span className="relative z-10">Переглянути події</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            <Link
              href="/booking"
              className="inline-block bg-white/20 backdrop-blur-sm text-white px-10 py-4 no-underline rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg border-2 border-white/30 hover:bg-white/30 hover:-translate-y-2 hover:shadow-2xl hover:scale-105">
              Мої бронювання
            </Link>
          </div>
        </div>
      </section>

      <Features />

      <PastEvents />

      <section
        id="about"
        className="my-16 bg-gradient-to-br from-white to-bg-secondary dark:from-slate-800 dark:to-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

        <div className="relative z-10">
          <h2 className="text-center text-4xl md:text-5xl mb-12 text-text-primary dark:text-slate-100 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Про нас
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              <img
                src="/images/about.png"
                alt="Про нас"
                className="w-full max-h-[350px] h-auto object-contain rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-105 relative z-10"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">🎯</div>
                  <h3 className="text-2xl font-bold text-text-primary dark:text-slate-100">
                    Наша місія
                  </h3>
                </div>
                <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
                  Об'єднати організаторів та глядачів, надаючи інноваційний сервіс для швидкого та
                  зручного бронювання квитків на найкращі події.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">💡</div>
                  <h3 className="text-2xl font-bold text-text-primary dark:text-slate-100">
                    Наші цінності
                  </h3>
                </div>
                <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
                  Прозорість, надійність та задоволення клієнтів - це основні принципи нашої роботи.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4 text-center">👥</div>
              <h4 className="text-xl font-semibold text-text-primary dark:text-slate-100 mb-2 text-center">
                Хто ми?
              </h4>
              <p className="text-text-secondary dark:text-slate-300 text-sm leading-relaxed text-center">
                Команда ентузіастів, яка створила платформу для онлайн-бронювання квитків, щоб
                зробити процес відвідування заходів швидким, зручним і доступним для всіх.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4 text-center">📖</div>
              <h4 className="text-xl font-semibold text-text-primary dark:text-slate-100 mb-2 text-center">
                Наша історія
              </h4>
              <p className="text-text-secondary dark:text-slate-300 text-sm leading-relaxed text-center">
                Заснована у 2020 році групою друзів. Почали з невеликого проєкту, а вже через рік
                обслуговували понад 1000 заходів по всій Україні.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-xl border border-primary/20 dark:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4 text-center">🚀</div>
              <h4 className="text-xl font-semibold text-text-primary dark:text-slate-100 mb-2 text-center">
                Наші досягнення
              </h4>
              <p className="text-text-secondary dark:text-slate-300 text-sm leading-relaxed text-center">
                Співпрацюємо з десятками організаторів, надаючи можливість купувати квитки на
                фестивалі, театральні вистави, конференції та багато інших подій.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 p-8 rounded-2xl border-2 border-primary/30 dark:border-primary/40 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-text-primary dark:text-slate-100 mb-4 text-center">
              Готові почати?
            </h3>
            <p className="text-text-secondary dark:text-slate-300 mb-6 text-center leading-relaxed">
              Перегляньте наші події та забронюйте квитки на найяскравіші заходи вже сьогодні!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105">
                Переглянути події
              </Link>
              <Link
                href="/#about"
                className="bg-white/20 dark:bg-slate-700/50 backdrop-blur-sm text-text-primary dark:text-slate-100 px-8 py-3 rounded-xl font-semibold border-2 border-primary/30 dark:border-primary/40 transition-all duration-300 hover:bg-white/30 dark:hover:bg-slate-700/70 hover:-translate-y-1 hover:scale-105">
                Дізнатися більше
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="my-16 py-16 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl shadow-2xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[1200px] mx-auto px-8 relative z-10">
          <div className="text-center text-white transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group-hover:text-accent transition-colors duration-300">
              {counters.events}+
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Подій</div>
          </div>
          <div className="text-center text-white transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group-hover:text-accent transition-colors duration-300">
              {counters.clients.toLocaleString()}+
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Задоволених клієнтів</div>
          </div>
          <div className="text-center text-white transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group-hover:text-accent transition-colors duration-300">
              {counters.reviews}%
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Позитивних відгуків</div>
          </div>
          <div className="text-center text-white transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group-hover:text-accent transition-colors duration-300">
              24/7
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Підтримка</div>
          </div>
        </div>
      </section>
    </>
  );
}
