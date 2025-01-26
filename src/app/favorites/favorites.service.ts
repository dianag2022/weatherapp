// src/app/favorites/favorites.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {

  constructor(private storageService: StorageService){}
  getFavorites(): string[] {
    return this.storageService.getItem<string[]>('favorites') || [];
  }

  addFavorite(city: string): void {
    const favorites = this.getFavorites();
    favorites.push(city);
    this.storageService.setItem('favorites', JSON.stringify(favorites));
  }

  removeFavorite(city: string): void {
    let favorites = this.getFavorites();
    console.log(favorites, 'before');
    
    favorites = favorites.filter(fav => fav !== city);
    console.log(favorites, 'after');

    this.storageService.setItem('favorites', favorites);
  }
}
