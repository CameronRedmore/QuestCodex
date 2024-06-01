<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="las la-dungeon" size="175%" /> QM | <span class="text-weight-bolder">Dungeon Manager</span>
        </q-toolbar-title>

        <q-space/>

        <q-btn flat round dense icon="las la-save" @click="rightDrawer = !rightDrawer">
          <q-tooltip>
            Load Saved Dungeon
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer :model-value="rightDrawer" side="right" overlay bordered persistent>
      <q-list class="col-12 col-md-8 col-lg-6 col-xl-4">
        <div class="q-pa-md">
          <q-btn class="full-width q-mx-md q-mb-md" color="primary" outline @click="loadSavedDungeons">Load Dungeons From Directory</q-btn>
          <q-btn class="full-width q-mx-md" color="secondary" outline @click="changeDirectory">Change Directory</q-btn>
        </div>
        <q-separator/>
        <dungeon-selector v-for="dungeon in savedDungeons" :key="dungeon" :dungeonID="dungeon" @useDungeon="useDungeon" :ref="setItemRef"/>
      </q-list>
    </q-drawer>

    <q-footer>
      <div class="text-h6 text-center"><span v-ripple class="cursor-pointer" @click="changelog = true">v{{ version }}</span> by <a class="text-weight-bold text-white text-no-decoration" style="text-decoration: none;" href="//cmzi.uk">Cameron Redmore</a></div>
    </q-footer>

    <q-page-container>
      <index-page @loadSavedDungeons="loadSavedDungeons" ref="index" />
    </q-page-container>

    <q-dialog v-model="changelog">
      <change-log @close="changelog = false" />
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import { DungeonLoader } from 'src/lib/DungeonLoader';
import IndexPage from 'src/pages/IndexPage.vue';
import DungeonSelector from 'src/components/DungeonSelector.vue';
import ChangeLog from 'src/components/ChangeLog.vue';

import { version } from '../../package.json';

import { useQuasar } from 'quasar';

const rightDrawer = ref<boolean>(true);

const savedDungeons = ref<string[]>([]);

const index = ref<InstanceType<typeof IndexPage> | null>(null);

const $q = useQuasar();

const dungeonSelectorRefs = ref<InstanceType<typeof DungeonSelector>[]>([]);

const changelog = ref<boolean>(false);

//@ts-expect-error - TS doesn't like this but it's fine
const setItemRef = el => {
  if(el) {
    dungeonSelectorRefs.value.push(el);
  }
}

defineOptions({
  name: 'MainLayout'
});

async function loadSavedDungeons() {
  //Find all stored keys in localforage
  savedDungeons.value = await DungeonLoader.loadAllDungeons();

  //Reload all dungeon selectors
  dungeonSelectorRefs.value.forEach((ref) => {
    ref.reload();
  });
}

async function changeDirectory() {
  await DungeonLoader.chooseDirectory();
  loadSavedDungeons();
}

async function useDungeon(dungeonJson: string, fileName: string) {
  //Confirm the user wants to load the dungeon
  await $q.dialog({
    title: 'Load Dungeon',
    message: 'Are you sure you want to load this dungeon? This will overwrite any unsaved changes.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    if (index.value) {
      //Create file from JSON
      const dungeonFile = new File([dungeonJson], fileName, { type: 'application/json' });
      index.value.loadFile(dungeonFile);
    }
  });
}

onMounted(() => {
  loadSavedDungeons();
});

</script>
