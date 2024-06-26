<template>
  <q-page class="row items-center justify-evenly q-gutter-md q-pa-md">
    <q-card class="col-12 col-md-8 col-lg-5 col-xl-4">
      <q-card-section>
        <div class="text-h6 text-center">Select a Dungeon</div>
        <div class="text-caption text-center">Please select a <code>.dungeon</code> file from your Quest Master installation folder. (Usually <code>C:\Program Files (x86)\Steam\steamapps\common\Quest Master\Dungeons</code>)</div>
      </q-card-section>
      <q-card-section>
        <q-file v-model="file" label="Select a Quest Master .dungeon file" accept=".dungeon" clearable outlined />
      </q-card-section>
      <template v-if="dungeon">
        <q-separator/>
        <q-card-section class="column q-gutter-y-md">
          <q-input v-model="dungeon.Version" label="Game Version" outlined readonly />
          <q-input v-model="dungeon.Name" label="Name" outlined />
          <q-input v-model="dungeon.Description" label="Description" outlined type="textarea" autogrow/>
          <q-select v-model="dungeon.Theme" label="Theme" outlined :options="themes" map-options />

          <q-img :src="dungeon.getThumbnailUrl()" class="cursor-pointer rounded-borders" v-ripple @click="replaceImage">
            <q-tooltip anchor="top middle" self="bottom middle">
              Click to Replace Image
            </q-tooltip>
          </q-img>
        </q-card-section>
        <q-separator/>
        <q-card-actions>
          <q-btn class="full-width" label="Save" color="primary" @click="saveDungeon" />
        </q-card-actions>
      </template>
    </q-card>

    <dungeon-viewer :dungeon="dungeon" v-if="dungeon">
    </dungeon-viewer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineExpose } from 'vue';

import { Dungeon, DungeonLoader } from 'src/lib/DungeonLoader';
import DungeonViewer from 'src/components/DungeonViewer.vue';

import { useQuasar } from 'quasar';

const $q = useQuasar();
const emit = defineEmits(['loadSavedDungeons']);

defineExpose({ loadFile });

const _file = ref<File | null>(null);
const dungeon = ref<Dungeon | null>();

const themes = [
  { label: 'Sandswept Ruins', value: 'ea3c060410de3db47887d09894c50973' },
  { label: 'Emberstone Quarry', value: '322327c931c912e42a0c91f31eb8ded8' },
  { label: 'Dewdrop Roots', value: '7a77779f7f84e2a49bc3b602f19a4487' },
];

//Setup file as a computed property with a setter
const file = computed({
  get: () => _file.value,
  set: (value: File | null) => {
    _file.value = value;
    if (value) {
      DungeonLoader.loadFromFile(value).then((loadedDungeon) => {
        dungeon.value = loadedDungeon;

        emit('loadSavedDungeons');
      });
    }
    else
    {
      dungeon.value = null;
    }
  }
});

function loadFile(toLoad: File) {
  file.value = toLoad;
}

async function saveDungeon() {
  //Confirm the user wants to save
  $q.dialog({
    title: 'Confirm',
    message: `Are you sure you wish to save the Dungeon<br/><code>${dungeon.value?.FileName}</code>?<br/><br/>A backup of the current file will be created in the same directory with the current date & time.`,
    cancel: true,
    persistent: true,
    html: true
  }).onOk(async () => {
    if (dungeon.value) {
      await DungeonLoader.saveDungeon(dungeon.value);

      emit('loadSavedDungeons');
    }
  });
}

function replaceImage() {
  //Create a new file input element
  const fileInput = document.createElement('input');

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

  fileInput.type = 'file';
  fileInput.accept = allowedTypes.join(',');
  fileInput.addEventListener('change', (event) => {

    const target = event.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      const sizeLimit = 1;

      if (file.size > sizeLimit * 1024 * 1024) {
        $q.notify({
          type: 'negative',
          message: `Image is too large. Please select an image smaller than ${sizeLimit}MiB.`
        });
        return;
      }

      //Check if the file is in the correct format
      if (!allowedTypes.includes(file.type)) {
        $q.notify({
          type: 'negative',
          message: 'Invalid file type. Please select a PNG, JPEG or WebP image.'
        });
        return;
      }

      dungeon.value?.setThumbnail(file);

      //Remove the file input element
      fileInput.remove();
    }
  });

  //Click the file input element
  fileInput.click();
}
</script>
