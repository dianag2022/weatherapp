// src/app/history/history.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../history/history.service';
import { StorageService } from '../services/storage.service';  // Importar el servicio
import { WeatherData } from '../weather/weather.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  history: WeatherData[] = [];
  isTableView: boolean = true; // Modo inicial: Vista de tabla

  constructor(
    private historyService: HistoryService,
    private storageService: StorageService,
    private router: Router) {
    this.loadHistory();
  }

  loadHistory(): void{
    this.history = this.historyService.loadHistory();
  }

  selectCity(city: WeatherData) {
    // Logic to display selected city's weather
    console.log(city);
    this.router.navigate(['/weather', city.location.name]);  // Usamos el nombre de la ciudad como parámetro


  }

  toggleViewMode() {
    this.isTableView = !this.isTableView;
  }
}
