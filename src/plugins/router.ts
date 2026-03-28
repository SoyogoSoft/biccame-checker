import { createRouter, createWebHashHistory } from 'vue-router';
import DefaultLayout from '@/layouts/default/DefaultLayout.vue';
import NotFound from '@/layouts/default/NotFound.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: NotFound,
          meta: { title: 'お探しのページは見つかりませんでした' },
        },
      ],
    },
  ],
});

export default router;
