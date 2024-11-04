import { collection, DocumentData, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/lib/db/firebase';

export async function checkUser(user: any){
  const usersRef = collection(db, "users")
  const queryRef = query(usersRef, where("clerk_id", "==", user.id))

  try {
    // Execute the query and get the documents
    const querySnapshot = await getDocs(queryRef);

    // Check if no user was found
    if (querySnapshot.empty) {
      // Add the new user to the database
      const newUser = {
        clerk_id: user.id,
        username: user.username,
        email: user.primaryEmailAddress.emailAddress,
      };

      const response = await fetch('/api/firebase/add_user', {
        method: 'POST',
        body: JSON.stringify(newUser),
      })
      const data = await response.json()

      if (!data.success) {
        console.error('Error adding user to the database');
        return { success: false, user: undefined };
      }

      return { success: true, user: newUser };
    }

    const foundUser: DocumentData = querySnapshot.docs[0].data();
    return { success: true, user: foundUser }

  } catch (error) {
    console.error('Error checking user:', error);
    throw new Error('Failed to check user');
  }
}