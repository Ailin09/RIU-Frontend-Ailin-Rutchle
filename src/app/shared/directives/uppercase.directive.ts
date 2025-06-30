import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective { 
ngControl = inject(NgControl);

  @HostListener('input', ['$event.target.value'])
   onInput(value: string): void {
    const capitalized = value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    this.ngControl.control?.setValue(capitalized, { emitEvent: false });
  }
}
