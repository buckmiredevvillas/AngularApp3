
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Book, BookService } from '../book.service';

@Component({
  selector: 'app-book-list',
  imports: [AsyncPipe, FormsModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList {

  // Inject the BookService.
  private bookService = inject(BookService);

  // Refresh the book list after changes.
  private refresh$ = new BehaviorSubject<void>(undefined);

  books$ = this.refresh$.pipe(
    switchMap(() => this.bookService.getBooks())
  );

  // Form fields for adding and editing books.
  newBook = {
    title: '',
    author: '',
    description: ''
  };

  editingId: number | null = null;

  // Add a new book or update an existing book.
  saveBook(): void {
    if (!this.newBook.title.trim() ||
        !this.newBook.author.trim()) {
      return;
    }

    const request = this.editingId === null
      ? this.bookService.addBook(this.newBook)
      : this.bookService.updateBook(this.editingId, this.newBook);

    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.refresh$.next();
      },
      error: () => alert('Unable to save book.')
    });
  }

  // Load a book into the form for editing.
  editBook(book: Book): void {
    this.editingId = book.id;

    this.newBook = {
      title: book.title,
      author: book.author,
      description: book.description
    };
  }

  // Delete a book from the database.
  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.refresh$.next(),
        error: () => alert('Unable to delete book.')
      });
    }
  }

  // Clear the form.
  cancelEdit(): void {
    this.editingId = null;

    this.newBook = {
      title: '',
      author: '',
      description: ''
    };
  }
}
