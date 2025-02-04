import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { KnexService } from "src/database/knex.service";
import {
  CreateUserDto,
  ForgotPasswordDto,
  loginDTO,
  ResetPasswordDto,
  VerifyOtpDto,
} from "src/users/users.interface";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { RedisClientService } from "src/redis-client/redis-client.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly knexService: KnexService,
    private readonly jwtService: JwtService,
    private readonly redisClient: RedisClientService
  ) {}

  async login(
    loginDto: loginDTO
  ): Promise<{ access_token: string; user: CreateUserDto }> {
    const user = await this.knexService
      .getDb()
      .select("*")
      .from("users")
      .where({ email: loginDto.email })
      .first();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { algorithm: "HS256" });
    return { access_token, user };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string; otp: string }> {
    const user = await this.knexService
      .getDb()
      .select("*")
      .from("users")
      .where({ email: forgotPasswordDto.email })
      .first();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await this.redisClient.setKey(`otp:${forgotPasswordDto.email}`, otp, 600);
    console.log(`\n\n\nOTP for ${forgotPasswordDto.email}: ${otp}`);
    return { message: `OTP for ${forgotPasswordDto.email} has sent `, otp };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const storedOtp = await this.redisClient.getKey(
      `otp:${verifyOtpDto.email}`
    );
    await this.redisClient.setKey(
      `otp_verified:${verifyOtpDto.email}`,
      "true",
      600
    );
    return storedOtp === verifyOtpDto.otp;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const isOtpVerified = await this.redisClient.getKey(
      `otp_verified:${resetPasswordDto.email}`
    );
    if (isOtpVerified !== "true") {
      throw new UnauthorizedException("OTP not verified.");
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10); // Hash the new password
    await this.knexService
      .getDb()
      .update({ password: hashedPassword })
      .from("users")
      .where({ email: resetPasswordDto.email });

    await this.redisClient.deleteKeys([
      `otp:${resetPasswordDto.email}`,
      `otp_verified:${resetPasswordDto.email}`,
    ]);
    // await this.redisClient.del();
  }
}
