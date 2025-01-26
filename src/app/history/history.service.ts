// src/app/history/history.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root',
})
export class HistoryService {

  constructor(private storageService: StorageService) {}

  loadHistory(): string[] {
    return this.storageService.getItem<string[]>('history') || [];
  }

  

  addHistory(city: string): void {
    this.storageService.setItem('history', JSON.stringify(history));
  }
}
