const API_URL = 'https://wedev-api.sky.pro/api/kanban'

const getAuthToken = () => {
  const token = localStorage.getItem('token')
  return token ? `Bearer ${token}` : ''
}

export async function fetchWords() {
   try {
      const response = await fetch(API_URL, {
         headers: {
            Authorization: getAuthToken(),
         },
      })

      if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.error || 'Ошибка загрузки задач')
      }

      const data = await response.json()
      return Array.isArray(data) ? data : (data.tasks || [])
   } catch (error) {
      throw new Error(error.message || 'Ошибка загрузки задач. Проверьте подключение к интернету.')
   }
}

export async function postWord(task) {
  try {
    const formData = new FormData();
    formData.append('title', task.title || 'Без названия');
    formData.append('description', task.description || 'Без описания');
    formData.append('topic', task.topic || 'Без категории');
    formData.append('status', task.status || 'Без статуса');
    formData.append('date', task.date || '1970-01-01');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: getAuthToken(),
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка создания задачи');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Ошибка создания задачи. Проверьте данные.');
  }
}

export async function editWord(id, updatedTask) {
   try {
      const formData = new FormData();
      for (const key in updatedTask) {
         formData.append(key, updatedTask[key]);
      }

      const response = await fetch(`${API_URL}/${id}`, {
         method: 'PUT',
         headers: {
            Authorization: getAuthToken(),
         },
         body: formData
      })

      if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.error || 'Ошибка обновления задачи')
      }

      return await response.json()
   } catch (error) {
      throw new Error(error.message || 'Ошибка обновления задачи. Возможно, задача была удалена.')
   }
}

export async function deleteWord(id) {
   try {
      const response = await fetch(`${API_URL}/${id}`, {
         method: 'DELETE',
         headers: {
            Authorization: getAuthToken(),
         },
      })

      if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.error || 'Ошибка удаления задачи')
      }

      return await response.json()
   } catch (error) {
      throw new Error(error.message || 'Ошибка удаления задачи. Попробуйте позже.')
   }
}
