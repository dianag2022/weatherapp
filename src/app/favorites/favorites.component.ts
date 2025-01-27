// src/app/favorites/favorites.component.ts
import { Component  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../favorites/favorites.service';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  favorites: string[] = [];
  currentPage: number = 1; 
  itemsPerPage: number = 3; //max number of item per page
  paginatedFavorites: string[] = []; // items of page

  constructor(private favoritesService: FavoritesService) {
    this.loadHistory();
  }

  loadHistory(): void{
    this.favorites = this.favoritesService.getFavorites();
    this.updatePaginatedFavorites();

  }

  updatePaginatedFavorites(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFavorites = this.favorites.slice(startIndex, endIndex);

  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedFavorites();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedFavorites();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFavorites();
    }
  }

  totalPages(): number {
    return Math.ceil(this.favorites.length / this.itemsPerPage);
  }

  removeFavorite(city: string) {
    this.favoritesService.removeFavorite(city);
    this.favorites = this.favoritesService.getFavorites();
    this.updatePaginatedFavorites();
  }
}
