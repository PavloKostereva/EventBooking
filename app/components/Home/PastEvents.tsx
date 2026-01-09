const PastEvents = () => {
  return (
    <section className="mt-12">
      <h2 className="bg-gradient-to-r from-primary to-secondary text-center text-4xl md:text-5xl text-white py-8 rounded-xl shadow-xl mb-8 font-bold">
        Події з якими ми співпрацювали
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="group bg-white dark:bg-slate-800 text-center p-8 rounded-xl shadow-lg transition-all duration-500 border border-gray-200 dark:border-slate-700 hover:-translate-y-3 hover:shadow-2xl hover:border-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-500"></div>
          <h3 className="text-2xl mb-4 text-text-primary dark:text-slate-100 font-semibold relative z-10">
            Концерт Imagine Dragons
          </h3>
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img
              src="/images/imagine dragons.jpg"
              alt="Концерт Imagine Dragons"
              className="w-full max-w-[500px] mx-auto rounded-lg shadow-xl transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2 relative z-10">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Дата:</strong>{' '}
            15 квітня 2021
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2 relative z-10">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Місце:</strong>{' '}
            Палац Спорту, Київ
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed relative z-10">
            Один із найочікуваніших концертів року! Гурт Imagine Dragons у турі.
          </p>
        </div>
        <div className="group bg-white dark:bg-slate-800 text-center p-8 rounded-xl shadow-lg transition-all duration-500 border border-gray-200 dark:border-slate-700 hover:-translate-y-3 hover:shadow-2xl hover:border-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-500"></div>
          <h3 className="text-2xl mb-4 text-text-primary dark:text-slate-100 font-semibold relative z-10">
            Фестиваль електронної музики
          </h3>
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img
              src="/images/el music.jpeg"
              alt="Фестиваль електронної музики"
              className="w-full max-w-[500px] mx-auto rounded-lg shadow-xl transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2 relative z-10">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Дата:</strong> 5
            червня 2021
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed mb-2 relative z-10">
            <strong className="text-text-primary dark:text-slate-100 font-semibold">Місце:</strong>{' '}
            Пляж Аркадія, Одеса
          </p>
          <p className="text-base text-text-secondary dark:text-slate-300 leading-relaxed relative z-10">
            Найяскравіший фестиваль літа! Виступи топових діджеїв та незабутня атмосфера.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PastEvents;
