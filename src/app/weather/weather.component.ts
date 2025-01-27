import { Component, ChangeDetectionStrategy , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { ActivatedRoute, RouterModule } from '@angular/router';  // For routing links
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { WeatherService } from '../weather/weather.service';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,HttpClientModule, TranslateModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent {
  constructor(
    private weatherService: WeatherService, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef ){
    }

  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';
  isTableView: boolean = true; // Modo inicial: Vista de tabla
  successMessage: string = '';
  suggestions: string[] = []; // Almacena las sugerencias


  ngOnInit(): void {
    // get city params
    this.route.paramMap.subscribe(params => {
      this.city = params.get('city') || '';
      this.getWeather();
    });
  }

  getWeather() {
    this.cdr.markForCheck(); // check for changes
    this.errorMessage = '';
    
    if (!this.city) {
      this.errorMessage = 'Please enter a city name';
      return;
    }

    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        if(!data.error){
          this.weatherData = data;
          this.weatherService.saveToHistory(this.weatherData);
          this.cdr.markForCheck(); 
        }else{          
          this.errorMessage = 'City not found, please check and try again';
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'City not found';
        this.weatherData = null;
        this.cdr.markForCheck(); // check for changes
      },
    });
  }

  getCitySuggestions(): void {
    if (this.city.length < 3) { 
      this.suggestions = []; //more than 3 characters
      this.cdr.markForCheck(); 
      return;
    }

    this.weatherService.getSuggestedName(this.city).subscribe({
      next: data => {
        this.suggestions = data.map((item: any) => item.name);
        this.cdr.markForCheck(); 
      },
      error: () => {
        this.suggestions = []; // clean suggestions if case of error
        this.cdr.markForCheck(); 
      },
    });
  }

  selectCitySuggestion(city: string): void {
    this.city = city;
    this.suggestions = [];
    this.cdr.markForCheck(); 
    this.getWeather(); // search for city selected
  }

  addFavorite(): void{
    const saved:boolean = this.weatherService.addToFavorite(this.city);
    this.successMessage = saved
    ? `🙌 You've just added ${this.city} to your favorites!`
    : `💡 ${this.city} is already saved as a favorite.`;    setTimeout(() => {
      this.successMessage = '';  // hide message after 3 secs
    }, 3000);
    this.cdr.markForCheck(); 
  }

  toggleViewMode() {
    this.isTableView = !this.isTableView;
    this.cdr.markForCheck(); 
  }

}
