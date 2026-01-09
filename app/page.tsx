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
          <img
            src="/images/homeimage.jpg"
            alt="Початкове зображення"
            className="w-full h-auto block object-cover"
          />
        </div>
        <div className="bg-gradient-to-br from-primary to-secondary text-center text-white p-12 rounded-2xl shadow-lg mb-8">
          <h3 className="text-3xl md:text-4xl mb-4 font-semibold">
            Ласкаво просимо на платформу онлайн-бронювання квитків!
          </h3>
          <p className="text-lg md:text-xl mb-6 opacity-95">
            Оберіть подію, забронюйте квиток і насолоджуйтесь незабутніми враженнями.
          </p>
          <Link
            href="/events"
            className="inline-block bg-accent text-white px-8 py-3.5 mt-4 no-underline rounded-md font-medium transition-all duration-300 shadow-md hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg">
            Переглянути події
          </Link>
        </div>
      </section>

      <Features />

      <PastEvents />

      <section
        id="about"
        className="my-16 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
        <img
          src="/images/about.jpg"
          alt="Про нас"
          className="w-full max-w-[500px] h-auto block mx-auto mb-8 rounded-lg shadow-md object-cover"
        />
        <h2 className="text-center text-4xl mb-8 text-text-primary dark:text-slate-100 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Про нас
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-lg text-text-secondary dark:text-slate-300 leading-relaxed text-justify">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Хто ми?</strong>
            <br />
            Ми — команда ентузіастів, яка створила платформу для онлайн-бронювання квитків, щоб
            зробити процес відвідування заходів швидким, зручним і доступним для всіх. Наша місія —
            об'єднати організаторів та глядачів, надаючи інноваційний сервіс, що дозволяє легко
            знаходити та бронювати квитки на найкращі події.
          </p>
          <p className="text-lg text-text-secondary dark:text-slate-300 leading-relaxed text-justify">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">
              Наша історія
            </strong>
            <br />
            Наша платформа була заснована у 2020 році групою друзів, які самі стикалися з труднощами
            придбання квитків на концерти, вистави та спортивні події. Ми почали з невеликого
            проєкту для продажу квитків на локальні концерти, і вже через рік наша система
            обслуговувала понад 1000 заходів по всій Україні.
          </p>
          <p className="text-lg text-text-secondary dark:text-slate-300 leading-relaxed text-justify">
            Зараз ми співпрацюємо з десятками організаторів, надаючи можливість купувати квитки на
            фестивалі, театральні вистави, бізнес-конференції, кінопрем'єри та багато інших подій.
          </p>
        </div>
      </section>

      <section className="my-16 py-12 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[1200px] mx-auto px-8">
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              1000+
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Подій</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              50K+
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Задоволених клієнтів</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              99%
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Позитивних відгуків</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              24/7
            </div>
            <div className="text-lg md:text-xl opacity-95 font-medium">Підтримка</div>
          </div>
        </div>
      </section>

      <div className="text-center mt-12 mb-12 py-16 px-8 min-h-[85vh] flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
        <h4 className="text-2xl md:text-3xl text-text-primary dark:text-slate-100 font-semibold">
          Якщо не хочеш пропустити наяскравіші події, бронюй білети з нами!
        </h4>
      </div>
    </>
  );
}
