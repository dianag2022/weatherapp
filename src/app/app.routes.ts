// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { HistoryComponent } from './history/history.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  {
    path: '', loadComponent: () =>
      import('./weather/weather.component').then((m) => m.WeatherComponent)
  },   
  { path: 'history', loadComponent: () =>
    import('./history/history.component').then((m) => m.HistoryComponent) },
  { path: 'favorites', loadComponent: () =>
    import('./favorites/favorites.component').then((m) => m.FavoritesComponent) },
  { path: 'weather/:city', loadComponent: () =>
    import('./weather/weather.component').then((m) => m.WeatherComponent) }, 
  { path: '**', redirectTo: '' } 
];
