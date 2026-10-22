export interface Credentials {
  user_id: string;
  user_type: string;
}

export interface UserValues {
  credentials: Credentials;
}

export interface FormData {
  clientCode: string;
  accNo: string;
  chequeNo: string;
}

export interface MenuItems {
  mc: number;
  mn: string;
  menu_path: string | null;
  pmc: number;
  mo: number;
  isParent: boolean;
  subItems?: MenuItems[]; // SubItems for child menus
}

//Use Below Interface after all API flag change
// export interface MenuItems {
//   mc: number;
//   mn: string;
//   menu_path: string | null;
//   parent_menu_code: number;
//   mo: number;
//   isParent: boolean;
//   subItems?: MenuItems[]; // SubItems for child menus
// }
