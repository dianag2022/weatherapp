import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'myappweather';

  constructor(private translate: TranslateService) {
    // set default language
    this.translate.setDefaultLang('en');
  }

  // change language
  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
