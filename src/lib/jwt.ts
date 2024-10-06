import { createJWT, validateJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

// Encoded token secret
const getEncodedSecret = () => {
  const secretKey = process.env.TOKEN_SECRET;

  if (!secretKey) {
    throw new Error("Secret token undifined");
  }

  return new TextEncoder().encode(secretKey).buffer as ArrayBuffer;
};

// Create an access JWT token with 1 day expiration time.
export const createAccesToken = async (
  userId: string,
  expiresInMinute: number = 1440,
) => {
  try {
    const secretKey = getEncodedSecret();
    const option = {
      subject: userId,
      expiresIn: new TimeSpan(expiresInMinute, "m"),
      includeIssuedTimestamp: true,
    };

    return await createJWT("HS256", secretKey, {}, option);
  } catch (error) {
    throw new Error("Failed to create acces token");
  }
};

// Validates a given token
export const validateToken = async (token: string) => {
  try {
    const secretKey = getEncodedSecret();
    return await validateJWT("HS256", secretKey, token);
  } catch (error) {
    throw new Error("Token invalid");
  }
};
