import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    name: 'NotFound',
    path: '*',
    component: () => import('./components/NotFoundView.vue' /* webpackChunkName: "notfound" */),
    meta: {
      requiresAuth: false,
      showAppMenu: true,
    },
  },
]

export { routes }
