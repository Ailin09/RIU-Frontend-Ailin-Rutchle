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
