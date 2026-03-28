import { createApp } from 'vue';

import App from '@/App.vue';
import { install } from '@/plugins';

const app = createApp(App);

import '@/css/app.css';
import 'maplibre-gl/dist/maplibre-gl.css';

install(app);

app.mount('#app');
