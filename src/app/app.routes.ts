
import { Routes } from '@angular/router';
import { BookList } from './book-list/book-list';

export const routes: Routes = [
  // Display all books.
  { path: 'list', component: BookList },

  // Redirect the home page to the book list.
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
