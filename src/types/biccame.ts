export interface Biccame {
  name: string;
  storeName: string;
  /* DO NOT CHANGE/REMOVE/EDIT THIS PROP */
  url: string;
  pos: Pos;
  // 卒業;;
  visitable: boolean;
  region: Region;
}

export interface BiccameState {
  biccame: Biccame;
  /* DO NOT CHANGE/REMOVE/EDIT THIS PROP */
  visited: boolean;
}

export interface Pos {
  lat: number;
  lng: number;
}

/* 地域で一括ON/OFFするためのフラグ  */
export const REGION = {
  misc: 0,
  // 関東圏
  tokyo: 1,
  // 大阪4姉妹
  osaka: 2,
} as const;

export type Region = (typeof REGION)[keyof typeof REGION];
