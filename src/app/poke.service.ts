import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

export interface Pokemon {
  name: string;
  id: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class PokeService {
  private base = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemons(limit = 20): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.base}/pokemon?limit=${limit}`).pipe(
      map(res => res.results || []),
      switchMap((results: Array<any>) => {
        const details$ = results.map(r => this.http.get<any>(r.url));
        return forkJoin(details$);
      }),
      map((details: any[]) =>
        details.map(d => ({
          name: d.name,
          id: d.id,
          image: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default || ''
        }))
      )
    );
  }
}
