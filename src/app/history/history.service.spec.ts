import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HistoryService } from './history.service';
import { StorageService } from '../services/storage.service';
import { WeatherData } from '../weather/weather.interface';

describe('HistoryService', () => {
  let service: HistoryService;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    // mock StorageService
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);

    // TestBed
    TestBed.configureTestingModule({
      providers: [
        HistoryService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });
    service = TestBed.inject(HistoryService);
  });

  // test case: loadHistory
  it('should return an empty array if no history is stored', () => {
    storageServiceMock.getItem.and.returnValue(null); // empty history

    const result = service.loadHistory();
    expect(result).toEqual([]); // should return empty array
  });

  it('should return the stored history', () => {
    const mockHistory: WeatherData[] = [
      {
        location: {
          name: 'London',
          region: 'England',
          country: 'United Kingdom',
          lat: 51.5074,
          lon: -0.1278,
          tz_id: 'Europe/London',
          localtime_epoch: 1737931200,
          localtime: '2025-01-25T12:00:00'
        },
        current: {
          last_updated_epoch: 1737931200,
          last_updated: '2025-01-25T12:00:00',
          temp_c: 15,
          temp_f: 59,
          is_day: 1,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000
          },
          wind_mph: 10,
          wind_kph: 16.1,
          wind_degree: 180,
          wind_dir: 'S',
          pressure_mb: 1015,
          pressure_in: 29.97,
          precip_mm: 0.0,
          precip_in: 0.0,
          humidity: 50,
          cloud: 10,
          feelslike_c: 15,
          feelslike_f: 59,
          windchill_c: 15,
          windchill_f: 59,
          heatindex_c: 15,
          heatindex_f: 59,
          dewpoint_c: 5,
          dewpoint_f: 41,
          vis_km: 10,
          vis_miles: 6,
          uv: 5,
          gust_mph: 15,
          gust_kph: 24.1
        }
      }
    ];
    storageServiceMock.getItem.and.returnValue(mockHistory); // history full

    const result = service.loadHistory();
    expect(result).toEqual(mockHistory); // should return history
  });

});
