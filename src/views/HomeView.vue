<template>
  <div class="pb-4 px-6">
    <!-- データ更新の警告 -->
    <div class="py-2">
      <div
        v-if="modelVersion > visit.version"
        class="bg-red-600 flex items-center justify-between max-w-4xl mx-auto px-4 py-2 rounded text-white"
      >
        <div>データのアップデートが存在します！</div>
        <UButton
          class="bg-white ml-4 px-3 py-1 rounded text-red-600 text-sm"
          type="button"
          @click="visit.migrate"
        >
          アップデートする
        </UButton>
      </div>
    </div>

    <!-- 結果表示 -->
    <div class="flex items-center justify-center pb-2 space-x-4">
      <h4 class="m-0 text-[clamp(1.25rem,5.5vw,1.875rem)]">
        訪問済ビッカメ娘:
        <span class="text-red-600">{{ `${visit.visitedCount} ` }}</span> /
        {{ visit.display.length }}
        人
      </h4>
    </div>
    <div class="flex items-center justify-center pb-3">
      <UButton
        class="my-2"
        color="secondary"
        icon="i-fa7-brands:x-twitter"
        size="md"
        variant="outline"
        @click="openTweet"
      >
        ついーとする
      </UButton>
      <UButton
        class="ml-2 my-2"
        color="primary"
        icon="i-rivet-icons:download"
        :loading="isSavingImage"
        variant="outline"
        @click="saveImage"
      >
        画像を保存
      </UButton>
    </div>
    <USeparator size="lg" />

    <!-- ボタン -->
    <div class="flex justify-center mt-2 py-3">
      <div class="gap-3 grid grid-cols-2 px-4 sm:flex sm:px-0 sm:w-auto w-full">
        <UButton
          class="sm:w-auto w-full"
          color="primary"
          icon="i-rivet-icons:check-circle-breakout"
          size="md"
          variant="subtle"
          @click="visit.checkTokyo"
        >
          関東組を一括訪問済にする！
        </UButton>
        <UButton
          class="sm:w-auto w-full"
          color="primary"
          icon="i-rivet-icons:check-circle-breakout"
          size="md"
          variant="subtle"
          @click="visit.checkOsaka"
        >
          大阪組を一括訪問済にする！
        </UButton>
        <UButton
          class="col-span-2 sm:col-auto sm:w-auto w-full"
          color="error"
          icon="i-rivet-icons:close-circle"
          size="md"
          variant="solid"
          @click="visit.reset"
        >
          リセットする
        </UButton>
      </div>
    </div>

    <!-- チェックボックス -->
    <div class="flex justify-center mt-3 pb-3">
      <UCheckbox
        v-model="config.includeNotVisitable"
        label="卒業したビッカメ娘を表示する"
      />
    </div>

    <!-- ビッカメ娘の選択 -->
    <div class="flex justify-center mt-4">
      <div class="flex flex-wrap gap-6">
        <span
          v-for="m in display"
          :key="m.biccame.url"
        >
          <img
            :alt="m.biccame.name"
            :class="m.visited ? 'active' : 'inactive'"
            height="64"
            :src="`https://bmcdn.akaneu.net/${m.biccame.url}.png`"
            style="box-sizing: content-box"
            :title="m.biccame.name"
            width="64"
            @click="m.visited = !m.visited"
          />
        </span>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <div class="map-wrapper">
        <div
          id="map"
          class="map"
        />

        <!--
        選択中のビッカメ娘の詳細パネル（地図左上）
        UCardは重そうだからいったんcss
        -->
        <div
          v-if="selected"
          class="map-info"
        >
          <div class="map-info-inner">
            <div class="map-info-header">
              <strong>{{ selected?.storeName }}</strong>
              <button
                class="map-info-close text-gray-600"
                @click="selected = null"
              >
                ✕
              </button>
            </div>
            <div class="map-info-body">
              <img
                :alt="selected?.name"
                height="64"
                :src="`https://bmcdn.akaneu.net/${selected?.url}.png`"
                width="64"
              />
              <div class="map-info-text">
                <div v-if="selected?.name">{{ selected?.name }}</div>
              </div>
            </div>
            <div class="map-info-actions">
              <button
                :class="
                  selected?._visitedRef?.visited
                    ? 'bg-red-600 text-white px-3 py-1 rounded'
                    : 'bg-green-600 text-white px-3 py-1 rounded'
                "
                @click="toggleVisited"
              >
                {{ selected?._visitedRef?.visited ? '未訪問に戻す' : '訪問済に切替' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Marker } from 'maplibre-gl';
import * as mapGl from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { modelVersion } from '@/models';
import { imgCoords } from '@/models/imgCoords';
import { useConfigStore } from '@/stores/config';
import { useVisitStore } from '@/stores/visit';
import type { Biccame, BiccameState } from '@/types/biccame';

setWorkerUrl(workerUrl);

type SelectedBiccame = Biccame & {
  _visitedRef?: BiccameState;
};

const config = useConfigStore();
const visit = useVisitStore();

const { display, state, visitedCount } = storeToRefs(visit);

const tweetUrl = computed(() => {
  let url = 'https://twitter.com/intent/tweet?text=';
  url += encodeURIComponent(`私のビッカメ娘訪問率は${visitedCount.value}/${display.value.length}です！\n#ビッカメ娘`);
  url += `&url=${encodeURIComponent(window.location.href)}`;
  return url;
});

function openTweet() {
  window.open(tweetUrl.value, '_blank', 'noopener, noreferrer');
}

const isSavingImage = ref(false);

async function saveImage() {
  isSavingImage.value = true;

  try {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = 'https://bmcdn.akaneu.net/sheets/musume_list.png';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('画像を読み込めませんでした'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('canvasを作成できませんでした');
    }

    context.drawImage(image, 0, 0);
    context.strokeStyle = '#dc2626';
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    for (const item of state.value) {
      if (!item.visited) continue;

      const x = imgCoords.vert[item.biccame.imgPos.v];
      const y = imgCoords.horiz[item.biccame.imgPos.h];
      if (x === undefined || y === undefined) continue;

      context.beginPath();
      context.moveTo(x + 3, y + 10);
      context.lineTo(x + 8, y + 15);
      context.lineTo(x + 17, y + 5);
      context.stroke();
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => {
        if (value) {
          resolve(value);
        } else {
          reject(new Error('画像を保存できませんでした'));
        }
      }, 'image/png');
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'musume_list.png';
    link.click();
    URL.revokeObjectURL(url);
  } finally {
    isSavingImage.value = false;
  }
}

let map: mapGl.Map;

const markers: Marker[] = [] as Marker[];

const selected = ref<SelectedBiccame | null>(null);

watch(visitedCount, (_new, _old) => {
  for (const marker of markers) {
    marker.remove();
  }
  markers.length = 0;
  for (const v of display.value) {
    const marker = new mapGl.Marker({
      color: v.visited ? '#2269dc' : '#dc2222',
      draggable: false,
    }).setLngLat([v.biccame.pos.lng, v.biccame.pos.lat]);

    // マーカークリックで詳細を表示
    const el = marker.getElement();
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      selected.value = { ...v.biccame, _visitedRef: v };
    });

    marker.addTo(map);
    markers.push(marker);
  }
});

onMounted(() => {
  map = new mapGl.Map({
    container: 'map',
    style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json',
    center: [136.0914, 37.5417],
    zoom: 3.7,
  });

  nextTick(() => {
    for (const v of display.value) {
      const marker = new mapGl.Marker({
        color: v.visited ? '#2269dc' : '#dc2222',
        draggable: false,
      }).setLngLat([v.biccame.pos.lng, v.biccame.pos.lat]);

      const el = marker.getElement();
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        selected.value = { ...v.biccame, _visitedRef: v };
      });

      marker.addTo(map);
      markers.push(marker);
    }
  });
});

function toggleVisited() {
  if (!selected.value || !selected.value._visitedRef) return;
  selected.value._visitedRef.visited = !selected.value._visitedRef.visited;
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  display: inline-block;
}

.map {
  height: 400px;
  width: 800px;
  max-width: 90vw;
}

.map-info {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 10;
}

.map-info-inner {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 220px;
}

.map-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.map-info-body {
  display: flex;
  gap: 8px;
  align-items: center;
}

.map-info-text {
  font-size: 0.9rem;
}

.map-info-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

/* Quasar の $red-6 を直接カラーに置換 */
.active {
  outline: 2px solid #dc2222;
}

.inactive {
  background-color: #000;
  opacity: 0.5;
}
</style>
