import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        'Użytkownik o takim adresie email już istnieje',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const code = randomInt(100000, 999999).toString();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      playerTag: dto.playerTag,
      verificationCode: code,
      verificationExpires: expiry,
      isVerified: false,
    });

    await this.mailService.sendVerificationCode(user.email, code);

    return {
      message: 'Zarejestrowano pomyślnie. Sprawdź email w celu weryfikacji.',
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.verificationCode !== code) {
      throw new BadRequestException('Niepoprawny kod weryfikacyjny');
    }

    if (new Date() > user.verificationExpires) {
      throw new BadRequestException('Kod weryfikacyjny wygasł');
    }

    const updatedUser = await this.usersService.update(user.id, {
      isVerified: true,
      verificationCode: null,
      verificationExpires: null,
    });

    await this.mailService.sendWelcomeMessage(email);

    return { message: 'Konto zostało pomyślnie zweryfikowane.' };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Niepoprawne dane logowania');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Niepoprawne dane logowania');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Konto nie jest zweryfikowane');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Użytkownik nie istnieje');

    const resetCode = randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 3600000);

    await this.usersService.update(user.id, {
      resetToken: resetCode,
      resetTokenExpires: expires,
    });

    await this.mailService.sendResetPasswordCode(email, resetCode);
    return { message: 'Kod do resetu hasła został wysłany na email.' };
  }

  async resetPassword(email: string, code: string, newPass: string) {
    const user = await this.usersService.findByEmail(email);

    if (
      !user ||
      user.resetToken !== code ||
      user.resetTokenExpires < new Date()
    ) {
      throw new BadRequestException('Kod jest nieprawidłowy lub wygasł.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    await this.mailService.sendPasswordChangedNotification(email);
    return { message: 'Hasło zostało pomyślnie zmienione.' };
  }
}
