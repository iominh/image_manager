import { Component, OnInit} from '@angular/core';
import { ApiService, API_PATH } from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'image-manager';

  theme = 'dark-theme'; // or 'light-theme'

  images: string[] = [];
  loading = true;

  constructor(private apiService: ApiService) {

  }

  toggleTheme() {
    this.theme = this.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
  }

  ngOnInit() {
    this.loading = true;
    this.apiService.getSomeData().subscribe(files => {
      this.loading = false;
      console.log(files);
      if (files instanceof Array) {
        this.images = files.map(file => {
          return `${API_PATH}/images/${file}`;
        });
        console.log(this.images);
      }
    })
  }
}
