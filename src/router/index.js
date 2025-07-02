import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/kanban/HomeView.vue'
import SignInView from '@/views/auth/SignInView.vue'
import SignUpView from '@/views/auth/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/addition',
          component: () => import('/src/views/task/TaskAddition.vue'),
        },

        {
          path: '/editing',
          component: () => import('/src/views/task/TaskEditing.vue'),
        },

        {
          path: '/review',
          component: () => import('/src/views/task/TaskReview.vue'),
        },

        {
          path: '/modal-exit',
          component: () => import('/src/views/modal/ModalExit.vue'),
        },

        {
          path: '/:pathMatch(.*)*',
          component: () => import('/src/views/error/NotFoundView.vue'),
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sign-in',
      component: SignInView,
    },
    {
      path: '/sign-up',
      component: SignUpView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  // Берем токен
  const token = localStorage.getItem('userInfo')

  // Проверяем, действительно ли на маршруте нужна авторизация и есть ли токен
  if (to.meta.requiresAuth && !token) {
    next('/sign-in') // Если нет, уводим на страницу входа
  } else {
    next() // Иначе пропускаем пользователя
  }
})

export default router
