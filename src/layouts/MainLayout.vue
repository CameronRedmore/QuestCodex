<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="las la-dungeon" size="175%" /> QM | <span class="text-weight-bolder">Dungeon Manager</span>
        </q-toolbar-title>

        <q-space/>
        <span class="text-subtitle1">v0.2.1a by <a class="text-weight-bold text-white text-no-decoration" style="text-decoration: none;" href="//cmzi.uk">Cameron Redmore</a></span>
      </q-toolbar>
    </q-header>

    <q-drawer :model-value="true" side="right" behavior="desktop" bordered persistent>
      <q-list class="col-12 col-md-8 col-lg-6 col-xl-4" v-if="savedDungeons.length > 0">
        <q-item-label header>Load Saved Dungeon</q-item-label>
        <q-separator/>
        <dungeon-selector v-for="dungeon in savedDungeons" :key="dungeon" :dungeonID="dungeon" @useDungeon="useDungeon" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <index-page @loadSavedDungeons="loadSavedDungeons" ref="index" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import DungeonSelector from 'src/components/DungeonSelector.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import localforage from 'localforage';

const rightDrawer = ref<boolean>(true);

const savedDungeons = ref<string[]>([]);

const index = ref<InstanceType<typeof IndexPage> | null>(null);

defineOptions({
  name: 'MainLayout'
});

async function loadSavedDungeons() {
  //Find all stored keys in localforage
  const keys = await localforage.keys();

  //Filter out only the dungeon keys
  const dungeonKeys = keys.filter((key) => key.startsWith('dungeon-')).map((key) => key.replace('dungeon-', '') + '::_::' + (new Date()));

  savedDungeons.value = dungeonKeys;
}

async function useDungeon(dungeonJson: string, fileName: string) {
  if (index.value) {
    //Create file from JSON
    const dungeonFile = new File([dungeonJson], fileName, { type: 'application/json' });
    index.value.loadFile(dungeonFile);
  }

  rightDrawer.value = false;
}

onMounted(() => {
  loadSavedDungeons();
});

</script>
