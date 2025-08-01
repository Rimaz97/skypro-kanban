import { createRouter, createWebHistory } from 'vue-router'

import SignInView  from '@/views/auth/SignInView.vue'
import SignUpView  from '@/views/auth/SignUpView.vue'

import HomeView    from '@/views/kanban/HomeView.vue'
import NewCardModal   from '@/components/kanban/NewCardModal.vue'
import TaskModal    from '@/components/kanban/TaskModal.vue'
import EditTaskModal  from '@/components/kanban/EditTaskModal.vue'
import ExitModal    from '@/components/kanban/ExitModal.vue'
import NotFound    from '@/views/kanban/NotFound.vue'

import AppLayout from '@/layout/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'add-task',
            name: 'add-task',
            components: { modal: NewCardModal },
            meta: { requiresAuth: true }
          },
          {
            path: 'card/:id',
            name: 'view-task',
            components: { modal: TaskModal },
            meta: { requiresAuth: true }
          },
          {
            path: 'edit-task/:id',
            name: 'edit-task',
            components: { modal: EditTaskModal },
            meta: { requiresAuth: true }
          },
          {
            path: 'exit',
            name: 'exit',
            components: { modal: ExitModal },
            meta: { requiresAuth: true }
          }
        ]
      },
      {
        path: 'login',
        name: 'login',
        component: SignInView
      },
      {
        path: 'register',
        name: 'register',
        component: SignUpView
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: NotFound
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLogged = !!localStorage.getItem('userInfo')
  if (to.meta.requiresAuth && !isLogged) {
    return next('/login')
  }
  next()
})

export default router
