import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Jan' })
  @IsString()
  @IsNotEmpty({ message: 'Imię jest wymagane' })
  firstName: string;

  @ApiProperty({ example: 'Kowalski' })
  @IsString()
  @IsNotEmpty({ message: 'Nazwisko jest wymagane' })
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Niepoprawny format email' })
  email: string;

  @ApiProperty({ example: 'User123!' })
  @IsString()
  @MinLength(8, { message: 'Hasło musi mieć minimum 8 znaków' })
  @Matches(/[a-z]/, { message: 'Hasło musi zawierać małą literę' })
  @Matches(/[A-Z]/, { message: 'Hasło musi zawierać wielką literę' })
  @Matches(/[0-9]/, { message: 'Hasło musi zawierać cyfrę' })
  @Matches(/[!@#$%^&*]/, { message: 'Hasło musi zawierać znak specjalny' })
  password: string;

  @ApiProperty({ example: '#2QUY09CJ' })
  @IsString()
  @Matches(/^#[A-Z0-9]{3,10}$/, {
    message: 'Niepoprawny format tagu gracza (np. #P8L2V)',
  })
  playerTag: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  termsAccepted: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  marketingConsent: boolean;
}
