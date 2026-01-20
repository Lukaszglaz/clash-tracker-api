import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'gracz@wp.pl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6-cyfrowy kod z maila' })
  @IsString()
  @Length(6, 6)
  code: string;
}
