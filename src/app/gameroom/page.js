import Waiting_page from './status/waiting/Waiting_page';
import Playing_page from './status/playing/Playing_page';
import End_page from './status/end/End_page';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Page() {
  return <End_page/>;
}
