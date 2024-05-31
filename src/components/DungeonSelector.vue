<template>
  <div class="full-width">
    <!-- Left to Right, Image, Name -->
    <q-card-section class="row items-center cursor-pointer" v-if="dungeon" v-ripple @click.prevent="useDungeon">
      <q-img class="col-3" :src="dungeon.getThumbnailUrl()" style="height: 5rem" />
      <div class="col-9 text-h6 text-center">
        {{ dungeon.Name || "Unnamed" }}
      </div>
    </q-card-section>
    <q-separator />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits, computed } from 'vue'
import { Dungeon, DungeonLoader } from '../lib/DungeonLoader'

const props = defineProps({
  dungeonID: String
});

const dungeon = ref<Dungeon | null>(null);

const dungeonId = computed(() => props.dungeonID?.split('::_::')[0]);

onMounted(async () => {
  dungeon.value = await DungeonLoader.loadFromLocalForage(dungeonId.value as string);
});

const emit = defineEmits(['useDungeon']);

const useDungeon = () => {
  emit('useDungeon', DungeonLoader.dungeonToJson(dungeon.value as Dungeon), dungeonId.value + '.dungeon' as string);
};

</script>
