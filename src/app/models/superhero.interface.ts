export interface Superhero {
  id: number;
  name: string;
  slug: string;
  powerstats: Powerstats;
  appearance: Appearance;
  biography: Biography;
  work: Work;
  connections: Connections;
  images: ImageSet;
  createdAt: string
}

export interface Powerstats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface Appearance {
  gender: string;
  race: string;
  eyeColor: string;
  hairColor: string;
}

export interface Biography {
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  groupAffiliation: string;
  relatives: string;
}

export interface ImageSet {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}
export interface Filters {
  gender: string;
  race: string;
  order: 'az' | 'za' | 'recent';
  publisher: 'all' | 'marvel' | 'dc' | 'bad';
  name: string;
}
