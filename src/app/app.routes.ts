// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { HistoryComponent } from './history/history.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: WeatherComponent },    // Default route to WeatherComponent
  { path: 'history', component: HistoryComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }  // Wildcard route for 404
];
