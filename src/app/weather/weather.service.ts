// src/app/weather/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'c5c45d24fff0401f916155022252501';
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getWeather(city: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?key=${this.apiKey}&q=${city}`);
  }

  saveToHistory(city: string): void {
    let history = this.storageService.getItem<string[]>('history') || [];
    console.log('history save', history, city);
    
    if (!history.includes(city)) {
      history.push(city);
      this.storageService.setItem('history', history);
    }
  }

  addToFavorite(city: string): void{
      let favorites = this.storageService.getItem<string[]>('favorites') || [];
      
      if (!favorites.includes(city)) {
        favorites.push(city);
        this.storageService.setItem('favorites', favorites);
      }
    }
  
}
