
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-delete-book',
  imports: [],
  templateUrl: './delete-book.html',
  styleUrl: './delete-book.css'
})
export class DeleteBook implements OnInit {

  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Information about the selected book.
  bookId: number | null = null;
  bookTitle = '';
  errorMessage = '';

  // Load the book selected for deletion.
  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.queryParamMap.get('id')
    );

    if (!id) {
      this.errorMessage = 'Please select a book to delete.';
      return;
    }

    this.bookId = id;

    // Retrieve books from the database.
    this.bookService.getBooks().subscribe({

      next: (books) => {

        console.log('Books returned:', books);
        console.log('Selected book ID:', id);

        // Find the matching book.
        const selectedBook = books.find(
          book => Number(book.id) === id
        );

        if (selectedBook) {
          this.bookTitle = selectedBook.title;
          this.errorMessage = '';
        } else {
          this.bookId = null;
          this.errorMessage = 'Book not found.';
        }

        this.cdr.markForCheck();
      },

      error: () => {
        this.errorMessage = 'Unable to load book.';
        this.cdr.markForCheck();
      }
    });
  }

  // Delete the selected book.
  deleteBook(): void {

    if (this.bookId === null || !this.bookTitle) {
      return;
    }

    this.bookService.deleteBook(this.bookId).subscribe({

      next: () => {
        this.router.navigate(['/list']);
      },

      error: () => {
        this.errorMessage = 'Unable to delete book.';
        this.cdr.markForCheck();
      }
    });
  }

  // Cancel deletion and return to the list.
  cancel(): void {
    this.router.navigate(['/list']);
  }
}
