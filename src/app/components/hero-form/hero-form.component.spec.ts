import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Superhero } from '../../models/superhero.interface';
import { signal } from '@angular/core';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroFormComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });


  it('debería emitir un superhéroe válido al enviar el formulario', () => {
    spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      name: 'Batman',
      gender: 'Male',
      race: 'Human',
      publisher: 'DC Comics',
      image: 'data:image/png;base64,...',
      intelligence: 90,
      strength: 80,
      speed: 75,
      durability: 85,
      power: 95,
      combat: 100,
    });

    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it('debería añadir un alias correctamente', () => {
    component.aliases.set([]);
    const event = {
      value: 'Dark Knight',
      chipInput: { clear: () => {} },
    } as any;

    spyOn(event.chipInput, 'clear');
    component.addAlias(event);
    expect(component.aliases()).toContain('Dark Knight');
    expect(event.chipInput.clear).toHaveBeenCalled();
  });

  it('debería eliminar un alias correctamente', () => {
    component.aliases.set(['Dark Knight', 'Caped Crusader']);
    component.removeAlias('Dark Knight');
    expect(component.aliases()).toEqual(['Caped Crusader']);
  });

  it('debería llenar el formulario al estar en modo edición', () => {
    const heroMock: Superhero = {
      id: 1,
      slug: 'wonder-woman',
      name: 'WONDER WOMAN',
      images: {
        lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg',
        md: '',
        sm: '',
        xs: '',
      },
      biography: {
        alterEgos: 'Princess Diana',
        aliases: ['Diana', 'WW'],
        placeOfBirth: 'Themyscira',
        firstAppearance: 'All Star Comics #8',
        publisher: 'DC Comics',
        alignment: 'good',
      },
      appearance: {
        gender: 'Female',
        race: 'Amazon',
        eyeColor: 'Blue',
        hairColor: 'Black',
      },
      work: {
        occupation: 'Warrior',
        base: 'Themyscira',
      },
      connections: {
        groupAffiliation: 'Justice League',
        relatives: 'Hippolyta (mother)',
      },
      powerstats: {
        intelligence: 88,
        strength: 100,
        speed: 79,
        durability: 100,
        power: 100,
        combat: 100,
      },
      createdAt: '2024-01-01T00:00:00Z',
    };

    // @ts-ignore
    component['hero'] = signal<Superhero>(heroMock);
    // @ts-ignore
    component['isEditMode'] = signal(true);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('name')?.value).toBe('WONDER WOMAN');
    expect(component.aliases()).toEqual(['Diana', 'WW']);
    expect(component.imagePreview()).toBe(heroMock.images.lg);
  });

  it('debería llamar a location.back al ejecutar goBack()', () => {
    const location = component['location'];
    spyOn(location, 'back');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('debería redimensionar imagen usando resizeImage()', (done) => {
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        drawImage: jasmine.createSpy('drawImage'),
      }),
      toDataURL: () => 'data:image/jpeg;base64,mocked',
    };

    spyOn(document, 'createElement').and.callFake((element: string) => {
      if (element === 'canvas')
        return mockCanvas as unknown as HTMLCanvasElement;
      return document.createElement(element);
    });

    const mockResult = 'data:image/png;base64,fake';
    const fileReaderMock = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onload: (e: any) => {},
      result: mockResult,
    };

    spyOn(window as any, 'FileReader').and.returnValue(fileReaderMock);

    const imageMock = {
      width: 400,
      height: 300,
      onload: () => {},
      src: '',
    };

    spyOn(window as any, 'Image').and.returnValue(imageMock);

    const fakeFile = new File(['dummy'], 'test.png', { type: 'image/png' });

    component.resizeImage(fakeFile).then((resized) => {
      expect(resized).toBe('data:image/jpeg;base64,mocked');
      done();
    });

    (fileReaderMock.onload as any)({ target: { result: mockResult } });
    imageMock.onload();
  });
  it('no debería emitir si falta un campo obligatorio', () => {
  spyOn(component.formSubmit, 'emit');

  component.form.patchValue({
    name: 'Test Hero',
    gender: 'Male',
    publisher: 'Marvel',
    image: 'data:image/png;base64,...',
    // Falta race
    intelligence: 80,
    strength: 70,
    speed: 60,
    durability: 50,
    power: 90,
    combat: 100,
  });

  component.onSubmit();
  expect(component.form.valid).toBeFalse(); // ✅ cubre condición
  expect(component.formSubmit.emit).not.toHaveBeenCalled(); // ✅ cubre branch negativo
});
it('debería procesar la imagen seleccionada y actualizar el formulario', async () => {
  const fakeFile = new File(['dummy'], 'test.png', { type: 'image/png' });
  const event = {
    target: { files: [fakeFile] },
  } as unknown as Event;

  const resizedImage = 'data:image/jpeg;base64,mocked';
  spyOn(component, 'resizeImage').and.returnValue(Promise.resolve(resizedImage));

  component.form.patchValue({
    name: 'Test Hero',
    gender: 'Male',
    publisher: 'Marvel',
    race: 'Human',
    image: '',
    intelligence: 80,
    strength: 90,
    speed: 70,
    durability: 85,
    power: 95,
    combat: 100,
  });

  await component.onImageSelected(event);

  expect(component.resizeImage).toHaveBeenCalledWith(fakeFile);
  expect(component.imagePreview()).toBe(resizedImage);
  expect(component.form.get('image')?.value).toBe(resizedImage);
  expect(component.form.get('image')?.dirty).toBeTrue();
  expect(component.form.valid).toBeTrue();
});
it('debería manejar un héroe con valores incompletos', () => {
const heroParcial: Superhero = {
  id: 999,
  slug: 'parcial',
  name: 'Parcial',
  images: { xs: '', sm: '', md: '', lg: '' },
  appearance: {
    gender: 'Other',
    race: '-',
    eyeColor: '',
    hairColor: '',
  },
  biography: {
    alterEgos: '',
    aliases: [],
    placeOfBirth: '',
    firstAppearance: '',
    publisher: 'None',
    alignment: '',
  },
  work: {
    occupation: '',
    base: '',
  },
  connections: {
    groupAffiliation: '',
    relatives: '',
  },
  powerstats: {
    intelligence: 0,
    strength: 0,
    speed: 0,
    durability: 0,
    power: 0,
    combat: 0,
  },
  createdAt: new Date().toISOString(),
};


  // @ts-ignore
  component['hero'] = signal<Superhero>(heroParcial);
  // @ts-ignore
  component['isEditMode'] = signal(true);
  component.ngOnInit();

  expect(component.form.get('name')?.value).toBe('PARCIAL');
  expect(component.form.get('intelligence')?.value).toBe(0);
});

it('no debería ejecutar lógica si no hay archivos seleccionados', async () => {
  const event = {
    target: { files: [] },
  } as unknown as Event;

  const resizeSpy = spyOn(component, 'resizeImage');
  await component.onImageSelected(event);

  expect(resizeSpy).not.toHaveBeenCalled(); // ✅ cubre esa rama
});

it('no debería continuar si canvas.getContext devuelve null', async () => {
  spyOn(document, 'createElement').and.callFake((el: string) => {
    if (el === 'canvas') {
      return {
        getContext: () => null,
      } as unknown as HTMLCanvasElement;
    }
    return document.createElement(el);
  });

  spyOn(window as any, 'Image').and.returnValue({
    width: 100,
    height: 100,
    onload: () => {},
    set src(val: string) {
      this.onload(); 
    },
  });

  const fakeFile = new File(['dummy'], 'fake.png', { type: 'image/png' });

  await expectAsync(component.resizeImage(fakeFile)).toBeResolvedTo(''); 
});

it('debería manejar valores undefined en propiedades anidadas', () => {
  const heroSinStatsNiBio = {
    id: 99,
    slug: 'partial',
    name: 'Partial Hero',
    images: undefined,
    biography: undefined,
    appearance: undefined,
    work: undefined,
    connections: undefined,
    powerstats: undefined, 
    createdAt: new Date().toISOString(),
  } as unknown as Superhero;

  // @ts-ignore
  component['hero'] = signal<Superhero>(heroSinStatsNiBio);
  // @ts-ignore
  component['isEditMode'] = signal(true);

  component.ngOnInit();

  expect(component.form.get('image')?.value).toBe('');
  expect(component.form.get('publisher')?.value).toBe('');
  expect(component.form.get('intelligence')?.value).toBe(0);
  expect(component.form.get('strength')?.value).toBe(0);
  expect(component.form.get('speed')?.value).toBe(0);
  expect(component.form.get('durability')?.value).toBe(0);
  expect(component.form.get('power')?.value).toBe(0);
  expect(component.form.get('combat')?.value).toBe(0);
});



});
