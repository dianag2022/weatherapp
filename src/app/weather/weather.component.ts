// src/app/weather/weather.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { RouterModule } from '@angular/router';  // For routing links
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { WeatherService } from '../weather/weather.service';
import { StorageService } from '../services/storage.service';  // Importar el servicio
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HttpClientModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],

})
export class WeatherComponent {
  constructor(private weatherService: WeatherService) {}

  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';


  getWeather() {
    if (!this.city) {
      this.errorMessage = 'Please enter a city name';
      return;
    }

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.errorMessage = '';
        this.weatherService.saveToHistory(this.city);
      },
      error: () => {
        this.errorMessage = 'City not found';
        this.weatherData = null;
      },
    });
  }

  addFavorite(): void{
    this.weatherService.addToFavorite(this.city);
  }

  
}
