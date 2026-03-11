import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PokeService } from './poke.service';

interface Pokemon {
  name: string;
  id: number;
  image: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('app3');
  protected readonly pokemons = signal<Pokemon[]>([]);
  protected readonly loading = signal(true);

  constructor(private poke: PokeService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.poke.getPokemons(20).subscribe({
      next: (data) => {
        this.pokemons.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
