import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { USERNAME_MAX, USERNAME_MIN } from 'modules/member/member.constants';

export class CreateMemberDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(USERNAME_MIN)
  @Max(USERNAME_MAX)
  username: number;
}
