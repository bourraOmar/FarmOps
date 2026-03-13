export class CreateAnimalDto {
  readonly name: string;
  readonly tagId?: string;
  readonly breed?: string;
  readonly gender?: 'Male' | 'Female';
  readonly dob?: string; // MM/DD/YYYY
  readonly weight?: number;
  readonly photoUrl?: string;
}
