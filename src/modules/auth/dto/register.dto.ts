import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Niepoprawny format email' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć minimum 8 znaków' })
  password: string;

  @ApiProperty({ example: '#2QUY09CJ' })
  @IsString()
  @Matches(/^#/, { message: 'Tag gracza musi zaczynać się od znaku #' })
  playerTag: string;
}
