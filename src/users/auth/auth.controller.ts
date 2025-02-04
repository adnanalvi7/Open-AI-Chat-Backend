import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "../users.service";
import {
  ForgotPasswordDto,
  loginDTO,
  ResetPasswordDto,
  VerifyOtpDto,
} from "../users.interface";
import { AuthService } from "./auth/auth.service";
import { MailService } from "src/mail/mail.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}

  @Post("login")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() body: loginDTO) {
    return this.authService.login(body);
  }

  @Post("forgot-password")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(forgotPasswordDto);
    await this.mailService.sendEmail(
      forgotPasswordDto.email,
      "OTP Code",
      `Your OTP code is ${data.otp}`,
      ``
    );
    return data.message;
  }

  @Post("verify-otp")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const isValid = await this.authService.verifyOTP(verifyOtpDto);
    if (!isValid) return { message: "Invalid OTP.", success: false };
    else return { message: "OTP verified successfully.", success: true };
  }

  @Post("reset-password")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: "Password reset successfully.", success: true };
  }
}
