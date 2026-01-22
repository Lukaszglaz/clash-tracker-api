import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  private readonly brandColor = '#BC47FB';
  private readonly bgColor = '#0F0F12';
  private readonly cardColor = '#16161D';

  private getHtmlWrapper(content: string) {
    return `
      <div style="background-color: ${this.bgColor}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: ${this.cardColor}; border-radius: 24px; border: 1px solid #2D2D35; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          <div style="padding: 30px; background: linear-gradient(135deg, #BC47FB 0%, #7B2FF7 100%);">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; font-style: italic; text-transform: uppercase;">
              CLASH<span style="color: #FFFFFF; opacity: 0.8;">TRK</span>
            </h1>
          </div>
          
          <div style="padding: 40px 30px;">
            ${content}
          </div>

          <div style="padding: 20px; border-top: 1px solid #2D2D35; background-color: rgba(255,255,255,0.02);">
            <p style="margin: 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Wersja Beta 1.0 • System Automatyczny</p>
          </div>
        </div>
      </div>
    `;
  }

  async sendVerificationCode(email: string, code: string) {
    const html = this.getHtmlWrapper(`
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Witaj Wojowniku!</h2>
      <p style="color: #A0A0AB; font-size: 14px; line-height: 1.6;">Twoje statystyki czekają. Użyj poniższego kodu, aby zweryfikować swój profil i uzyskać dostęp do panelu:</p>
      <div style="background: rgba(188, 71, 251, 0.1); border: 1px dashed ${this.brandColor}; border-radius: 12px; padding: 20px; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: ${this.brandColor};">${code}</span>
      </div>
      <p style="font-size: 12px; color: #666;">Kod wygaśnie za 24 godziny.</p>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Kod weryfikacyjny - CLASHTRK',
      html,
    });
  }

  async sendWelcomeMessage(email: string) {
    const html = this.getHtmlWrapper(`
      <div style="color: #BC47FB; font-size: 40px; margin-bottom: 20px;">✓</div>
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase;">Witaj w Armii!</h2>
      <p style="color: #A0A0AB; font-size: 14px; line-height: 1.6;">Twoje konto zostało zweryfikowane, a Twój Player Tag został pomyślnie powiązany z profilem.</p>
      <div style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid #2D2D35;">
        <p style="margin: 0; color: #FFFFFF; font-size: 13px;">Twoje statystyki są już pobierane i przetwarzane.</p>
      </div>
      <a href="http://localhost:3000" style="display: inline-block; margin-top: 10px; padding: 12px 30px; background-color: ${this.brandColor}; color: #FFFFFF; text-decoration: none; border-radius: 99px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Otwórz Panel Gracza</a>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Konto aktywne - Twoja wioska gotowa! 🛡️',
      html,
    });
  }

  async sendResetPasswordCode(email: string, code: string) {
    const html = this.getHtmlWrapper(`
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase;">Resetowanie hasła</h2>
      <p style="color: #A0A0AB; font-size: 14px; line-height: 1.6;">Otrzymaliśmy prośbę o zmianę hasła. Jeśli to Ty, użyj poniższego kodu:</p>
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin: 30px 0; border: 1px solid #2D2D35;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #FFFFFF;">${code}</span>
      </div>
      <p style="font-size: 11px; color: #E24A4A; text-transform: uppercase;">Jeśli to nie Ty, zignoruj tę wiadomość.</p>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset hasła - CLASHTRK',
      html,
    });
  }

  async sendPasswordChangedNotification(email: string) {
    const html = this.getHtmlWrapper(`
      <h2 style="margin-top: 0; font-size: 20px; font-weight: 800; text-transform: uppercase;">Hasło zmienione</h2>
      <p style="color: #A0A0AB; font-size: 14px; line-height: 1.6;">Informujemy, że Twoje hasło zostało pomyślnie zaktualizowane. Możesz się teraz zalogować nowymi danymi.</p>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bezpieczeństwo konta - CLASHTRK',
      html,
    });
  }
}
