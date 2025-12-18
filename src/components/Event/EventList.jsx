import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventFilter from './EventFilter';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortOption, setSortOption] = useState('date-asc');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Помилка при завантаженні подій:', error);
      }
    };

    fetchEvents();
  }, []);

  const eventTypes = [...new Set(events.map((event) => event.type))];
  const eventLocations = [...new Set(events.map((event) => event.location).filter(Boolean))];

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [...events];

    // Пошук за назвою
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((event) => event.title?.toLowerCase().includes(query));
    }

    // Фільтр за типом
    if (selectedType !== 'all') {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    // Фільтр за місцем
    if (selectedLocation !== 'all') {
      filtered = filtered.filter((event) => event.location === selectedLocation);
    }

    // Фільтр за діапазоном ціни
    if (priceRange !== 'all') {
      filtered = filtered.filter((event) => {
        const price = parseInt(event.price?.replace(/\D/g, '') || 0);
        switch (priceRange) {
          case '0-500':
            return price <= 500;
          case '500-1000':
            return price > 500 && price <= 1000;
          case '1000-2000':
            return price > 1000 && price <= 2000;
          case '2000+':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    // Фільтр за минулими подіями
    if (!showPastEvents) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      });
    }

    // Сортування
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'price-asc':
          return (
            parseInt(a.price?.replace(/\D/g, '') || 0) - parseInt(b.price?.replace(/\D/g, '') || 0)
          );
        case 'price-desc':
          return (
            parseInt(b.price?.replace(/\D/g, '') || 0) - parseInt(a.price?.replace(/\D/g, '') || 0)
          );
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '', 'uk');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '', 'uk');
        case 'location-asc':
          return (a.location || '').localeCompare(b.location || '', 'uk');
        case 'location-desc':
          return (b.location || '').localeCompare(a.location || '', 'uk');
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, selectedType, selectedLocation, priceRange, searchQuery, sortOption, showPastEvents]);

  const togglePastEvents = () => {
    setShowPastEvents((prev) => !prev);
  };

  return (
    <section>
      <h2>Події</h2>

      <div className="filter-controls">
        <EventFilter
          onSortChange={setSortOption}
          onTypeChange={setSelectedType}
          onLocationChange={setSelectedLocation}
          onPriceRangeChange={setPriceRange}
          onSearchChange={setSearchQuery}
          types={eventTypes}
          locations={eventLocations}
          currentType={selectedType}
          currentSort={sortOption}
          currentLocation={selectedLocation}
          currentPriceRange={priceRange}
          searchQuery={searchQuery}
        />

        <div className="show-past-events">
          <label>
            <input type="checkbox" checked={showPastEvents} onChange={togglePastEvents} />
            Показувати минулі події
          </label>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="no-events">Немає запланованих подій вибраного типу</p>
        )}
      </div>
    </section>
  );
};

export default EventList;
