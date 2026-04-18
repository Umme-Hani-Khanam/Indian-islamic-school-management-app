export interface User {
  id: string;
  role: 'HEADMASTER' | 'TEACHER' | 'PARENT';
  name: string;
  username: string;
  password?: string;
}
