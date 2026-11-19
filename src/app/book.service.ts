
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the book information.
export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  image?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  // Inject Angular HttpClient.
  private http = inject(HttpClient);

  // PHP backend API address.
  private apiUrl =
    'http://localhost/AngularApp3API/books.php';

  // READ - Retrieve all books from MySQL.
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // CREATE - Add a book with an optional image.
  addBook(
    book: Omit<Book, 'id'> | FormData
  ): Observable<any> {
    return this.http.post(this.apiUrl, book);
  }

  // UPDATE - Edit an existing book.
  updateBook(
    id: number,
    book: Omit<Book, 'id'>
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}?id=${id}`,
      book
    );
  }

  // DELETE - Remove a book from MySQL.
  deleteBook(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}?id=${id}`
    );
  }
}
