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
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Ошибка создания задачи');
    }

    let data;
    try {
      data = await response.json();
    } catch {
      return task;
    }

    if (data.tasks && Array.isArray(data.tasks)) {
      const newTask = data.tasks.find(t =>
        t.title === task.title &&
        t.topic === task.topic &&
        t.date === task.date
      );
      if (newTask) {
        return newTask;
      }
      return data.tasks[data.tasks.length - 1];
    }

    return task;
  } catch (error) {
    throw new Error(error.message || 'Ошибка создания задачи. Проверьте данные.');
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
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = errorData.error || `Ошибка ${response.status}: Ошибка обновления задачи`;
      } catch {
        errorText = await response.text() || `Ошибка ${response.status}: Ошибка обновления задачи`;
      }
      throw new Error(errorText);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      return updatedTask;
    }

    if (data.tasks && Array.isArray(data.tasks)) {
      const updatedTaskFromServer = data.tasks.find(task => task._id === id);
      if (updatedTaskFromServer) {
        return updatedTaskFromServer;
      }
    }

    return updatedTask;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('HTTP2_PING_FAILED')) {
      return updatedTask;
    }
    throw new Error(error.message || 'Ошибка обновления задачи. Возможно, задача была удалена.');
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
