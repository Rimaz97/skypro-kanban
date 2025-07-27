const API_URL = 'https://wedev-api.sky.pro/api/user';

export async function signIn(credentials) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        login: credentials.login,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Неверный логин или пароль');
    }

    const data = await response.json();
    return {
      user: data.user,
      token: data.token || (data.user ? data.user.token : undefined)
    };
  } catch (error) {
    throw new Error(error.message || 'Ошибка авторизации');
  }
}

export async function signUp(userData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        login: userData.login,
        password: userData.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Ошибка регистрации: ';
      if (errorData.error) errorMessage += errorData.error;
      if (errorData.errors) errorMessage += Object.values(errorData.errors).flat().join(', ');
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Ошибка регистрации');
  }
}
