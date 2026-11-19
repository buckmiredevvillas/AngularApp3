
import { Routes } from '@angular/router';
import { BookList } from './book-list/book-list';
import { AddBook } from './add-book/add-book';
import { UpdateBook } from './update-book/update-book';
import { DeleteBook } from './delete-book/delete-book';

export const routes: Routes = [
  // Display all books.
  { path: 'list', component: BookList },

  // Add a new book.
  { path: 'add', component: AddBook },

  // Update an existing book.
  { path: 'update', component: UpdateBook },

  // Delete an existing book.
  { path: 'delete', component: DeleteBook },

  // Redirect the home page to the book list.
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
