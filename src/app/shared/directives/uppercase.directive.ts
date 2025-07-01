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
    const uppercased = value.toUpperCase();
    this.ngControl.control?.setValue(uppercased, { emitEvent: false });
  }
}
