
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-book',
  imports: [FormsModule],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css'
})
export class AddBook {

  private bookService = inject(BookService);
  private router = inject(Router);

  // Book information entered in the form.
  book = {
    title: '',
    author: '',
    description: ''
  };

  // Store the selected book-cover image.
  selectedFile: File | null = null;

  errorMessage = '';

  // Handle the image selected by the user.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = null;
    this.errorMessage = '';

    if (file) {
      // Only allow supported image types.
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a JPG, PNG or WEBP image.';
        input.value = '';
        return;
      }

      // Maximum file size is 2 MB.
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'Image must be smaller than 2 MB.';
        input.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  // Save the book and optional cover image.
  saveBook(): void {

    if (this.errorMessage) {
      return;
    }

    if (!this.book.title.trim() ||
        !this.book.author.trim()) {
      this.errorMessage = 'Title and author are required.';
      return;
    }

    // Prepare data for PHP.
    const formData = new FormData();

    formData.append('title', this.book.title);
    formData.append('author', this.book.author);
    formData.append('description', this.book.description);

    // Include the image if one was selected.
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Send the book to the PHP/MySQL backend.
    this.bookService.addBook(formData).subscribe({
      next: () => {
        this.router.navigate(['/list']);
      },
      error: () => {
        this.errorMessage = 'Unable to save book.';
      }
    });
  }
}
