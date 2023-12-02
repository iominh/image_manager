import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-manager';

  theme = 'dark-theme'; // or 'light-theme'

  toggleTheme() {
    this.theme = this.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
  }
}
