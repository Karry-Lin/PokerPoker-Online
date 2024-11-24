import {firebaseConfig} from "@/utils/firebase.js";

export const runtime = 'edge';

export async function GET() {
  return Response.json(firebaseConfig, {status: 200});
}
