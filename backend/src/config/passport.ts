import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { User } from "../models";
import { config } from "./config";
import { AuthTokenTypes } from "./index";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = (payload: any, done: any) => {
  try {
    if (payload.type !== AuthTokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    const user = User.findById(payload.sub);

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export const Passport = {
  jwtStrategy,
};
