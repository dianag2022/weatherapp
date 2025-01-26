// src/app/history/history.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../history/history.service';
import { StorageService } from '../services/storage.service';  // Importar el servicio

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  history: string[] = [];

  constructor(private historyService: HistoryService, private storageService: StorageService) {
    this.loadHistory();
  }

  loadHistory(): void{
    this.history = this.historyService.loadHistory();
  }

  selectCity(city: string) {
    // Logic to display selected city's weather
  }
}
