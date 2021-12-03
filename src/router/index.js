import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import Song from '@/views/Song.vue';
import store from '@/store';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: Home,
  },
  {
    name: 'About',
    path: '/about',
    component: About,
  },
  {
    name: 'Manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Route Gaurd');
      next();
    },
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((recorde) => recorde.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.loggedIn) {
    next();
  } else {
    next({ name: 'Home' });
  }
});

export default router;
