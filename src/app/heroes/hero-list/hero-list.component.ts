import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { IHero } from '../interface/hero.interface';
import { HeroService } from '../services/hero.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [MatIcon, MatButtonModule, RouterLink, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {
  dataSource = new MatTableDataSource<IHero>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'name', 'universe', 'actions'];
  searchTerm: string = '';

  constructor(private heroService: HeroService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.dataSource.data = heroes; 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  search(): void {
    if (this.searchTerm) {
      const filteredHeroes = this.heroService.searchHeroes(this.searchTerm);
      this.dataSource.data = filteredHeroes;
    } else {
      this.heroService.getHeroes().subscribe(heroes => {
        this.dataSource.data = heroes;
      });
    }
  }

  openDialog(hero: IHero | null): void {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '500px',
      data: hero ? hero : { id: null, name: '', universe: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.dataSource.data = heroes;
    });
  }

  addHero(): void {
    this.openDialog(null);
  }

  editHero(hero: IHero): void {
    this.openDialog(hero);
  }

  deleteHero(id: number): void {
    if (confirm('Está seguro que desea eliminar este héroe?')) {
      this.heroService.deleteHero(id);
      this.dataSource.data = this.dataSource.data.filter(hero => hero.id !== id);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
