import { auth } from '@/lib/db/firebase';
import { signInAnonymously } from '@firebase/auth';

export const signIn = async () => {
  if (!auth.currentUser) {
    console.log("how many times");
    await signInAnonymously(auth);
  }
}