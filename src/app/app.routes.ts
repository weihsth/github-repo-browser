import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';
import { RepoDetailComponent } from './features/repo-detail/repo-detail.component';

// myapp://repo/angular/angular or https://my.domain/repo/angular/angular
// needs to be configured in xCode (iOS) and AndroidStudio and Webpage
export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'repo/:fullName', component: RepoDetailComponent },
];
