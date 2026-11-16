
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the book information.
export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);

  // PHP API address.
  private apiUrl = 'http://localhost/AngularApp3API/books.php';

  // Retrieve all books.
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Add a new book.
  addBook(book: Omit<Book, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, book);
  }

  // Update an existing book.
  updateBook(id: number, book: Omit<Book, 'id'>): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${id}`, book);
  }

  // Delete a book.
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}
