export interface Race {
    id: number;
    name: string;
    icon: string;
    created_at: string;
    updated_at: string;
    ability: Ability;
  }
  
  export interface Ability {
    id: number;
    name: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Hero {
    id: number;
    name: string;
    icon: string;
    move: number;
    damage: number;
    health: number;
    cost: number;
    attack_type: string;
    raceId: number;
    created_at: string;
    updated_at: string;
    ability: Ability[];
  }
  
  export interface Map {
    id: number;
    name: string;
    image: string;
    team_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Card {
    id: number;
    name: string;
    description: string;
    icon: string;
    times_in_deck: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Building {
    id: number;
    name: string;
    icon: string;
    description: string;
    priceGold: number;
    priceWood: number;
    unit: Unit[];
    created_at: string;
    updated_at: string;
  }
  
  export interface Item {
    id: number;
    name: string;
    description: string;
    icon: string;
    price_gold: number;
    price_wood: number;
    type: string;
    obtainability: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Creep {
    id: number;
    name: string;
    icon: string;
    level: number;
    health: number;
    damage: number;
    attack_type: string;
    unit_type: string;
    created_at: string;
    updated_at: string;
    item: Item[];
  }
  
  export interface Unit {
    id: number;
    name: string;
    icon: string;
    priceGold: number;
    priceWood: number;
    health: number;
    damage: number;
    tech: number;
    range: number;
    movement: number;
    attack_type: string;
    special_unit: boolean;
    unit_type: string;
    buildingId: any;
    created_at: string;
    updated_at: string;
    raceId: number;
    ability: Ability[];
    building: Building[];
  }
  
  export interface Upgrade {
    id: number;
    name: string;
    price_gold: number;
    price_wood: number;
    icon: string;
    description: string;
    tech: number;
    created_at: string;
    updated_at: string;
    raceId: number;
    ability: any[];
  }