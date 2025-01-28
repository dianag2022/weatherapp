import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../history/history.service';
import { WeatherData } from '../weather/weather.interface';
import { Router } from '@angular/router';
import { TranslateModule} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,  // required to http request
    TranslateModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {

  history: WeatherData[] = [];
  isTableView: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedHistory: WeatherData[] = [];

  constructor(
    private historyService: HistoryService,
    private router: Router
  ) {
    this.loadHistory();
  }

  loadHistory(): void {
    this.history = this.historyService.loadHistory();
    this.updatePaginatedHistory();
  }

  updatePaginatedHistory(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHistory = this.history.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedHistory();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedHistory();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedHistory();
    }
  }

  totalPages(): number {
    return Math.ceil(this.history.length / this.itemsPerPage);
  }

  selectCity(city: WeatherData) {
    this.router.navigate(['/weather', city.location.name]);
  }

  toggleViewMode() {
    this.isTableView = !this.isTableView;
  }

}
