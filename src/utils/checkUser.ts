import jwt, { type Secret } from 'jsonwebtoken';

export const checkUser = async (sessionCookie: { value: string }) => {
  const session = sessionCookie?.value ? sessionCookie : null;
  const verified =
    session &&
    (jwt.verify(session?.value, import.meta.env.SECRET as Secret) as {
      username: string;
    } | null);
  return verified;
};
