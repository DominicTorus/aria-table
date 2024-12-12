import { HttpStatus, Injectable, Scope } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { RedisService } from "src/redisService";
import {
  BadRequestException,
  CustomException,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "../customException";
import {
  comparePasswords,
  getRecentKeyStructure,
  hashPassword,
} from "./hashing.utility";
import { JwtService } from "@nestjs/jwt";
import { auth_secret } from "../constants";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  auth: {
    user: "support@torus.tech",
    pass: "Welcome@100",
  },
});

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService
  ) {}

  async throwCustomException(error: any) {
    console.log(error);

    if (error instanceof CustomException) {
      throw error; // Re-throw the specific custom exception
    }
    throw new CustomException(
      "An unexpected error occurred",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async sendVerificationOTP(client: string, email: string, type: string = "t") {
    try {
      if (client && email) {
        const userCachekey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
            : `T:C:PROFILE:setup:NA:${client}:v1:users`;

        const otpCacheKey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:otp`
            : `T:C:PROFILE:setup:NA:${client}:v1:otp`;

        const userListJson = await this.redisService.getJsonData(userCachekey);
        if (userListJson) {
          const userList = JSON.parse(userListJson);
          const existingUser = userList.find((ele: any) => ele.email == email);
          if (existingUser) {
            throw new ForbiddenException(
              "Email already registered , please provide another email or signin to your account"
            );
          }
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpJsonFromRedis = await this.redisService.getJsonData(
          otpCacheKey
        );

        var otpJson = [];

        if (otpJsonFromRedis) {
          otpJson = JSON.parse(otpJsonFromRedis);
          const existingIndex = otpJson.findIndex((ele) => ele.email == email);
          if (existingIndex != -1) {
            otpJson.splice(existingIndex, 1, { email, otp });
          } else {
            otpJson.push({ email, otp });
          }
        } else {
          otpJson.push({ email, otp });
        }
        await this.redisService.setJsonData(
          otpCacheKey,
          JSON.stringify(otpJson)
        );

        const responseFromRedis = await this.redisService.getJsonData(
          "emailTemplates:mailVerficationOtp"
        );
        const verificationTemplate = JSON.parse(responseFromRedis);
        const updatedTemplate = (verificationTemplate.text as string)
          .replace("${email}", email.split("@")[0])
          .replace("${otp}", `${otp}`);

        const mailOptions = {
          from: "support@torus.tech",
          to: email,
          subject: verificationTemplate.subject,
          text: updatedTemplate,
        };
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            throw new ForbiddenException("Please check email is correct");
          } else {
            console.log("Email sent: " + info.response);
            return `Email sent`;
          }
        });
        return `Email sent`;
      } else {
        throw new BadRequestException("Please provide client and email value");
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async verifyMailId(
    client: string,
    email: string,
    otp: string,
    type: string = "t"
  ) {
    try {
      if (client && email && otp) {
        const otpCacheKey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:otp`
            : `T:C:PROFILE:setup:NA:${client}:v1:otp`;

        const otpJsonFromRedis = await this.redisService.getJsonData(
          otpCacheKey
        );
        if (otpJsonFromRedis) {
          const otpJson = JSON.parse(otpJsonFromRedis);
          const existingIndex = otpJson.findIndex((ele: any, index: number) => {
            if (ele.email == email && ele.otp == otp) {
              return ele;
            }
          });

          if (existingIndex != -1) {
            otpJson.splice(existingIndex, 1);
            await this.redisService.setJsonData(
              otpCacheKey,
              JSON.stringify(otpJson)
            );
            return `Email verified successfully`;
          } else {
            throw new NotFoundException(
              "No data found , Please check credentials"
            );
          }
        } else {
          throw new NotFoundException(
            "No data found , Please check credentials"
          );
        }
      } else {
        throw new BadRequestException("Please provide email and otp value");
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async sendResetOtp(client: string, email: string, type: string = "t") {
    try {
      if (client && email) {
        const userCachekey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
            : `T:C:PROFILE:setup:NA:${client}:v1:users`;

        const otpCacheKey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:otp`
            : `T:C:PROFILE:setup:NA:${client}:v1:otp`;

        const userListJson = await this.redisService.getJsonData(userCachekey);
        if (userListJson) {
          const userList = JSON.parse(userListJson);
          const user = userList.find((ele: any) => ele.email == email);

          if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpJsonFromRedis = await this.redisService.getJsonData(
              otpCacheKey
            );

            var otpJson = [];

            if (otpJsonFromRedis) {
              otpJson = JSON.parse(otpJsonFromRedis);
              const existingIndex = otpJson.findIndex(
                (ele) => ele.email == email
              );
              if (existingIndex != -1) {
                otpJson.splice(existingIndex, 1, { email, otp });
              } else {
                otpJson.push({ email, otp });
              }
            } else {
              otpJson.push({ email, otp });
            }
            await this.redisService.setJsonData(
              otpCacheKey,
              JSON.stringify(otpJson)
            );

            const responseFromRedis = await this.redisService.getJsonData(
              "emailTemplates:resetPasswordOtp"
            );
            const resetOtpTemplate = JSON.parse(responseFromRedis);
            const updatedTemplateText = (resetOtpTemplate.text as string)
              .replace(
                "${name}",
                `${user.firstname ?? email} ${user.lastname ?? ""}`
              )
              .replace("${otp}", `${otp}`);

            const mailOptions = {
              from: "support@torus.tech",
              to: email,
              subject: resetOtpTemplate.subject,
              text: updatedTemplateText,
            };

            transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {
                throw new ForbiddenException(
                  "There is an issue with sending otp"
                );
              } else {
                console.log("Email sent: " + info.response);
                return `Email sent`;
              }
            });
            return `Email sent`;
          } else {
            throw new NotFoundException("User not exists");
          }
        } else {
          throw new NotFoundException("There is No data available");
        }
      } else {
        throw new BadRequestException("Please Provide all the credentials");
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async changePassword(
    client: string,
    username: string,
    password: string,
    type: string = "t"
  ) {
    try {
      if (client && username && password) {
        const userCachekey =
          type == "t"
            ? `TGA:T:PROFILE:setup:NA:${client}:v1:users`
            : `T:C:PROFILE:setup:NA:${client}:v1:users`;

        const userListJson = await this.redisService.getJsonData(userCachekey);
        if (userListJson) {
          const userList: any[] = JSON.parse(userListJson);
          const userIndex = userList.findIndex((ele: any) => {
            if (ele.loginId == username || ele.email == username) {
              return ele;
            }
          });
          if (userIndex != -1) {
            const updatedUserCredentials = {
              ...userList[userIndex],
              password: hashPassword(password),
            };
            userList.splice(userIndex, 1, updatedUserCredentials);
            return await this.redisService.setJsonData(
              userCachekey,
              JSON.stringify(userList)
            );
          } else {
            throw new BadRequestException(
              "User not available , Please check credentials"
            );
          }
        } else {
          throw new NotFoundException("There is No data available");
        }
      } else {
        throw new BadRequestException(
          "Please Provide all the necessary credentials"
        );
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async postIdentityProvider(
    client: string,
    role: string,
    user: any,
    account: any
  ) {
    try {
      if (client && user && account) {
        const userListJson = await this.redisService.getJsonData(
          `T:C:PROFILE:setup:NA:${client}:v1:users`
        );
        var userList = [];
        const newUser = {
          loginId: user.name ?? "",
          firstName: user.name ?? "",
          lastName: "",
          email: user.email ?? "",
          mobile: "",
          password: "",
          "2FAFlag": "N",
          image: user.image,
          scope: account?.provider
            ? `${account?.provider} user`
            : `Social user`,
        };

        if (userListJson) {
          userList = JSON.parse(userListJson);
          const existingUserIndex = userList.findIndex((ele: any) => {
            if (ele.loginId == newUser.loginId || ele.email == newUser.email) {
              return ele;
            }
          });
          if (existingUserIndex != -1) {
            userList.splice(existingUserIndex, 1, {
              ...userList[existingUserIndex],
              image: newUser.image,
              scope: newUser.scope,
            });
          } else {
            userList.push(newUser);
          }
        } else {
          userList.push(newUser);
        }
        return await this.redisService.setJsonData(
          `T:C:PROFILE:setup:NA:${client}:v1:users`,
          JSON.stringify(userList)
        );
      } else {
        throw new BadRequestException("Not enough data to continue");
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async refreshToken(token: string): Promise<string> {
    // Verify if the token is valid and not blacklisted
    const payload = await this.jwtService.verify(token);
    if (!payload) {
      throw new UnauthorizedException("Invalid token");
    }
    // Generate a new token with extended expiration
    const newToken = await this.jwtService.sign(payload, { expiresIn: "1h" });

    return newToken;
  }

  async checkIsExpire(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded.exp === "undefined") {
        return true;
      }
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async clientRegister(
    clientName: string,
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    mobile: string | number,
    password: string,
    team: boolean = false
  ) {
    try {
      if (team) {
        if (!clientName) return "Please provide client name";
      }
      // Step 1: Validate input data
      if (
        !firstName ||
        !lastName ||
        !email ||
        !userName ||
        !mobile ||
        !password
      ) {
        throw new BadRequestException("Not enough data to continue");
      }

      // Step 2: Determine client prefix based on team flag
      const clientPrefix = team ? "TT" : "TI";

      // Step 3: Get all relevant client keys from Redis
      const getAllClientKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`
      );

      // Step 4: Filter keys that match the prefix and have 'users' in AFSK
      const userProfileKeys = getAllClientKeys.filter((key: string) => {
        const keyStructure = getRecentKeyStructure(key);
        return (
          keyStructure["AFGK"].includes(clientPrefix) &&
          keyStructure["AFSK"] == "users"
        );
      });

      // Step 5: Prepare the user object
      const userObject = [
        {
          loginId: userName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: mobile,
          password: hashPassword(password),
          "2FAFlag": "N",
          scope: "client_admin",
        },
      ];

      var newClientCode: string;

      // Check if email already exist for an individual
      if (!team) {
        for (const key of userProfileKeys) {
          const userJson = await this.redisService.getJsonData(key);
          if (userJson) {
            const userList: any[] = JSON.parse(userJson);
            const emailAlreadyExist = userList.find(
              (ele: any) => ele.email == email
            );
            const userNameAlreadyExist = userList.find(
              (ele: any) => ele.loginId == userName
            );
            if (userNameAlreadyExist)
              throw new NotAcceptableException(
                "Username already exist, please provide another username"
              );
            if (emailAlreadyExist)
              throw new ForbiddenException(
                "Email already registered , please provide another email or signin to your account"
              );
          }
        }
      }

      // Step 6: Handle new client or existing client code
      if (userProfileKeys.length == 0) {
        // No existing clients, create the first client code
        newClientCode = `${clientPrefix}001`;
      } else {
        // Existing clients, generate a new client code by incrementing the max code
        const structuredClientKeys = userProfileKeys.map(
          (key: string) => getRecentKeyStructure(key)["AFGK"]
        );
        const maxExistingCode = Math.max(
          ...structuredClientKeys.map((item) => parseInt(item.slice(2)))
        );
        newClientCode = `${clientPrefix}${String(maxExistingCode + 1).padStart(
          3,
          "0"
        )}`;
      }

      // Step 7: Save the user object in Redis
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${newClientCode}:AFK:PROFILE:AFVK:v1:users`,
        JSON.stringify(userObject)
      );
      await this.redisService.setJsonData(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK:${newClientCode}:AFK:PROFILE:AFVK:v1:tpc`,
        JSON.stringify({
          clientName: clientName,
          code: newClientCode,
          logo: "",
        })
      );

      // Step 8: send clientcode detail for client via email
      const mailOptions = {
        from: "support@torus.tech",
        to: email,
        subject: "Registered successfully",
        text: `Dear ${userName.charAt(0).toUpperCase() + userName.slice(1)},

Welcome to Torus Platform! We’re thrilled to have you on board.

You’ve successfully registered, and your client code is ${newClientCode}. Whether you're here to generate applications, we’re here to support you every step of the way.

If you have any questions or need assistance, feel free to reach out to our support team at support@torus.tech. We’re always happy to help.

Thank you for choosing Torus Innovations. We’re excited to see you grow with us!

Best regards,
The Torus Team`,
      };

      if (team) {
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            throw new ForbiddenException("There is an issue with sending otp");
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      return `New client created with code: ${newClientCode}`;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async individualSignin(username: string, password: string) {
    try {
      if (!username || !password) {
        throw new BadRequestException("Not enough data to continue");
      }
      const getAllClientKeys: string[] = await this.redisService.getKeys(
        `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`
      );

      const userProfileKeys = getAllClientKeys.filter((key: string) => {
        const keyStructure = getRecentKeyStructure(key);
        return (
          keyStructure["AFGK"].includes("TI") && keyStructure["AFSK"] == "users"
        );
      });

      let client: string;
      let email: string;
      let loginId: string;

      for (let index = 0; index < userProfileKeys.length; index++) {
        const element = userProfileKeys[index];
        const userJson = await this.redisService.getJsonData(element);
        if (userJson) {
          const userList = JSON.parse(userJson);
          const foundedUser = userList.find(
            (ele) =>
              (ele.loginId == username || ele.email == username) &&
              comparePasswords(password, ele.password)
          );
          if (foundedUser) {
            delete foundedUser.password;
            client = getRecentKeyStructure(element)["AFGK"];
            email = foundedUser.email;
            loginId = foundedUser.loginId;
            const token = await this.jwtService.signAsync(
              { ...foundedUser, client: client },
              {
                secret: auth_secret,
                expiresIn: "1h",
              }
            );
            return { token, authorized: true, client, email, loginId };
          } else if (index == userProfileKeys.length - 1) {
            throw new ForbiddenException("Incorrect username or password");
          }
        }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async emailVerificationOtp(email: string, team: boolean = false) {
    try {
      if (!email) {
        throw new BadRequestException("Not enough data to continue");
      }

      const otpCacheKey = "otpjson";

      if (!team) {
        const getAllClientKeys: string[] = await this.redisService.getKeys(
          `CK:TGA:FNGK:SETUP:FNK:SF:CATK:CLIENT:AFGK`
        );

        const userProfileKeys = getAllClientKeys.filter((key: string) => {
          const keyStructure = getRecentKeyStructure(key);
          return (
            keyStructure["AFGK"].includes("TI") &&
            keyStructure["AFSK"] == "users"
          );
        });

        for (let index = 0; index < userProfileKeys.length; index++) {
          const element = userProfileKeys[index];
          const userJson = await this.redisService.getJsonData(element);
          if (userJson) {
            const userList = JSON.parse(userJson);
            const foundedUser = userList.find((ele) => ele.email == email);
            if (foundedUser) {
              throw new NotAcceptableException("User already exist");
            }
          }
        }
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);

      var otpJson = [];

      if (otpJsonFromRedis) {
        otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex((ele) => ele.email == email);
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1, { email, otp });
        } else {
          otpJson.push({ email, otp });
        }
      } else {
        otpJson.push({ email, otp });
      }
      await this.redisService.setJsonData(otpCacheKey, JSON.stringify(otpJson));

      const responseFromRedis = await this.redisService.getJsonData(
        "emailTemplates:mailVerficationOtp"
      );
      const verificationTemplate = JSON.parse(responseFromRedis);
      const updatedTemplate = (verificationTemplate.text as string)
        .replace("${email}", email.split("@")[0])
        .replace("${otp}", `${otp}`);

      const mailOptions = {
        from: "support@torus.tech",
        to: email,
        subject: verificationTemplate.subject,
        text: updatedTemplate,
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          throw new ForbiddenException("Please check email is correct");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return `Email sent`;
    } catch (error) {
      await this.throwCustomException(error);
    }
  }

  async verifyEmailOtp(email: string, otp: number) {
    try {
      if (!email || !otp) {
        throw new BadRequestException("Not enough data to continue");
      }

      const otpCacheKey = "otpjson";
      const otpJsonFromRedis = await this.redisService.getJsonData(otpCacheKey);
      if (otpJsonFromRedis) {
        const otpJson = JSON.parse(otpJsonFromRedis);
        const existingIndex = otpJson.findIndex(
          (ele) => ele.email == email && ele.otp == otp
        );
        if (existingIndex != -1) {
          otpJson.splice(existingIndex, 1);
          await this.redisService.setJsonData(
            otpCacheKey,
            JSON.stringify(otpJson)
          );
          return `OTP verified successfully`;
        } else {
          throw new ForbiddenException("Invalid OTP");
        }
      }
    } catch (error) {
      await this.throwCustomException(error);
    }
  }
}