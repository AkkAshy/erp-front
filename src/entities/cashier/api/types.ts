export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  password: string;
  is_active: boolean;
  is_active_in_store: boolean;
  employee_info: {
    role: string;
    phone: string;
    photo: string | null;
    sex: string;
  };
};

export type Employees = {
  employees: User[];
};

export type UserInfo = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  groups: string[];
  employee: {
    role: string;
    phone: string;
    photo: string | null;
    sex: string | null;
    plain_password: string;
    accessible_stores_info: {
      id: string;
      name: string;
    }[];
  };
};

export type Gender = "Erkak" | "Ayol" | null;
