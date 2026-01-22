import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adres email użytkownika',
  })
  @IsEmail({}, { message: 'Niepoprawny format email' })
  email: string;

  @ApiProperty({ example: 'userpassword', description: 'Hasło użytkownika' })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
  password: string;
}
