declare module 'bcryptjs' {
  export function hashSync(password: string, salt: number): string;
  export function compareSync(password: string, hash: string): boolean;
  export function hash(password: string, salt: number): Promise<string>;
  export function compare(password: string, hash: string): Promise<boolean>;
}