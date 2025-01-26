// src/app/history/history.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { WeatherData } from '../weather/weather.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {

  constructor(private storageService: StorageService) {}

  loadHistory(): WeatherData[] {
    return this.storageService.getItem<WeatherData[]>('history') || [];
  }



  addHistory(city: string): void {
    this.storageService.setItem('history', JSON.stringify(history));
  }
}
