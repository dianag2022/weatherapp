// src/app/weather/weather.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { ActivatedRoute, RouterModule } from '@angular/router';  // For routing links
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
  constructor(private weatherService: WeatherService, private route: ActivatedRoute) {}

  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  isTableView: boolean = true; // Modo inicial: Vista de tabla
  successMessage: string = '';
  suggestions: string[] = []; // Almacena las sugerencias


  ngOnInit(): void {
    // Capturar el parámetro 'city' de la URL
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city') || '';
      this.getWeather();
    });
  }

  getWeather() {
    if (!this.city) {
      this.errorMessage = 'Please enter a city name';
      return;
    }

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.errorMessage = '';
        this.weatherService.saveToHistory(this.weatherData);
      },
      error: () => {
        this.errorMessage = 'City not found';
        this.weatherData = null;
      },
    });
  }

  getCitySuggestions(): void {
    if (this.city.length < 3) {
      this.suggestions = []; // Mostrar sugerencias solo si hay más de 2 caracteres
      return;
    }

    this.weatherService.getSuggestedName(this.city).subscribe({
      next: data => {
        console.log(data);

        this.suggestions = data.map((item: any) => item.name);
      },
      error: () => {
        this.suggestions = []; // Limpiar las sugerencias si hay un error
      },
    });
  }

  selectCitySuggestion(city: string): void {
    this.city = city;
    this.suggestions = [];
    this.getWeather(); // Realizar la consulta al seleccionar una sugerencia
  }

  addFavorite(): void{
    const saved:boolean = this.weatherService.addToFavorite(this.city);
    this.successMessage = saved
    ? `🙌 You've just added ${this.city} to your favorites!`
    : `💡 ${this.city} is already saved as a favorite.`;    setTimeout(() => {
      this.successMessage = '';  // Ocultar el mensaje después de 3 segundos
    }, 3000);
  }

  toggleViewMode() {
    this.isTableView = !this.isTableView;
  }

}
