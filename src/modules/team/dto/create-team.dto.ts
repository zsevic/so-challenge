import { IsNotEmpty } from 'class-validator';
import { CreateMemberDto } from 'modules/member/dto';

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  members: CreateMemberDto[];
}
