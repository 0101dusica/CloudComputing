import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concat, Observable, of, switchMap, toArray} from 'rxjs';
import { env } from '../../../env/env';
import {Episode, Movie} from './movie';
import {SubscribeDialogComponent} from "./subscribe-dialog/subscribe-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = env.apiGatewayHost; // Prilagodite vašoj konfiguraciji

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movies`);
  }

  getSubscriptions(user_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}all-subscriptions?user_id=${user_id}`);
  }

  getMovieRate(user_id: string, movie_id: string): Observable<any> {
    const body = { user_id: user_id, movie_id: movie_id};
    return this.http.post(`${this.apiUrl}get-movie-rate`, body, {
      headers: this.headers
    });
  }

  getMovieById(movieId: string, createdAt: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/${movieId}?createdAt=${createdAt}`);
  }

  getDownloadUrl(movieId: string, user_id: string, genres: string[]) {
    const body = { user_id: user_id, genres: genres};
    return this.http.post<any>(`${this.apiUrl}/download/${movieId}`, body);
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

 updateMovie(movieId: string, movie: Movie | Episode, movieContent: string,generatePresignedUrl: boolean ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/movies/${movieId}?generatePresignedUrl=${generatePresignedUrl}`, movie).pipe(
      switchMap(response => {
        const presignedUrl = response.presignedUrl;
        const movieId = response.id;
        if (presignedUrl != '') {
        console.log(movieContent)
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

  addRating(userId: string, movieId: string, rate: number): Observable<any> {
    const body = { user_id: userId, movie_id: movieId, rate: rate };
    return this.http.post(`${this.apiUrl}rate-movie`, body, {
      headers: this.headers
    });
  }

  subscribe(user_id: string, genres: [], actors: [], director: string): Observable<any> {
    const body = { user_id: user_id, genres: genres, actors: actors, director: director };
    return this.http.post(`${this.apiUrl}subscribe`, body, {
      headers: this.headers
    });
  }

  unsubscribe(user_id: string, subscription_name: string): Observable<any> {
    const body = { user_id: user_id, subscription_name: subscription_name};
    return this.http.post(`${this.apiUrl}unsubscribe`, body, {
      headers: this.headers
    });
  }

  generateUserFeed(user_id: string): Observable<any> {
    const body = { user_id: user_id};
    return this.http.post(`${this.apiUrl}generate-user-feed`, body, {
      headers: this.headers
    });
  }

  getEpisodesBySeriesId(seriesId: string): Observable<any[]> {


    return this.http.get<any[]>(`${this.apiUrl}/episodes/${seriesId}`);
  }
  private base64ToArrayBuffer(base64: string): Uint8Array {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }

  getMoviesFromObservables(observables: Observable<any>[]): Observable<any[]> {
  return concat(...observables).pipe(
    toArray()  // Collect all results into an array
  );
}
  transcodeVideo(movieId: string): Observable<any> {
    return this.http.post<any>(`${env.apiGatewayHost}transcode`, {movie_id: movieId});
  }

}
