import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { Superhero } from '../../models/superhero.interface';
import { HeroService } from '../../services/hero.service';
import { UppercaseDirective } from '../../shared/directives/uppercase.directive';
import {
  ALINEATIONS_FORM,
  GENDERS_FORM,
  PUBLISHERS_FORM,
  RACES_FORM,
} from '../../utils/hero';

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
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  heroId = signal<number>(0);
  createdAt = signal<string | null>(null);
  originalValue!: Superhero;

  constructor() {
    this.form = this.fb.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      firstAppearance: [''],
      slug: [''],
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
      intelligence: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      strength: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      speed: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      durability: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      power: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      combat: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      groupAffiliation: [''],
      relatives: [''],
    });
    this.form.markAllAsTouched();
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
      slug: h.slug ?? '',
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
    queueMicrotask(() => {
      this.originalValue = this.form.getRawValue();
    });
    const name = this.form.get('name')?.value;
    this.form.get('name')?.setValue(name?.toUpperCase());
    this.aliases.set(h.biography?.aliases ?? []);
    this.imagePreview.set(h.images?.lg);
    this.createdAt.set(h.createdAt ?? new Date().toISOString());
    this.form.get('image')?.markAsDirty();
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
  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const resized = await this.resizeImage(file);

    this.imagePreview.set(resized);
    this.form.patchValue({ image: resized });
    this.form.get('image')?.markAsDirty();
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
          if (!ctx) return resolve('');
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
      this.form.markAllAsTouched();

      const firstInvalid = document.querySelector('.ng-invalid') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    const heroForm = this.form.value;

    const hero: Superhero = {
      ...heroForm,
      id: this.isEditMode() ? this.heroId! : 0,
      createdAt: this.isEditMode() ? this.createdAt()! : '',
      name: heroForm.name,
      slug: heroForm.slug,
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
  hasInvalidPowerStats(): boolean {
    return [
      'intelligence',
      'strength',
      'speed',
      'durability',
      'power',
      'combat',
    ].some((field) => {
      const control = this.form.get(field);
      return control && control.invalid && control.touched;
    });
  }
  enforceMax(event: Event, maxValue: number): void {
    const input = event.target as HTMLInputElement;
    if (+input.value > maxValue) {
      input.value = maxValue.toString();
      const controlName = input.getAttribute('formcontrolname');
      if (controlName) {
        this.form.get(controlName)?.setValue(maxValue);
      }
    }
  }
  hasFormChanged(): boolean {
    return (
      JSON.stringify(this.form.getRawValue()) !==
      JSON.stringify(this.originalValue)
    );
  }
}
