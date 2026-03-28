import type { App } from 'vue';
import nuxt from './nuxt';
import pinia from './pinia';
import router from './router';

export function install(app: App) {
  app.use(pinia);
  app.use(nuxt);
  app.use(router);
}
