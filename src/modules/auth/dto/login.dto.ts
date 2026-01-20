import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'gracz@wp.pl',
    description: 'Adres email użytkownika',
  })
  @IsEmail({}, { message: 'Niepoprawny format email' })
  email: string;

  @ApiProperty({ example: 'Haslo123!', description: 'Hasło użytkownika' })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  password: string;
}
