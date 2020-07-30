export interface IMenu {
  name: string;
  path: string;
  check?: boolean;
}

export const Menu: IMenu[] = [
  { name: "index", path: "/index", check: true },
  { name: "user", path: "/user", check: false }
];
