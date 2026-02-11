declare module "svg-captcha" {
  type CaptchaOptions = {
    size?: number;
    ignoreChars?: string;
    noise?: number;
    color?: boolean;
    background?: string;
    charPreset?: string;
  };

  type CaptchaData = {
    data: string;
    text: string;
  };

  const svgCaptcha: {
    create: (options?: CaptchaOptions) => CaptchaData;
  };

  export default svgCaptcha;
}
