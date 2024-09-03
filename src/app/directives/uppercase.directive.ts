import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})

export class UppercaseDirective {
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}

@NgModule({
  declarations: [UppercaseDirective],
  exports: [UppercaseDirective],
  imports: [CommonModule],
})
export class DirectiveModule {}
