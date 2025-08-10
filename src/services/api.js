const API_URL = 'https://wedev-api.sky.pro/api/kanban'

export async function fetchWords(token) {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Ошибка загрузки задач')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.tasks || []
  } catch (error) {
    throw new Error(error.message || 'Ошибка загрузки задач. Проверьте подключение к интернету.')
  }
}

export async function postWord(task, token) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Ошибка создания задачи')
    }

    return await response.json()
  } catch (error) {
    throw new Error(error.message || 'Ошибка создания задачи. Проверьте данные.')
  }
}

export async function editWord(id, updatedTask, token) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTask),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Ошибка обновления задачи')
    }

    return await response.json()
  } catch (error) {
    throw new Error(error.message || 'Ошибка обновления задачи. Возможно, задача была удалена.')
  }
}

export async function deleteWord(id, token) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
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
