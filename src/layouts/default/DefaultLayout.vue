<template>
  <div class="flex flex-col min-h-screen">
    <header class="backdrop-blur-md bg-gray-700/90 sticky text-white top-0 z-50">
      <div class="flex items-center justify-between max-w-7xl mx-auto px-6 py-3 relative">
        <h1 class="font-semibold text-lg">ビッカメ娘訪問チェッカー</h1>

        <UButton
          class="md:hidden text-neutral-50"
          :icon="isOpen ? 'i-rivet-icons:close' : 'i-rivet-icons:menu'"
          variant="ghost"
          @click="isOpen = !isOpen"
        />

        <nav
          class="absolute backdrop-blur-lg bg-gray-800 border-gray-600 border-t flex-col left-0 md:backdrop-blur-none md:bg-transparent md:border-none md:flex-row md:p-0 md:relative md:w-auto p-4 top-full w-full"
          :class="[isOpen ? 'flex' : 'hidden md:flex']"
        >
          <div class="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-2">
            <router-link
              class="hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
              to="/"
              @click="isOpen = false"
            >
              ホーム
            </router-link>
            <router-link
              class="hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
              to="/about"
              @click="isOpen = false"
            >
              サイトについて
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <main class="bg-blue-50 flex-1">
      <router-view />
    </main>

    <footer class="bg-slate-700 text-white">
      <div class="max-w-7xl mx-auto px-6 py-3 text-center text-sm">
        <div class="mb-1">画像に関する権利の一切はナイセン様が保持しています。ビッカメ娘©itall / 再利用禁止</div>
        <div>© 2026 そよごそふと</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const isOpen = ref(false);
</script>
