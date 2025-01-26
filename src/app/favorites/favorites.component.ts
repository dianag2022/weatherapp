// src/app/favorites/favorites.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../favorites/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  favorites: string[] = [];

  constructor(private favoritesService: FavoritesService) {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFavorite(city: string) {
    this.favoritesService.removeFavorite(city);
    this.favorites = this.favoritesService.getFavorites();
  }
}
