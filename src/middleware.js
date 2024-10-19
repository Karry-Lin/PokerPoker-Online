import {NextResponse} from 'next/server';

export async function middleware(req) {
  const id = req.cookies.get('userId');
  console.log("id", id);
  if (id.value) {
    const userId = id.value.toString();
    const res = await fetch(`${process.env.API_URL}/userId?userId=${userId}`, {method: 'GET'});
    if (res) {
      return NextResponse.next();
    } else {
      const response = NextResponse.redirect(new URL('/login', req.url));
      req.cookies.delete('userId');
      return response;
    }
  } else {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
export const config = {
  matcher: ['/user:path*', '/lobby/:path*', '/gameroom/:path*'],
};
