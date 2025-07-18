import { createRouter, createWebHistory } from 'vue-router'

// Страницы авторизации (публичные)
import SignInView  from '@/views/auth/SignInView.vue'
import SignUpView  from '@/views/auth/SignUpView.vue'

// Основная страница с доской
import HomeView    from '@/views/kanban/HomeView.vue'

// Модальные компоненты (вложенные маршруты)
import NewCardModal   from '@/components/kanban/NewCardModal.vue'
import TaskModal      from '@/components/kanban/TaskModal.vue'
import EditTaskModal  from '@/components/kanban/EditTaskModal.vue'
import ExitModal      from '@/components/kanban/ExitModal.vue'

// Страница 404
import NotFound     from '@/views/kanban/NotFound.vue'

const routes = [
  // публичные
  {
    path: '/login',
    name: 'login',
    component: SignInView
  },
  {
    path: '/register',
    name: 'register',
    component: SignUpView
  },

  // защищённая основная ветка с доской и модалками
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'add-task',           // URL: /add-task
        name: 'add-task',
        components: { modal: NewCardModal },
        meta: { requiresAuth: true }
      },
      {
        path: 'card/:id',           // URL: /card/42
        name: 'view-task',
        components: { modal: TaskModal },
        meta: { requiresAuth: true }
      },
      {
        path: 'edit-task/:id',      // URL: /edit-task/42
        name: 'edit-task',
        components: { modal: EditTaskModal },
        meta: { requiresAuth: true }
      },
      {
        path: 'exit',               // URL: /exit
        name: 'exit',
        components: { modal: ExitModal },
        meta: { requiresAuth: true }
      }
    ]
  },

  // 404 для всех остальных путей
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Глобальный guard для защиты маршрутов
router.beforeEach((to, from, next) => {
  const isLogged = !!localStorage.getItem('userInfo')
  if (to.meta.requiresAuth && !isLogged) {
    return next('/login')
  }
  next()
})

export default router
