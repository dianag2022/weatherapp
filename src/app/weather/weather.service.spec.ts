import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { StorageService } from '../services/storage.service';
import { of } from 'rxjs';
import { WeatherData } from './weather.interface';

// Mocks
class MockStorageService {
  private storage: { [key: string]: any } = {};

  getItem<T>(key: string): T {
    return this.storage[key] || null;
  }

  setItem(key: string, value: any): void {
    this.storage[key] = value;
  }
}

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;
  let storageService: MockStorageService;

  beforeEach(() => {
    storageService = new MockStorageService();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: StorageService, useValue: storageService },
      ],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // check http pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // test getWeather()
  it('should fetch weather data for the city and cache it', () => {
    const city = 'London';
    const mockWeatherData: WeatherData = {
      location: {
        name: 'London',
        region: 'England',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        tz_id: 'Europe/London',
        localtime_epoch: 1737931200,
        localtime: '2025-01-25T12:00:00',
      },
      current: {
        last_updated_epoch: 1737931200,
        last_updated: '2025-01-25T12:00:00',
        temp_c: 10,
        temp_f: 50,
        is_day: 1,
        condition: { text: 'Sunny', icon: '', code: 1000 },
        wind_mph: 5,
        wind_kph: 8,
        wind_degree: 180,
        wind_dir: 'S',
        pressure_mb: 1010,
        pressure_in: 29.83,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 60,
        cloud: 0,
        feelslike_c: 10,
        feelslike_f: 50,
        windchill_c: 10,
        windchill_f: 50,
        heatindex_c: 10,
        heatindex_f: 50,
        dewpoint_c: 2,
        dewpoint_f: 36,
        vis_km: 10,
        vis_miles: 6,
        uv: 1,
        gust_mph: 10,
        gust_kph: 16,
      },
    };

    service.getWeather(city).subscribe((data) => {
      expect(data).toEqual(mockWeatherData);
    });

    const request = httpMock.expectOne(
      `https://api.weatherapi.com/v1/current.json?key=c5c45d24fff0401f916155022252501&q=${city}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockWeatherData);

    service.getWeather(city).subscribe((cachedData) => {
      expect(cachedData).toEqual(mockWeatherData);
    });
  });

  // test getSuggestedName()
  it('should fetch city suggestions and cache them', () => {
    const city = 'Lon';
    const mockSuggestions = [{ name: 'London' }, { name: 'Londrina' }];

    service.getSuggestedName(city).subscribe((data) => {
      expect(data).toEqual(mockSuggestions);
    });

    const request = httpMock.expectOne(
      `https://api.weatherapi.com/v1/search.json?key=c5c45d24fff0401f916155022252501&q=${city}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockSuggestions);

    // check cache suggestions
    service.getSuggestedName(city).subscribe((cachedData) => {
      expect(cachedData).toEqual(mockSuggestions);
    });
  });

  // test saveToHistory()
  it('should save a city to the history', () => {
    const mockWeatherData: WeatherData = {
      location: {
        name: 'London',
        region: 'England',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        tz_id: 'Europe/London',
        localtime_epoch: 1737931200,
        localtime: '2025-01-01T12:00:00',
      },
      current: {
        last_updated_epoch: 1737931200,
        last_updated: '2025-01-01T12:00:00',
        temp_c: 20,
        temp_f: 68,
        is_day: 1,
        condition: { text: 'Clear', icon: 'clear-icon.png', code: 1000 },
        wind_mph: 5,
        wind_kph: 8,
        wind_degree: 180,
        wind_dir: 'S',
        pressure_mb: 1010,
        pressure_in: 29.83,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 60,
        cloud: 0,
        feelslike_c: 20,
        feelslike_f: 68,
        windchill_c: 20,
        windchill_f: 68,
        heatindex_c: 20,
        heatindex_f: 68,
        dewpoint_c: 10,
        dewpoint_f: 50,
        vis_km: 10,
        vis_miles: 6,
        uv: 1,
        gust_mph: 10,
        gust_kph: 16,
      },
    };

    const initialHistory: WeatherData[] = [];

    storageService.setItem('history', initialHistory);

    service.saveToHistory(mockWeatherData);

    const history = storageService.getItem<WeatherData[]>('history');
    expect(history.length).toBe(1);
    expect(history[0].location.name).toBe('London');
  });

  it('should update the city in history if the data is newer', () => {
    const oldWeatherData: WeatherData = {
      location: {
        name: 'London',
        region: 'England',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        tz_id: 'Europe/London',
        localtime_epoch: 1737920400,
        localtime: '2025-01-01T10:00:00',
      },
      current: {
        last_updated_epoch: 1737920400,
        last_updated: '2025-01-01T10:00:00',
        temp_c: 15,
        temp_f: 59,
        is_day: 1,
        condition: { text: 'Cloudy', icon: 'cloudy-icon.png', code: 1003 },
        wind_mph: 3,
        wind_kph: 5,
        wind_degree: 200,
        wind_dir: 'SW',
        pressure_mb: 1015,
        pressure_in: 30.00,
        precip_mm: 0.0,
        precip_in: 0.0,
        humidity: 70,
        cloud: 50,
        feelslike_c: 15,
        feelslike_f: 59,
        windchill_c: 15,
        windchill_f: 59,
        heatindex_c: 15,
        heatindex_f: 59,
        dewpoint_c: 10,
        dewpoint_f: 50,
        vis_km: 10,
        vis_miles: 6,
        uv: 1,
        gust_mph: 6,
        gust_kph: 10,
      },
    };

    const newWeatherData: WeatherData = {
      ...oldWeatherData,
      location: {
        ...oldWeatherData.location,
        localtime: '2025-01-01T12:00:00',
        localtime_epoch: 1737931200, // Newer timestamp
      },
      current: {
        ...oldWeatherData.current,
        temp_c: 18, // Slightly changed data to confirm update
        temp_f: 64.4,
      },
    };
    
    const initialHistory: WeatherData[] = [oldWeatherData];
    storageService.setItem('history', initialHistory);

    service.saveToHistory(newWeatherData);

    const history = storageService.getItem<WeatherData[]>('history');
    expect(history.length).toBe(1);
    expect(history[0].location.localtime).toBe('2025-01-01T12:00:00');
  });

  // test addToFavorite()
  it('should add a city to favorites', () => {
    const city = 'London';
    const initialFavorites: string[] = [];
    storageService.setItem('favorites', initialFavorites);

    const result = service.addToFavorite(city);
    const favorites = storageService.getItem<string[]>('favorites');

    expect(result).toBe(true);
    expect(favorites.length).toBe(1);
    expect(favorites[0]).toBe('London');
  });

  it('should not add a city to favorites if it already exists', () => {
    const city = 'London';
    const initialFavorites = ['London'];
    storageService.setItem('favorites', initialFavorites);

    const result = service.addToFavorite(city);
    const favorites = storageService.getItem<string[]>('favorites');

    expect(result).toBe(false);
    expect(favorites.length).toBe(1); // city already in favorites
  });
});
