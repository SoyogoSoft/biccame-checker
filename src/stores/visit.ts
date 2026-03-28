import { defineStore } from 'pinia';
import { computed, ref, toRaw } from 'vue';
import { models, modelVersion } from '@/models';
import { useConfigStore } from '@/stores/config';
import type { BiccameState } from '@/types/biccame';
import { REGION } from '@/types/biccame';

const KEY = 'visit';

const defaultState = models.map((v) => {
  return {
    biccame: v,
    visited: false,
  } as BiccameState;
});

function clone<T>(a: T[]): T[] {
  return a.map((list) => ({ ...list }));
}

export const useVisitStore = defineStore(
  KEY,
  () => {
    const config = useConfigStore();
    const state = ref(clone(defaultState));
    const version = ref(modelVersion);

    /* 描画するビッカメ娘を格納してる */
    const display = computed(() => {
      return config.includeNotVisitable ? state.value : state.value.filter((v) => v.biccame.visitable);
    });

    /* 訪問済ビッカメ娘の人数 */
    const visitedCount = computed(() => {
      return display.value.filter((v) => v.visited).length;
    });

    /* 訪問リストを初期化する */
    function reset() {
      state.value = clone(defaultState);
      version.value = modelVersion;
    }

    /* ビッカメ娘データ更新時の訪問リスト移行用 */
    function migrate() {
      const old = toRaw(state.value).map((list) => ({ ...list }));
      state.value = clone(defaultState);
      for (const v of old) {
        const b = state.value.find((element) => element.biccame.url === v.biccame.url);
        b && (b.visited = v.visited);
      }
      version.value = modelVersion;
    }

    /* 関東地方のビッカメ娘を一括で訪問済にする */
    function checkTokyo() {
      for (const v of display.value) {
        v.biccame.region === REGION.tokyo && (v.visited = true);
      }
    }

    /* 大阪のビッカメ娘を一括で訪問済にする */
    function checkOsaka() {
      for (const v of display.value) {
        v.biccame.region === REGION.osaka && (v.visited = true);
      }
    }

    return { state, version, display, visitedCount, reset, migrate, checkTokyo, checkOsaka };
  },
  { persist: true },
);
