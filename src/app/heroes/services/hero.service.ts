import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IHero } from '../interface/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroes: IHero[] = [];
  private heroesSubject = new BehaviorSubject<IHero[]>(this.heroes);

  constructor() { }

  getHeroes(): Observable<IHero[]> {
    return this.heroesSubject.asObservable();
  }

  addHero(hero: IHero): void {
    hero.id = this.heroes.length > 0 ? Math.max(...this.heroes.map(h => h.id)) + 1 : 1;
    this.heroes.push(hero);
    this.heroesSubject.next(this.heroes);
  }

  updateHero(hero: IHero): void {
    const index = this.heroes.findIndex(h => h.id === hero.id);
    if (index !== -1) {
      this.heroes[index] = hero;
      this.heroesSubject.next(this.heroes);
    }
  }

  deleteHero(id: number): void {
    this.heroes = this.heroes.filter(hero => hero.id !== id);
    this.heroesSubject.next(this.heroes);
  }

  searchHeroes(term: string): IHero[] {
    return this.heroes.filter(hero => hero.name.toLowerCase().includes(term.toLowerCase()));
  }
  
}