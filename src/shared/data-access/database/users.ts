import { firebase } from '../firebase';

const store = firebase.firestore();

export async function saveUser(user: firebase.UserInfo) {
  if (!!user?.uid) {
    const options = { merge: true };
    const doc = store.collection('users').doc(user.uid);
    const response = await doc.set({ ...user }, options);

    return response;
  }

  return false;
}
