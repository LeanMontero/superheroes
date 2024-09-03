import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroService } from '../services/hero.service';
import { IHero } from '../interface/hero.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DirectiveModule } from '../../directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatInputModule, MatDialogModule, DirectiveModule],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.css'
})
export class HeroFormComponent {
  heroForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<HeroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IHero,
    private fb: FormBuilder,
    private heroService: HeroService
  ) {
    this.heroForm = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      universe: [data.universe, Validators.required]
    });
  }

  onSave(): void {
    if (this.heroForm.valid) {
      const hero = this.heroForm.value;
      if (hero.id) {
        this.heroService.updateHero(hero);
      } else {
        this.heroService.addHero(hero);
      }
      this.dialogRef.close(hero);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}