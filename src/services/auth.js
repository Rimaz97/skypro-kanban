import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/firebase'

// Вход — email
export async function signIn({ login, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, login, password)
    return {
      user: {
        id: credential.user.uid,
        email: credential.user.email,
        name: credential.user.displayName || '',
      },
    }
  } catch (error) {
    throw new Error(translateError(error))
  }
}

// Регистрация + сохранение имени
export async function signUp({ name, login, password }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, login, password)
    await updateProfile(credential.user, { displayName: name })
    return {
      user: {
        id: credential.user.uid,
        email: credential.user.email,
        name,
      },
    }
  } catch (error) {
    throw new Error(translateError(error))
  }
}

// Выход
export async function logout() {
  return signOut(auth)
}

// Перевод ошибок Firebase на русский
function translateError(error) {
  const map = {
    'auth/email-already-in-use': 'Этот email уже зарегистрирован',
    'auth/invalid-email': 'Некорректный email',
    'auth/weak-password': 'Пароль слишком короткий (минимум 6 символов)',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/network-request-failed': 'Проблемы с сетью. Проверьте интернет',
  }
  return map[error.code] || error.message || 'Ошибка авторизации'
}
