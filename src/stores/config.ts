import { defineStore } from 'pinia';
import { ref } from 'vue';

const KEY = 'config';

export const useConfigStore = defineStore(
  KEY,
  () => {
    const includeNotVisitable = ref(false);

    return { includeNotVisitable };
  },
  {
    persist: true,
  },
);
