import { Component, HostListener, OnInit} from '@angular/core';
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
  selectedIndex = 0;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Your code to handle the keydown event goes here
    console.log('Key pressed:', event.key);

    if (event.key === 'ArrowRight' || event.key === 'Arrow.Left') {
      event.stopPropagation();
      event.preventDefault();
    }

    if (event.key === 'ArrowRight') {
      this.selectedIndex += 1;
    } else if (event.key === 'ArrowLeft') {
      this.selectedIndex -= 1;
    }

    // Loop around.
    this.selectedIndex = this.selectedIndex >= this.images.length ? 0 : this.selectedIndex;
    this.selectedIndex = this.selectedIndex < 0 ? this.images.length - 1 : this.selectedIndex;
  }

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
        this.images = this.images.filter(image => image.includes('png') || image.includes('jpeg'));
        console.log(this.images);
      }
    })
  }
}
