import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const username = params.get('username');
  const password = params.get('password') as string;
  const hash: string = import.meta.env.PASS;
  console.log(import.meta.env.PASS);
  const validToken = bcrypt.compareSync(password, hash);
  if (validToken) {
    const token = jwt.sign({ username }, import.meta.env.SECRET);
    console.log(import.meta.env.SECRET);
    cookies.set('session', token, { maxAge: 60 * 60 });
    return redirect('admin');
  } else {
    return redirect('login?error=1');
  }
};
