export class CreateFarmDto {
  readonly name: string;
  readonly location?: string;
  readonly size?: number;
  readonly description?: string;
  readonly photoUrl?: string;
}
