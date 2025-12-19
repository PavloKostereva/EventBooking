const PastEvents = () => {
  return (
    <section className="mt-12">
      <h2 className="bg-gradient-to-r from-primary to-secondary text-center text-4xl text-white py-6 rounded-lg shadow-md mb-8 font-semibold">
        Події з якими ми співпрацювали
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-slate-800 text-center p-8 rounded-lg shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl mb-4 text-text-primary dark:text-slate-100 font-semibold">
            Концерт Imagine Dragons
          </h3>
          <img
            src="/images/imagine dragons.jpg"
            alt="Фестиваль електронної музики"
            className="w-full max-w-[500px] mx-auto mb-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Дата:</strong>{' '}
            15 квітня 2021
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Місце:</strong>{' '}
            Палац Спорту, Київ
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed">
            Один із найочікуваніших концертів року! Гурт Imagine Dragons у турі.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 text-center p-8 rounded-lg shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-xl">
          <h3 className="text-2xl mb-4 text-text-primary dark:text-slate-100 font-semibold">
            Фестиваль електронної музики
          </h3>
          <img
            src="/images/el music.jpeg"
            alt="Фестиваль електронної музики"
            className="w-full max-w-[500px] mx-auto mb-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]"
          />
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Дата:</strong> 5
            червня 2021
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Місце:</strong>{' '}
            Пляж Аркадія, Одеса
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed">
            Найяскравіший фестиваль літа! Виступи топових діджеїв та незабутня атмосфера.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;
