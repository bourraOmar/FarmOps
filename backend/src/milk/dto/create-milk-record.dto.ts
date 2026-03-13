export class CreateMilkRecordDto {
  readonly animalId: string;
  readonly date: string; // MM/DD/YYYY
  readonly amountLiters: number;
  readonly session: 'Morning' | 'Evening' | 'Night';
  readonly notes?: string;
}
