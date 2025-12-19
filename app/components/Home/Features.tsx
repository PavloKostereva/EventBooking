const Features = () => {
  return (
    <section className="my-16 py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
      <h2 className="text-center text-4xl mb-12 text-text-primary dark:text-slate-100 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Чому обирають нас?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-[1200px] mx-auto">
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Швидке бронювання
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Забронюйте квитки за кілька хвилин без черг та очікувань
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Безпечні платежі
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Ваші дані захищені сучасними технологіями безпеки
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">📱</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Зручний інтерфейс
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Простий та інтуїтивний дизайн для комфортного використання
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Відгуки користувачів
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Читайте реальні відгуки та оцінки від інших відвідувачів
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Широкий вибір
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Великий асортимент подій: концерти, театри, фестивалі та інше
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-slate-700 p-8 rounded-lg text-center transition-all duration-300 border border-gray-200 dark:border-slate-600 hover:-translate-y-2 hover:shadow-lg hover:border-primary">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl text-text-primary dark:text-slate-100 mb-4 font-semibold">
            Підтримка 24/7
          </h3>
          <p className="text-text-secondary dark:text-slate-300 leading-relaxed">
            Наша команда завжди готова допомогти вам з будь-якими питаннями
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
