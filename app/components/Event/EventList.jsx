'use client';
import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventFilter from './EventFilter';
import { supabase } from '../../../lib/supabase';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortOption, setSortOption] = useState('date-asc');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Початок завантаження подій з Supabase...');
        const { data, error } = await supabase.from('events').select('*');

        if (error) {
          console.error('Помилка при завантаженні подій:', error);
          console.error('Помилка деталі:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          setEvents([]);
          return;
        }
        console.log('Успішно завантажено подій:', data?.length || 0);
        console.log('Завантажені події з Supabase:', data);
        setEvents(data || []);
      } catch (error) {
        console.error('Неперехоплена помилка при завантаженні подій:', error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  const eventTypes = [...new Set(events.map((event) => event.type))];
  const eventLocations = [...new Set(events.map((event) => event.location).filter(Boolean))];

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Поточна дата для фільтрації:', today.toISOString().split('T')[0]);

    let filtered = [...events];
    console.log('Початкова кількість подій:', events.length);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((event) => event.title?.toLowerCase().includes(query));
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((event) => event.location === selectedLocation);
    }

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

    if (!showPastEvents) {
      filtered = filtered.filter((event) => {
        if (!event.date) {
          console.log(`Event "${event.title}" не має дати, пропускаємо`);
          return false;
        }
        try {
          const eventDate = new Date(event.date);
          if (isNaN(eventDate.getTime())) {
            console.log(`Event "${event.title}" має невалідну дату: ${event.date}`);
            return false;
          }
          eventDate.setHours(0, 0, 0, 0);
          const result = eventDate >= today;
          if (!result) {
            console.log(
              `Event "${event.title}" пропущено (дата: ${event.date}, сьогодні: ${
                today.toISOString().split('T')[0]
              })`,
            );
          }
          return result;
        } catch (error) {
          console.error(`Помилка обробки дати для події "${event.title}":`, error);
          return false;
        }
      });
    }

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

    console.log('Всі події:', events.length);
    console.log('Відфільтровані події:', filtered.length);
    console.log('showPastEvents:', showPastEvents);
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
        ) : events.length > 0 ? (
          <div>
            <p className="no-events">
              Немає запланованих подій вибраного типу (знайдено {events.length} подій в базі, але
              всі відфільтровані)
            </p>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              Спробуйте увімкнути "Показувати минулі події" або змінити фільтри
            </p>
          </div>
        ) : (
          <p className="no-events">Немає запланованих подій вибраного типу</p>
        )}
      </div>
    </section>
  );
};

export default EventList;
