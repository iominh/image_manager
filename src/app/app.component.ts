import { Component, HostListener, OnInit} from '@angular/core';
import { ApiService, API_PATH, CopyFile } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'image-manager';

  theme = 'dark-theme'; // or 'light-theme'

  images: string[] = [];

  /**
   * 
   */
  savedImages = new Set<string>();

  /**
   * Best images, maybe used for cover.
   */
  bestImages = new Set<string>();

  /**
   * Images that have promise but need to be fixed.
   */
  fixImages = new Set<string>();

  loading = true;
  selectedIndex = 0;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Your code to handle the keydown event goes here
    console.log('Key pressed:', event.key);

    if (event.key === 'ArrowRight' || event.key === 'Arrow.Left' || 
        event.key === ' ' || event.key === 'Bkacspace') {
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
    const selectedImage = this.images[this.selectedIndex];

    if (event.key === ' ' || event.key === 's') {
      this.savedImages.add(selectedImage);
      this.openSnackBar('Saved image' + this.selectedIndex);
    } else if (event.key === 'Backspace') {
      this.savedImages.delete(selectedImage);
      this.fixImages.delete(selectedImage);
      this.bestImages.delete(selectedImage);
      this.openSnackBar('Deleted image' + this.selectedIndex);
    } else if (event.key === 'f') {
      this.fixImages.add(selectedImage);
      this.openSnackBar('Saved image for fix' + this.selectedIndex);
    } else if (event.key === 'b') {
      this.openSnackBar('Saved best image' + this.selectedIndex);
      this.bestImages.add(selectedImage);
    } else if (event.key === '1') {
      this.copyFiles();
    }
    this.updateUrlWithQueryParameter();
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {

  }

  toggleTheme() {
    this.theme = this.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
  }

  ngOnInit() {
    this.loading = true;
    this.apiService.getSomeData().subscribe(files => {
      this.loading = false;
      if (files instanceof Array) {
        this.images = files.map(file => {
          return `${API_PATH}/images/${file}`;
        });
        this.images = this.images.filter(image => image.includes('png') || image.includes('jpeg'));
        console.log(this.images);
      }
    })

    this.activatedRoute.queryParams.subscribe(params => {
      const index = params['index'] || 0;
      this.selectedIndex = +index;
    });
  }

  createDirectories() {
    this.snackBar.open('Creating directories');
    this.apiService.createDirs().subscribe(result => {
      this.openSnackBar('Created directories result: ' + JSON.stringify(result));
    })
  }

  copyFiles() {
    this.openSnackBar('Copying files');
    const fileList: CopyFile[] = [];
    this.bestImages.forEach(img => {
      fileList.push({
        source: img,
        destination: 'best'
      });
    })
    this.savedImages.forEach(img => {
      fileList.push({
        source: img,
        destination: 'saved'
      });
    })
    this.fixImages.forEach(img => {
      fileList.push({
        source: img,
        destination: 'fix'
      });
    })
    if (fileList.length > 0) {
      this.apiService.copyFiles(fileList).subscribe(result => {
        this.openSnackBar('Copied files' + JSON.stringify(result));
      })
    } else {
      this.openSnackBar('No images to copy');
    }
  }

  openSnackBar(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration,
    });
  }

  imagesArray(type: 'saved' | 'best' | 'fix'): string[] {
    if (type === 'saved') {
      return Array.from(this.savedImages);
    } else if (type === 'best') {
      return Array.from(this.bestImages);
    } else {
      return Array.from(this.fixImages);
    }
  }

  private updateUrlWithQueryParameter() {
    const queryParams = { index: this.selectedIndex || 0 };
    this.router.navigate([], {
      relativeTo: this.activatedRoute, // if you want to navigate relative to the current route
      queryParams: queryParams,
      queryParamsHandling: 'merge', // or 'preserve' to keep existing ones
    });
  }
}
