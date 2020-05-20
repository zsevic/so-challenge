import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { CreateParticipantDto } from 'modules/participant/dto';
import {
  MEMBERS_MAX_LENGTH,
  MEMBERS_MIN_LENGTH,
} from 'modules/team/team.constants';

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(MEMBERS_MIN_LENGTH)
  @ArrayMaxSize(MEMBERS_MAX_LENGTH)
  @Type(() => CreateParticipantDto)
  members: CreateParticipantDto[];
}
