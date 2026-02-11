import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import svgCaptcha from "svg-captcha";

type CaptchaRecord = {
  code: string;
  expiresAt: number;
};

const CAPTCHA_TTL_MS = 2 * 60 * 1000;

@Injectable()
export class AuthCaptchaService {
  private readonly captchaStore = new Map<string, CaptchaRecord>();

  private cleanupExpiredCaptcha() {
    const now = Date.now();
    for (const [captchaId, record] of this.captchaStore.entries()) {
      if (record.expiresAt <= now) {
        this.captchaStore.delete(captchaId);
      }
    }
  }

  createCaptcha() {
    this.cleanupExpiredCaptcha();

    const captcha = svgCaptcha.create({
      size: 5,
      noise: 2,
      charPreset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
      ignoreChars: "0oO1ilI",
      background: "#f8fafc",
    });

    const captchaId = randomUUID();
    this.captchaStore.set(captchaId, {
      code: captcha.text.toUpperCase(),
      expiresAt: Date.now() + CAPTCHA_TTL_MS,
    });

    const svgBase64 = Buffer.from(captcha.data).toString("base64");

    return {
      captchaId,
      svg: `data:image/svg+xml;base64,${svgBase64}`,
      expiresIn: Math.floor(CAPTCHA_TTL_MS / 1000),
    };
  }

  verifyCaptcha(captchaId: string, captchaCode: string): boolean {
    this.cleanupExpiredCaptcha();

    const record = this.captchaStore.get(captchaId);
    if (!record) {
      return false;
    }

    this.captchaStore.delete(captchaId);
    return record.code === captchaCode.trim().toUpperCase();
  }
}
