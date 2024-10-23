'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import Chinese_Poker from './[roomId]/status/playing/type/Chinese Rummy/Playing_page';

export default function Page() {
  // const router = useRouter();

  // useEffect(() => {
  //   router.push(`/lobby`);
  // }, [router]);

  return <Chinese_Poker />;
}
