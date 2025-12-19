import { ChangeEvent } from 'react';
import { EventType } from '../../../types';

interface EventFilterProps {
  onSortChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  types: EventType[];
  locations: string[];
  currentType: string;
  currentSort: string;
  currentLocation: string;
  currentPriceRange: string;
  searchQuery: string;
}

const EventFilter = ({
  onSortChange,
  onTypeChange,
  onLocationChange,
  onPriceRangeChange,
  onSearchChange,
  types,
  locations,
  currentType,
  currentSort,
  currentLocation,
  currentPriceRange,
  searchQuery,
}: EventFilterProps) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label
            htmlFor="search"
            className="font-semibold text-text-primary dark:text-slate-100 text-sm uppercase tracking-wide">
            Пошук:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Назва події..."
            value={searchQuery || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="w-full px-3 py-3 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-base transition-all duration-300 box-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label
            htmlFor="sort"
            className="font-semibold text-text-primary dark:text-slate-100 text-sm uppercase tracking-wide">
            Сортувати за:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value)}
            className="px-3 py-3 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary">
            <option value="date-asc">Дата (від ранніх до пізніх)</option>
            <option value="date-desc">Дата (від пізніх до ранніх)</option>
            <option value="price-asc">Ціна (від дешевих до дорогих)</option>
            <option value="price-desc">Ціна (від дорогих до дешевих)</option>
            <option value="name-asc">Назва (А-Я)</option>
            <option value="name-desc">Назва (Я-А)</option>
            <option value="location-asc">Місце (А-Я)</option>
            <option value="location-desc">Місце (Я-А)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label
            htmlFor="type"
            className="font-semibold text-text-primary dark:text-slate-100 text-sm uppercase tracking-wide">
            Тип заходу:
          </label>
          <select
            id="type"
            value={currentType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onTypeChange(e.target.value)}
            className="px-3 py-3 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary">
            <option value="all">Всі типи</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type === 'concert'
                  ? 'Концерти'
                  : type === 'theater'
                  ? 'Театри'
                  : type === 'festival'
                  ? 'Фестивалі'
                  : type === 'comedy'
                  ? 'Комедія'
                  : type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label
            htmlFor="location"
            className="font-semibold text-text-primary dark:text-slate-100 text-sm uppercase tracking-wide">
            Місце:
          </label>
          <select
            id="location"
            value={currentLocation}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onLocationChange(e.target.value)}
            className="px-3 py-3 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary">
            <option value="all">Всі місця</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label
            htmlFor="priceRange"
            className="font-semibold text-text-primary dark:text-slate-100 text-sm uppercase tracking-wide">
            Діапазон ціни:
          </label>
          <select
            id="priceRange"
            value={currentPriceRange}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onPriceRangeChange(e.target.value)}
            className="px-3 py-3 rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-100 text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary">
            <option value="all">Всі ціни</option>
            <option value="0-500">До 500 грн</option>
            <option value="500-1000">500 - 1000 грн</option>
            <option value="1000-2000">1000 - 2000 грн</option>
            <option value="2000+">Від 2000 грн</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
