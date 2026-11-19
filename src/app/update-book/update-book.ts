
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-update-book',
  imports: [FormsModule],
  templateUrl: './update-book.html',
  styleUrl: './update-book.css'
})
export class UpdateBook implements OnInit {

  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Selected book ID.
  bookId: number | null = null;

  // Form information.
  book = {
    title: '',
    author: '',
    description: ''
  };

  errorMessage = '';
  isLoaded = false;

  // Load the existing book information.
  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.queryParamMap.get('id')
    );

    if (!id) {
      this.errorMessage = 'Please select a book.';
      return;
    }

    this.bookId = id;

    // Get book data from PHP/MySQL.
    this.bookService.getBooks().subscribe({

      next: (books) => {

        const selectedBook = books.find(
          book => Number(book.id) === id
        );

        if (selectedBook) {

          // Populate the update form.
          this.book = {
            title: selectedBook.title,
            author: selectedBook.author,
            description: selectedBook.description
          };

          this.isLoaded = true;
          this.errorMessage = '';

        } else {
          this.errorMessage = 'Book not found.';
          this.isLoaded = false;
        }

        // Refresh the Angular display.
        this.cdr.markForCheck();
      },

      error: () => {
        this.errorMessage = 'Unable to load book.';
        this.isLoaded = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Save changes to the database.
  saveBook(): void {

    if (this.bookId === null || !this.isLoaded) {
      return;
    }

    if (!this.book.title.trim() ||
        !this.book.author.trim()) {
      this.errorMessage = 'Title and author are required.';
      return;
    }

    this.bookService.updateBook(
      this.bookId,
      this.book
    ).subscribe({

      next: () => {
        this.router.navigate(['/list']);
      },

      error: () => {
        this.errorMessage = 'Unable to update book.';
        this.cdr.markForCheck();
      }
    });
  }
}
