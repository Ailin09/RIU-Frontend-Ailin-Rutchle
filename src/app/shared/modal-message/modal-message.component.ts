import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-message',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: ` 
  <div class="modal-neon-container">
  <h2 class="neon-title">{{ data.title }}</h2>
  <p class="glow-text">{{ data.message }}</p>

  <div class="modal-actions">
    <button mat-button class="neon-outline" mat-dialog-close>
      Cancelar
    </button>
    <button mat-button class="neon-watch-blue" [mat-dialog-close]="true">
      Confirmar
    </button>
  </div>
</div>
`,
  styleUrl: './modal-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
