import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Superhero } from '../../models/superhero.interface';
import { MatSliderModule } from '@angular/material/slider';
import {
  ALINEATIONS_FORM,
  GENDERS_FORM,
  PUBLISHERS_FORM,
  RACES_FORM,
} from '../../utils/hero';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { HeroService } from '../../services/hero.service';
import { Location } from '@angular/common';
import { UppercaseDirective } from '../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    MatAutocompleteModule,
    MatGridListModule,
    UppercaseDirective,
  ],
  styleUrls: ['./hero-form.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="hero-form">
      <mat-card class="hero-card-container">
        <mat-card-title>{{
          isEditMode() ? 'Editar Héroe' : 'Crear Nuevo Héroe'
        }}</mat-card-title>
        <mat-card-content [formGroup]="form">
          <div class="form-header-grid">
            <div class="hero-image-preview-block" (click)="fileInput.click()">
              <input
                type="file"
                accept="image/*"
                hidden
                #fileInput
                (change)="onImageSelected($event)"
              />
              <div class="image-clickable">
                @if (imagePreview()) {
                <img [src]="imagePreview()" alt="Hero Image" />
                } @else {
                <span class="image-placeholder">Subir imagen del héroe</span>
                }
              </div>
              @if (form.get('image')?.invalid && form.get('image')?.touched) {
              <mat-error class="error-text">La imagen es obligatoria</mat-error>
              }
            </div>

            <div class="hero-fields-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombre </mat-label>
                <input matInput formControlName="name" appUppercase />
                <mat-error
                  *ngIf="form.get('name')?.invalid && form.get('name')?.touched"
                  >El nombre completo es obligatorio</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Género</mat-label>
                <mat-select formControlName="gender">
                  @for (option of genders; track option.value) {
                  <mat-option [value]="option.value">{{
                    option.label
                  }}</mat-option>
                  }
                </mat-select>
                <mat-error
                  *ngIf="
                    form.get('gender')?.invalid && form.get('gender')?.touched
                  "
                  >El género es obligatorio</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Primera aparición</mat-label>
                <input matInput formControlName="firstAppearance" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Raza</mat-label>
                <mat-select formControlName="race">
                  @for (option of races; track option.label) {
                  <mat-option [value]="option.value">{{
                    option.label
                  }}</mat-option>
                  }
                </mat-select>
                <mat-error
                  *ngIf="form.get('race')?.invalid && form.get('race')?.touched"
                  >La raza es obligatoria</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Editorial</mat-label>
                <mat-select formControlName="publisher">
                  @for (option of publishers; track option.value) {
                  <mat-option [value]="option.value">{{
                    option.label
                  }}</mat-option>
                  }
                </mat-select>
                <mat-error
                  *ngIf="
                    form.get('publisher')?.invalid &&
                    form.get('publisher')?.touched
                  "
                  >La editorial es obligatoria</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Alter egos</mat-label>
                <input matInput formControlName="alterEgos" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Color de ojos</mat-label>
                <input matInput formControlName="eyeColor" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Color de cabello</mat-label>
                <input matInput formControlName="hairColor" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Lugar de nacimiento</mat-label>
                <input matInput formControlName="placeOfBirth" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Alineación</mat-label>
                <mat-select formControlName="alignment">
                  @for (option of alineations; track option.value) {
                  <mat-option [value]="option.value">
                    {{ option.label }}
                  </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ocupación</mat-label>
                <input matInput formControlName="occupation" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Base</mat-label>
                <input matInput formControlName="base" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Afiliaciones</mat-label>
                <input matInput formControlName="groupAffiliation" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Parientes</mat-label>
                <input matInput formControlName="relatives" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Alias </mat-label>
                <mat-chip-grid #chipGrid aria-label="Alias selection">
                  @for (alias of aliases(); track alias) {
                  <mat-chip-row (removed)="removeAlias(alias)">
                    {{ alias }}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                  }
                  <input
                    [matChipInputFor]="chipGrid"
                    [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                    [matChipInputAddOnBlur]="true"
                    (matChipInputTokenEnd)="addAlias($event)"
                    placeholder="Ingresá un alias"
                  />
                </mat-chip-grid>
              </mat-form-field>

              <div class="form-section-title">Estadísticas de poder</div>

              <mat-form-field appearance="outline">
                <mat-label>Inteligencia</mat-label>
                <input matInput type="number" formControlName="intelligence" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fuerza</mat-label>
                <input matInput type="number" formControlName="strength" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Velocidad</mat-label>
                <input matInput type="number" formControlName="speed" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Durabilidad</mat-label>
                <input matInput type="number" formControlName="durability" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Poder</mat-label>
                <input matInput type="number" formControlName="power" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Combate</mat-label>
                <input matInput type="number" formControlName="combat" />
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button class="neon-watch-blue" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
          <button class="neon-watch-blue" (click)="onSubmit()">
            <mat-icon class="icon">upload</mat-icon>
            {{ isEditMode() ? 'Guardar cambios' : 'Crear héroe' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </main>
  `,
})
export class HeroFormComponent implements OnInit {
  hero = input<Superhero | null>();
  isEditMode = input<boolean>();
  formSubmit = output<Superhero>();
  form: FormGroup;
  aliases = signal<string[]>([]);
  separatorKeysCodes = [13, 188];
  imagePreview = signal<string | null>(null);
  publishers = PUBLISHERS_FORM;
  alineations = ALINEATIONS_FORM;
  genders = GENDERS_FORM;
  races = RACES_FORM;
  private fb = inject(FormBuilder);
  heroService = inject(HeroService);
  private location = inject(Location);
  heroId = signal<number | null>(null);
  createdAt = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      firstAppearance: [''],
      publisher: ['', Validators.required],
      alterEgos: [''],
      gender: ['', Validators.required],
      race: ['', Validators.required],
      eyeColor: [''],
      hairColor: [''],
      placeOfBirth: [''],
      alignment: [''],
      occupation: [''],
      base: [''],
      intelligence: ['', [Validators.min(0), Validators.max(100)]],
      strength: ['', [Validators.min(0), Validators.max(100)]],
      speed: ['', [Validators.min(0), Validators.max(100)]],
      durability: ['', [Validators.min(0), Validators.max(100)]],
      power: ['', [Validators.min(0), Validators.max(100)]],
      combat: ['', [Validators.min(0), Validators.max(100)]],
      groupAffiliation: [''],
      relatives: [''],
    });
  }

  ngOnInit(): void {
    this.loadHeroIfEditMode();
  }
  private loadHeroIfEditMode(): void {
    const h = this.hero();
    if (!h) return;
    this.heroId.set(h.id);
    this.form.markAsPristine();
    this.form.patchValue({
      image: h.images?.lg ?? '',
      name: h.name ?? '',
      firstAppearance: h.biography?.firstAppearance ?? '',
      publisher: h.biography?.publisher ?? '',
      alterEgos: h.biography?.alterEgos ?? '',
      gender: h.appearance?.gender ?? '',
      race: h.appearance?.race ?? '-',
      eyeColor: h.appearance?.eyeColor ?? '',
      hairColor: h.appearance?.hairColor ?? '',
      placeOfBirth: h.biography?.placeOfBirth ?? '',
      alignment: h.biography?.alignment ?? '',
      occupation: h.work?.occupation ?? '',
      base: h.work?.base ?? '',
      intelligence: h.powerstats?.intelligence ?? 0,
      strength: h.powerstats?.strength ?? 0,
      speed: h.powerstats?.speed ?? 0,
      durability: h.powerstats?.durability ?? 0,
      power: h.powerstats?.power ?? 0,
      combat: h.powerstats?.combat ?? 0,
      groupAffiliation: h.connections?.groupAffiliation ?? '',
      relatives: h.connections?.relatives ?? '',
    });
    const name = this.form.get('name')?.value;
    this.form.get('name')?.setValue(name?.toUpperCase());
    this.aliases.set(h.biography?.aliases ?? []);
    this.imagePreview.set(h.images?.lg ?? '');
    this.createdAt.set(h.createdAt ?? new Date().toISOString());
  }

  addAlias(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.aliases.update((current) => [...current, value]);
    }
    event.chipInput!.clear();
  }

  removeAlias(alias: string): void {
    this.aliases.update((current) => current.filter((a) => a !== alias));
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    this.resizeImage(file).then((resized) => {
      this.imagePreview.set(resized);
      this.form.patchValue({ image: resized });
    });
  }

  resizeImage(file: File, maxWidth = 300, maxHeight = 300): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(resizedBase64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.warn('Formulario inválido', this.form.errors, this.form.value);
      return;
    }

    const heroForm = this.form.value;

    const hero: Superhero = {
      ...heroForm,
      id: this.isEditMode() ? this.heroId! : 0,
      createdAt: this.isEditMode() ? this.createdAt()! : '',
      name: heroForm.name,
      powerstats: {
        intelligence: +heroForm.intelligence,
        strength: +heroForm.strength,
        speed: +heroForm.speed,
        durability: +heroForm.durability,
        power: +heroForm.power,
        combat: +heroForm.combat,
      },
      appearance: {
        gender: heroForm.gender,
        race: heroForm.race,
        eyeColor: heroForm.eyeColor,
        hairColor: heroForm.hairColor,
      },
      biography: {
        alterEgos: heroForm.alterEgos,
        aliases: this.aliases(),
        placeOfBirth: heroForm.placeOfBirth,
        firstAppearance: heroForm.firstAppearance,
        publisher: heroForm.publisher,
        alignment: heroForm.alignment,
      },
      work: {
        occupation: heroForm.occupation,
        base: heroForm.base,
      },
      connections: {
        groupAffiliation: heroForm.groupAffiliation,
        relatives: heroForm.relatives,
      },
      images: {
        xs: heroForm.image,
        sm: heroForm.image,
        md: heroForm.image,
        lg: heroForm.image,
      },
    };

    this.formSubmit.emit(hero);
  }

  goBack(): void {
    this.location.back();
  }
}
