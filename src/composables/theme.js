export function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  return savedTheme
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'

  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  return newTheme
}

export function applyThemeStyles() {
  const theme = document.documentElement.getAttribute('data-theme')
  const style = document.createElement('link')
  style.rel = 'stylesheet'

  if (theme === 'dark') {
    style.href = '/src/assets/styles/main_dark.scss'
  } else {
    style.href = '/src/assets/styles/main.scss'
  }

  document.head.appendChild(style)
}
