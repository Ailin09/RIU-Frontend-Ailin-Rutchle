import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalMessageComponent } from './modal-message.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ModalMessageComponent', () => {
  let component: ModalMessageComponent;
  let fixture: ComponentFixture<ModalMessageComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalMessageComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule, NoopAnimationsModule, ModalMessageComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Título de prueba', message: 'Mensaje de prueba' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título y mensaje', () => {
    const titulo = fixture.debugElement.query(By.css('h2')).nativeElement;
    const mensaje = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titulo.textContent).toContain('Título de prueba');
    expect(mensaje.textContent).toContain('Mensaje de prueba');
  });
});
