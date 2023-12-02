import { Component, OnInit} from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'image-manager';

  theme = 'dark-theme'; // or 'light-theme'

  constructor(private apiService: ApiService) {

  }

  toggleTheme() {
    this.theme = this.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
  }

  ngOnInit() {
    this.apiService.getSomeData().subscribe(files => {
      console.log(files);
    })
  }
}
