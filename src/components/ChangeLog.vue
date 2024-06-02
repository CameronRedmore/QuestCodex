<template>
  <div>
    <q-card>
      <q-toolbar class="bg-primary">
        <q-toolbar-title class="text-h6 text-center q-px-none" style="margin-right: -32px;"><span class="text-weight-bolder">Quest Codex</span> v{{ version }}<span v-if="latestCodeName"> - {{ latestCodeName }}</span></q-toolbar-title>
        <q-btn flat round dense icon="las la-times" @click="$emit('close')"></q-btn>
      </q-toolbar>
      <q-separator/>
      <q-card-section  style="max-height: 50vh" class="scroll">
        <div v-for="historicVersion in versions" :key="historicVersion.number">
          <div v-ripple>
            <div class="text-subtitle1">{{ historicVersion.number }}<span v-if="historicVersion.codeName"> - <span :class="historicVersion.major ? 'text-weight-bold' : ''">{{ historicVersion.codeName }}</span></span></div>
            <div class="text-body2" v-html="historicVersion.changes"></div>
          </div>
          <q-separator/>
        </div>
      </q-card-section>
      <q-card-actions>
        <div class="text-center">
          Made by <a class="text-weight-bold text-white text-no-decoration" style="text-decoration: none;" href="//cmzi.uk">Cameron Redmore</a>
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { versions, latestCodeName } from '../lib/Version';
import {version} from '../../package.json';
</script>
