<template>
  <div class="full-width">
    <!-- Left to Right, Image, Name -->
    <q-card-section class="row items-center cursor-pointer" v-if="dungeon" v-ripple @click.prevent="useDungeon">
      <q-img class="col-5 rounded-borders" :src="dungeon.getThumbnailUrl()" style="height: 5rem" />
      <div class="col-7 text-h6 text-center q-pa-xs">
        {{ dungeon.Name || "Unnamed" }}
      </div>
    </q-card-section>
    <q-separator />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits, computed, defineExpose } from 'vue'
import { Dungeon, DungeonLoader } from '../lib/DungeonLoader'

const props = defineProps({
  dungeonID: String
});

const dungeon = ref<Dungeon | null>(null);

const dungeonId = computed(() => props.dungeonID?.split('::_::')[0]);

const reload = async () => {
  if (dungeonId.value) {
    dungeon.value = await DungeonLoader.loadFromFileSystem(dungeonId.value);
  }
};

onMounted(async () => {
  reload();
});

const emit = defineEmits(['useDungeon']);

const useDungeon = () => {
  emit('useDungeon', DungeonLoader.dungeonToJson(dungeon.value as Dungeon), dungeonId.value as string);
};

defineExpose({ reload });

</script>
