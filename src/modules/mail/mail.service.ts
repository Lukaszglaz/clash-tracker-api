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
      <div style="background-color: ${this.bgColor}; padding: 20px 10px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #FFFFFF; text-align: center;">
        <div style="max-width: 550px; margin: 0 auto; background-color: ${this.cardColor}; border-radius: 28px; border: 1px solid #2D2D35; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.5);">
          
          <div style="padding: 35px 20px; background: linear-gradient(135deg, #BC47FB 0%, #7B2FF7 100%);">
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -1px; font-style: italic; text-transform: uppercase;">
              CLASH<span style="color: #FFFFFF; opacity: 0.8;">TRK</span>
            </h1>
          </div>
          
          <div style="padding: 45px 30px;">
            ${content}
            
            <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #2D2D35;">
              <p style="margin: 0; color: #A0A0AB; font-size: 13px;">Z poważaniem,</p>
              <p style="margin: 5px 0 0 0; color: #FFFFFF; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Zespół ClashTracker</p>
            </div>
          </div>

          <div style="padding: 30px 25px; background-color: rgba(255,255,255,0.02); border-top: 1px solid #2D2D35; text-align: left;">
            <p style="margin: 0 0 15px 0; font-size: 12px; color: #888; line-height: 1.6;">
              <strong style="color: #A0A0AB;">Wsparcie:</strong> Masz pytania lub zauważyłeś błąd? Skontaktuj się z nami bezpośrednio pod adresem 
              <a href="mailto:kontakt@glazlukasz.pl" style="color: ${this.brandColor} !important; text-decoration: none; font-weight: bold;">
                <span style="color: ${this.brandColor} !important;">kontakt@glazlukasz.pl</span>
              </a> 
              lub skorzystaj z oficjalnego formularza kontaktowego dostępnego na stronie <strong>ClashTracker</strong>.
            </p>
            <p style="margin: 0; font-size: 11px; color: #666; line-height: 1.5;">
              <strong>Nota prawna:</strong> Treści przesyłane w tym serwisie, w tym statystyki i analizy, są chronione prawem autorskim. 
              ClashTracker nie jest powiązany, wspierany ani sponsorowany przez Supercell.
            </p>
          </div>

          <div style="padding: 20px; background-color: #0A0A0E;">
            <p style="margin: 0; font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">
              Wiadomość generowana automatycznie • Prosimy nie odpowiadać na ten e-mail
            </p>
          </div>
        </div>
      </div>
    `;
  }

  async sendVerificationCode(email: string, code: string) {
    const html = this.getHtmlWrapper(`
     <h2 style="margin-top: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #FFFFFF;">
  Aktywacja <span style="color: ${this.brandColor};">Statystyk</span>
</h2>

<p style="color: #A0A0AB; font-size: 15px; line-height: 1.7;">
  Witaj! Aby dokończyć proces rejestracji konta i uzyskać pełny dostęp do statystyk gracza, 
  <strong>zaloguj się na swoje konto</strong>. Po zalogowaniu wyświetlą się informacje o aktywacji 
  – wpisz tam poniższy kod weryfikacyjny:
</p>

<div style="background: rgba(188, 71, 251, 0.08); border: 2px dashed ${this.brandColor}; border-radius: 16px; padding: 30px; margin: 35px 0; text-align: center;">
  <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: ${this.brandColor}; text-shadow: 0 0 20px rgba(188,71,251,0.3);">
    ${code}
  </span>
</div>

<p style="color: #A0A0AB; font-size: 14px; line-height: 1.6;">
  Po wpisaniu kodu na stronie po zalogowaniu, Twój profil zostanie w pełni aktywowany, 
  a statystyki zaczną się odświeżać automatycznie.
</p>

<p style="font-size: 12px; color: #666; font-style: italic; margin-top: 20px;">
  Ten kod jednorazowy wygaśnie automatycznie po upływie 24 godzin.
</p>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: `Kod weryfikacyjny: ${code} - ClashTracker`,
      html,
    });
  }

  async sendWelcomeMessage(email: string) {
    const html = this.getHtmlWrapper(`
      <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; background: rgba(188, 71, 251, 0.2); border-radius: 50%; color: #BC47FB; font-size: 20px; margin-bottom: 25px; font-weight: 900; border: 2px solid ${this.brandColor};">OK</div>
      <h2 style="margin-top: 0; font-size: 22px; font-weight: 900; text-transform: uppercase;">Witaj w Armii</h2>
      <p style="color: #A0A0AB; font-size: 15px; line-height: 1.7;">
        Twoje konto zostało pomyślnie zweryfikowane. Twój Player Tag został powiązany z profilem <strong>ClashTracker</strong>.
      </p>
      <div style="background: rgba(188, 71, 251, 0.08); border: 1px dashed ${this.brandColor}; border-radius: 16px; padding: 20px; margin: 30px 0;">
        <p style="margin: 0; color: #FFFFFF; font-size: 14px; line-height: 1.5;">Aktualnie synchronizujemy Twoje dane z serwerami Supercell. Może to potrwać kilka minut.</p>
      </div>
      <p style="color: #A0A0AB; font-size: 14px;">Możesz teraz zalogować się do swojego panelu i śledzić postępy.</p>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Konto aktywne - Witaj w ClashTracker',
      html,
    });
  }

  async sendResetPasswordCode(email: string, code: string) {
    const html = this.getHtmlWrapper(`
      <h2 style="margin-top: 0; font-size: 22px; font-weight: 900; text-transform: uppercase;">Resetowanie hasła</h2>
      <p style="color: #A0A0AB; font-size: 15px; line-height: 1.7;">Otrzymaliśmy prośbę o zmianę hasła do Twojego konta. Użyj poniższego kodu bezpieczeństwa, aby kontynuować:</p>
      <div style="background: rgba(188, 71, 251, 0.08); border: 2px dashed ${this.brandColor}; border-radius: 16px; padding: 30px; margin: 35px 0;">
        <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: ${this.brandColor}; text-shadow: 0 0 20px rgba(188,71,251,0.3);">${code}</span>
      </div>
      <div style="background: rgba(226, 74, 74, 0.1); border-radius: 16px; padding: 20px; border: 1px solid rgba(226, 74, 74, 0.2); text-align: left;">
        <p style="margin: 0; font-size: 12px; color: #E24A4A; line-height: 1.6;">
          <strong>Uwaga:</strong> Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość i bezzwłocznie skontaktuj się z nami pod adresem 
          <a href="mailto:kontakt@glazlukasz.pl" style="color: ${this.brandColor} !important; text-decoration: underline; font-weight: bold;">
            <span style="color: ${this.brandColor} !important;">kontakt@glazlukasz.pl</span>
          </a> w celu natychmiastowego zabezpieczenia konta.
        </p>
      </div>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: `Kod resetujący: ${code} - ClashTracker`,
      html,
    });
  }

  async sendPasswordChangedNotification(email: string) {
    const html = this.getHtmlWrapper(`
      <h2 style="margin-top: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; color: #FFFFFF;">Bezpieczeństwo Konta</h2>
      <p style="color: #A0A0AB; font-size: 15px; line-height: 1.7;">
        Informujemy, że hasło do Twojego konta zostało pomyślnie zaktualizowane. Możesz teraz użyć nowych danych do logowania.
      </p>
      <div style="background: rgba(188, 71, 251, 0.08); border: 1px dashed ${this.brandColor}; border-radius: 16px; padding: 20px; margin: 30px 0;">
         <p style="margin: 0; font-size: 13px; color: #FFFFFF; line-height: 1.6;">
          Jeśli ta operacja nie została wykonana przez Ciebie, skontaktuj się z administratorem pod adresem 
          <a href="mailto:kontakt@glazlukasz.pl" style="color: ${this.brandColor} !important; text-decoration: none; font-weight: bold;">
            <span style="color: ${this.brandColor} !important;">kontakt@glazlukasz.pl</span>
          </a>.
         </p>
      </div>
    `);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Hasło zostało zmienione - ClashTracker',
      html,
    });
  }
}
