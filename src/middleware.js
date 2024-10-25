import {NextResponse} from 'next/server';

export async function middleware(req) {
    const id = req.cookies.get('userId');
    if (id && id.value) {
        const userId = id.value.toString();
        const res = await fetch(`${process.env.API_URL}/userId?userId=${userId}`, {method: 'GET'});
        const data = await res.json();
        if (data.message) {
            return NextResponse.next();
        } else {
            req.cookies.delete('userId');
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } else {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/user:path*', '/lobby/:path*', '/gameroom/:path*'],
};
