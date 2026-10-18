import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAYA58gO6wIkfLXYOha4ALKeqFurK4OR5U',
  authDomain: 'skypro-kanban.firebaseapp.com',
  projectId: 'skypro-kanban',
  storageBucket: 'skypro-kanban.firebasestorage.app',
  messagingSenderId: '856315131870',
  appId: '1:856315131870:web:18653e487a7d0aedd04f4f',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
