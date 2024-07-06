import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { env } from '../../../env/env';
import {Episode, Movie} from './movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = env.apiGatewayHost; // Prilagodite vašoj konfiguraciji

  constructor(private http: HttpClient) { }

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movies`);
  }

  getMovieById(movieId: string, createdAt: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/${movieId}?createdAt=${createdAt}`);
  }

  getDownloadUrl(movieId: string) {
    return this.http.get<any>(`${this.apiUrl}/download/${movieId}`);
  }

  getWatchUrl(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/view/${movieId}`);
  }

  uploadMovie(movie: Movie | Episode, movieContent: string) {
    return this.http.post<any>(`${env.apiGatewayHost}upload`, movie).pipe(
      switchMap(response => {
        const presignedUrl = response.presignedUrl;
        const movieId = response.id;
        if (presignedUrl != '') {
          const byteArray = this.base64ToArrayBuffer(movieContent);
          const blob = new Blob([byteArray], { type: 'video/mp4' });

          // Upload the file to S3 using the presigned URL
          return this.http.put(presignedUrl, blob, {
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          }).pipe(
            switchMap(() => {
              return of({ message: 'File uploaded successfully', movieId: movieId });
            })
          );
        } else {
          return of({ message: 'No presigned url, added to db only' });
        }
      })
    );
  }

  deleteMovie(movieId: string, createdAt: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/movies/${movieId}?createdAt=${createdAt}`);
  }

  searchMovies(queryParams: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/search`, queryParams);
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }
}
