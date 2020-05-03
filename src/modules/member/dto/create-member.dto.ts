import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { USERNAME_MAX, USERNAME_MIN } from 'modules/member/member.constants';

export class CreateMemberDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Transform(value => {
    if (isNaN(+value))
      throw new BadRequestException(`Member username ${value} is not valid`);
    return +value;
  })
  @IsNumber()
  @Min(USERNAME_MIN)
  @Max(USERNAME_MAX)
  username: number;
}
