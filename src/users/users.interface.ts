import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6) // Ensure a strong password
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // Optional role

  @IsOptional()
  @IsString()
  api_key?: string; // Optional API key

  @IsOptional()
  usage_limit?: number; // Optional usage limit

  @IsOptional()
  used_request?: number; // Optional used requests

  @IsOptional()
  @IsString()
  status?: string; // Optional status
}

export class loginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
