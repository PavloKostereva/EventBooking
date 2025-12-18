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
}) => {
  return (
    <div className="event-filters">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="search">Пошук:</label>
          <input
            type="text"
            id="search"
            placeholder="Назва події..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Сортувати за:</label>
          <select id="sort" value={currentSort} onChange={(e) => onSortChange(e.target.value)}>
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

        <div className="filter-group">
          <label htmlFor="type">Тип заходу:</label>
          <select id="type" value={currentType} onChange={(e) => onTypeChange(e.target.value)}>
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

        <div className="filter-group">
          <label htmlFor="location">Місце:</label>
          <select
            id="location"
            value={currentLocation}
            onChange={(e) => onLocationChange(e.target.value)}>
            <option value="all">Всі місця</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priceRange">Діапазон ціни:</label>
          <select
            id="priceRange"
            value={currentPriceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}>
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
