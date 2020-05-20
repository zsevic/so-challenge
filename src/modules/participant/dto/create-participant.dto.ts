import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { STACKOVERFLOW_ID_MAX, STACKOVERFLOW_ID_MIN } from 'modules/participant/participant.constants';

export class CreateParticipantDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Transform(value => {
    if (isNaN(+value))
      throw new BadRequestException(`Participant Stackoverflow ID ${value} is not valid`);
    return +value;
  })
  @IsNumber()
  @Min(STACKOVERFLOW_ID_MIN)
  @Max(STACKOVERFLOW_ID_MAX)
  stackoverflow_id: number;
}
