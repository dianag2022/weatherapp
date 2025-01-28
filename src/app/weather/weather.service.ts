// src/app/weather/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { WeatherData } from './weather.interface';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Import environment


@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';
  private apiCitiesUrl = 'https://api.weatherapi.com/v1/search.json';

  private weatherCache$: { [city: string]: Observable<any> } = {}; 
  private suggestionsCache$: { [query: string]: Observable<any> } = {}; 

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getWeather(city: string): Observable<any> {
    if (!this.weatherCache$[city]) {

      this.weatherCache$[city] = this.http
        .get<any>(`${this.apiUrl}?key=${this.apiKey}&q=${city}`)
        .pipe(
          shareReplay(1) // Compartir la respuesta y almacenar en caché
        );
    } else {
      console.log('Returning from cache data:', city);
    }

    return this.weatherCache$[city];
  }

  getSuggestedName(city: string): Observable<any> {
    if (!this.suggestionsCache$[city]) {

      this.suggestionsCache$[city] = this.http
        .get<any>(`${this.apiCitiesUrl}?key=${this.apiKey}&q=${city}`)
        .pipe(
          shareReplay(1) // Compartir la respuesta y almacenar en caché
        );
    } else {
      console.log('Returning from cache:', city);
    }

    return this.suggestionsCache$[city];
  }

  saveToHistory(weatherData: WeatherData): void {
    let history = this.storageService.getItem<WeatherData[]>('history') || [];

    // Check for same city
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
