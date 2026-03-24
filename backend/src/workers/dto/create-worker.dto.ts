export class CreateWorkerDto {
  readonly farmId: string;
  readonly name: string;
  readonly role: string;
  readonly phone?: string;
  readonly email?: string;
  readonly avatarUrl?: string;
}
