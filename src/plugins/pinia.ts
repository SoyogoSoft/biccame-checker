import { createPinia } from 'pinia';
import Persisted from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(Persisted);

export default pinia;
