// src/app/weather/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { WeatherData } from './weather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'c5c45d24fff0401f916155022252501';
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';
  private apiCitiesUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getWeather(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?key=${this.apiKey}&q=${city}`);
  }
  getSuggestedName(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiCitiesUrl}?key=${this.apiKey}&q=${city}`);
  }

  saveToHistory(weatherData: WeatherData): void {
    let history = this.storageService.getItem<WeatherData[]>('history') || [];
    console.log('history save', history, weatherData.location.name);

    // Verificar si la ciudad ya está en el historial
    const cityIndex = history.findIndex(item => item.location.name === weatherData.location.name);

    if (cityIndex === -1) {
      history.push(weatherData);
    } else {
      const cityInHistory = history[cityIndex];

      const newCityLocalTime = new Date(weatherData.location.localtime);
      const historyCityLocalTime = new Date(cityInHistory.location.localtime);

      if (newCityLocalTime > historyCityLocalTime) {
        history[cityIndex] = weatherData;
      }
    }

    this.storageService.setItem('history', history);
  }

  addToFavorite(city: string): boolean{
      let favorites = this.storageService.getItem<string[]>('favorites') || [];

      if (!favorites.includes(city)) {
        favorites.push(city);
        this.storageService.setItem('favorites', favorites);
        return true;
    }
    return false;
    }

}
