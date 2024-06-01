<template>
  <div>
    <q-card>
      <q-toolbar class="bg-primary">
        <q-toolbar-title class="text-h6 text-center q-px-none" style="margin-right: -32px;"><span class="text-weight-bolder">Dungeon Manager</span> v{{ version }}</q-toolbar-title>
        <q-btn flat round dense icon="las la-times" @click="$emit('close')"></q-btn>
      </q-toolbar>
      <q-separator/>
      <div v-for="historicVersion in versions" :key="historicVersion.number">
        <q-card-section v-ripple>
          <div class="text-subtitle1">{{ historicVersion.number }}<span v-if="historicVersion.codeName"> - <span :class="historicVersion.major ? 'text-weight-bold' : ''">{{ historicVersion.codeName }}</span></span></div>
          <div class="text-body2" v-html="historicVersion.changes"></div>
        </q-card-section>
        <q-separator/>
      </div>
      <q-card-section>
        <div class="text-center">
          Made by <a class="text-weight-bold text-white text-no-decoration" style="text-decoration: none;" href="//cmzi.uk">Cameron Redmore</a>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {version} from '../../package.json';

import {ref} from 'vue';

const versions = ref([
  {
    number: '0.3.1a',
    changes: 'Enables saving of Directory Reference, allowing you to load dungeons from a previously selected directory without re-selecting.<br/>Adds a changelog page.',
  },
  {
    number: '0.3.0a',
    changes: 'Implements the File System API for loading an entire directory of dungeons at once.',
    major: true,
    codeName: 'The Directory Update',
  },
  {
    number: '0.2.0a',
    changes: 'Adds in history functionality. Fixes Theme changer functionality.',
    major: true,
    codeName: 'The Historic Update',
  },
  {
    number: '0.1.0b',
    changes: 'Disables Theme changer functionality due to bugs.'
  },
  {
    number: '0.1.0a',
    changes: 'Initial release.',
    major: true,
    codeName: 'Initial Release',
  }
])

</script>
