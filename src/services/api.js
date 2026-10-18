import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'

// Принимаем uid как аргумент
function tasksRef(uid) {
  if (!uid) throw new Error('Пользователь не авторизован')
  return collection(db, 'users', uid, 'tasks')
}

export async function fetchWords(uid) {
  try {
    const snapshot = await getDocs(tasksRef(uid))
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }))
  } catch (error) {
    console.error('fetchWords error:', error)
    throw new Error('Ошибка загрузки задач. Проверьте подключение.')
  }
}

export async function postWord(task, uid) {
  try {
    const docRef = await addDoc(tasksRef(uid), task)
    return { _id: docRef.id, ...task }
  } catch (error) {
    console.error('postWord error:', error)
    throw new Error('Ошибка создания задачи')
  }
}

export async function editWord(id, updatedTask, uid) {
  try {
    if (!uid) throw new Error('Пользователь не авторизован')
    const docRef = doc(db, 'users', uid, 'tasks', id)
    await updateDoc(docRef, updatedTask)
    return { _id: id, ...updatedTask }
  } catch (error) {
    console.error('editWord error:', error)
    throw new Error('Ошибка обновления задачи')
  }
}

export async function deleteWord(id, uid) {
  try {
    if (!uid) throw new Error('Пользователь не авторизован')
    const docRef = doc(db, 'users', uid, 'tasks', id)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error('deleteWord error:', error)
    throw new Error('Ошибка удаления задачи')
  }
}
