<template>
  <q-card class="col q-pa-md relative items-center">
    <q-card-section class="col text-center text-h4 q-pa-none q-pb-md">
      Dungeon Viewer
    </q-card-section>

    <canvas id="dungeonCanvas" ref="canvas" class="col rounded-borders" style="cursor: grab"></canvas>

    <q-card class="absolute-bottom-right">
      <q-card-section>
        <q-select v-model="currentFloor" label="Floor" outlined :options="validFloors" map-options />
      </q-card-section>
      <q-card-section>
        <q-btn v-model="viewCentre" label="Reset View" color="primary" @click="resetView(); drawDungeon()" />
      </q-card-section>
      <q-card-section>
        <q-btn v-model="zoom" label="Reset Zoom" color="primary" @click="zoom = defaultZoom; drawDungeon()" />
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script setup lang="ts">
import { TileType } from 'src/lib/TileReader';
import {Dungeon, Floor, Room} from '../lib/DungeonLoader';
import {DungeonTheme, loadTilesForRoom} from '../lib/TileReader';
import { ref, onMounted, computed, watch } from 'vue';

// import { useQuasar } from 'quasar';

// const $q = useQuasar();

const themeMap = new Map<DungeonTheme, number>();

themeMap.set(DungeonTheme.EmberstoneQuarry, 0);
themeMap.set(DungeonTheme.DewDropRoots, 1);
themeMap.set(DungeonTheme.SandsweptRuins, 2);

const randomColours = {};

const _internalFloor = ref(0);

const validFloors = computed({
  get: () => {
    if(!props.dungeon || !props.dungeon.Floors) {
      return [];
    }

    const keys = Object.keys(props.dungeon?.Floors);

    const floors = keys.map((key) => parseInt(key));

    //Should already be in numerical order, but let's sort to be sure
    floors.sort((a, b) => a - b);

    return floors;
  },
  //No-op setter
  set: () => {}
});

const currentFloor = computed({
  get: () => {
    return _internalFloor.value;
  },
  set: (value: number) => {
    let toSet = value;

    if (value < validFloors.value[0]) {
      toSet = validFloors.value[0];
    }

    if (value > validFloors.value[validFloors.value.length - 1]) {
      toSet = validFloors.value[validFloors.value.length - 1];
    }

    _internalFloor.value = toSet;

    requestAnimationFrame(drawDungeon);
  }
});


const canvas = ref<HTMLCanvasElement | null>(null);
const ctxRef = ref<CanvasRenderingContext2D | null | undefined>(null);

//How many pixels wide and high should a single tile be?
const tileSize = 20;
const gridBorderSize = 2;

const spriteSize = 16;

const viewCentre = ref({x: 0, y: 0});

const defaultZoom = 1.25;

const zoom = ref(defaultZoom);

const props = defineProps({
  dungeon: Dungeon
});

onMounted(async () => {

  await loadSprites();

  setupColours();
  setupCanvasEvents();

  watch(() => props.dungeon, () => {
    setupColours();
    requestAnimationFrame(drawDungeon);

    resetView();
  }, {deep: true});
  watch(() => viewCentre, () =>{
    requestAnimationFrame(drawDungeon);
  }, {deep: true});
  watch(() => zoom, () => {
    requestAnimationFrame(drawDungeon);
  });

  resetCanvas();
  resetView();
});

const resetView = () => {
  viewCentre.value = {x: canvas.value!.width / 2 - tileSize / 2, y: canvas.value!.height / 2 - tileSize / 2};
}

const setupColours = () => {
  //Loop every floor and every room, setting a random colour for each room
  const floors = Object.keys((props.dungeon as any).Floors);

  for (let i = 0; i < floors.length; i++) {
    const floor = (props.dungeon?.Floors as any)[floors[i]] as Floor;

    const rooms = floor.Tilemaps.Rooms as Room[];

    for(let j = 0; j < rooms.length; j++) {
      const colour = Math.floor(Math.random()*16777215).toString(16);
      (randomColours as any)[`${i}_${j}`] = '#' + colour;
    }
  }
}

const resetCanvas = () => {
  //Set canvas width to input width, height to 75vh
  canvas.value!.width = canvas.value!.parentElement!.clientWidth - 50;

  canvas.value!.height = window.innerHeight * 0.65;

  ctxRef.value = canvas.value?.getContext('2d');
  const ctx = ctxRef.value;

  if (ctx) {
    ctx.imageSmoothingEnabled = false;

    //Handle zoom
    ctx.translate(canvas.value!.width / 2, canvas.value!.height / 2)
    ctx.scale(zoom.value, -zoom.value);
    ctx.translate(canvas.value!.width / -2, canvas.value!.height / -2)

    //Offset to the view centre
    ctx.translate(viewCentre.value.x, viewCentre.value.y);

    //Clear the canvas, taking into account the view centre and zoom (which may be less than 1)
    ctx.fillStyle = '#131e32';
    ctx.fillRect(-viewCentre.value.x - canvas.value!.width / 2, -viewCentre.value.y - canvas.value!.height / 2, canvas.value!.width * 2, canvas.value!.height * 2);
  }
};

const spriteCache = new Map<TileType, HTMLImageElement>();

//For every value of the TileType enum, load the corresponding image
const loadSprites = async () => {
  console.log('Loading sprites');

  const promises = Object.entries(TileType).map(async ([key, value]) => {
    if(key == 'Empty')
    {
      return;
    }
     //Image is '/GameAssets/Graphics/${TileTypeKey}_Icon.png'
    const image = new Image();

    image.src = `/GameAssets/Graphics_Flipped/${key}_Icon.png`;

    console.log(`Loading ${key} from ${image.src}`);

    await new Promise<void>((resolve) => {
      image.onload = () => {
        console.log(`Loaded ${key}`);
        spriteCache.set(value, image);

        resolve();
      };
      image.onerror = () => {
        resolve();
      }
    });
  });

  await Promise.all(promises);

  requestAnimationFrame(drawDungeon);
};

const drawDungeon = async () => {
  resetCanvas();

  const ctx = ctxRef.value;

  //Get the current floor
  const floor = (props.dungeon?.Floors as any)[currentFloor.value.toString()] as Floor;

  if (!floor || !ctx) {
    return;
  }

  const rooms = floor.Tilemaps.Rooms as Room[];

  //Draw the rooms
  for(const room of rooms) {
    const layers = loadTilesForRoom(floor.Tilemaps.Palette, room);

    for(const layer of layers) {
      for (let x = 0; x < layer.length; x++) {
        for (let y = 0; y < layer[x].length; y++) {
          const tile = layer[x][y];

          if (tile !== TileType.Empty) {

            if(tile === TileType.Hole)
            {
              ctx.fillStyle = '#000000';
              ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, tileSize, tileSize);
              continue;
            }

            const sprite = spriteCache.get(tile);

            if (sprite) {
              //We need to select a different part of the offset depending on the current theme.
              const themeOffset = themeMap.get((props.dungeon?.Theme as any).value) || 0;

              const offsetX = themeOffset * spriteSize;

              ctx.drawImage(sprite, offsetX, 0, spriteSize, spriteSize, (room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, tileSize, tileSize);
            }
          }
        }
      }
    }

    //Draw in wall boundaries
    ctx.fillStyle = '#ffffff';

    let layer = layers[0];
    for (let x = 0; x < layer.length; x++) {
      for (let y = 0; y < layer[x].length; y++) {
        const tile = layer[x][y];

        if (tile === TileType.Empty) {
          //If the tile is adjacent to a non-empty tile, draw a border
          if (x > 0 && layer[x - 1][y] !== TileType.Empty) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, 1, tileSize);
          }

          if (x < layer.length - 1 && layer[x + 1][y] !== TileType.Empty) {
            ctx.fillRect((room.Bounds.Position.X + x + 1) * tileSize, (room.Bounds.Position.Y + y) * tileSize, 1, tileSize);
          }

          if (y > 0 && layer[x][y - 1] !== TileType.Empty) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, tileSize, 1);
          }

          if (y < layer[x].length - 1 && layer[x][y + 1] !== TileType.Empty) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y + 1) * tileSize, tileSize, 1);
          }
        }
        else
        {
          if (x === 0) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, 1, tileSize);
          }

          if (x === layer.length - 1) {
            ctx.fillRect((room.Bounds.Position.X + x + 1) * tileSize, (room.Bounds.Position.Y + y) * tileSize, 1, tileSize);
          }

          if (y === 0) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y) * tileSize, tileSize, 1);
          }

          if (y === layer[x].length - 1) {
            ctx.fillRect((room.Bounds.Position.X + x) * tileSize, (room.Bounds.Position.Y + y + 1) * tileSize, tileSize, 1);
          }
        }
      }
    }
  }

  //Draw the grid
  ctx.globalAlpha = 0.05;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = gridBorderSize;
  for (let x = Math.floor((-viewCentre.value.x - canvas.value!.width / 2) / tileSize); x < Math.ceil(((canvas.value!.width * 2) - viewCentre.value.x) / tileSize); x++) {
    ctx.beginPath();
    ctx.moveTo(x * tileSize, -viewCentre.value.y - canvas.value!.height / 2);
    ctx.lineTo(x * tileSize, (canvas.value!.height * 2) - viewCentre.value.y);
    ctx.stroke();
    ctx.closePath();
  }

  for (let y = Math.floor((-viewCentre.value.y - canvas.value!.height / 2) / tileSize); y < Math.ceil(((canvas.value!.height * 2) - viewCentre.value.y) / tileSize); y++) {
    ctx.beginPath();
    ctx.moveTo(-viewCentre.value.x - canvas.value!.width / 2, y * tileSize);
    ctx.lineTo((canvas.value!.width * 2) - viewCentre.value.x, y * tileSize);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.globalAlpha = 1;
  //Draw in entities
  for(const entity of floor.Entities) {
    const anyEntity = entity as any;
    const sprite = spriteCache.get(anyEntity.Entity);

    if (sprite) {
      let offsetX = 0;

      //Check if the image is wider than it is tall (if so, this icon has theme variants)
      if(sprite.width > sprite.height)
      {
        //We need to select a different part of the offset depending on the current theme.
        const themeOffset = themeMap.get((props.dungeon?.Theme as any).value) || 0;

        offsetX = themeOffset * spriteSize;
      }

      //Draw the sprite, offset by negative half a tile
      ctx.drawImage(sprite, offsetX, 0, spriteSize, spriteSize, (anyEntity.Position.X - 0.5) * tileSize, (anyEntity.Position.Y - 0.5) * tileSize, tileSize, tileSize);
    }
    else
    {
      //Draw a red square if the sprite is missing, offset by negative half a tile, half a tile big
      ctx.fillStyle = '#ff0000';

      ctx.fillRect((anyEntity.Position.X - 0.25) * tileSize, (anyEntity.Position.Y - 0.25) * tileSize, tileSize / 2, tileSize / 2);
    }
  }

  ctx.globalAlpha = 0.75;

  //Outline each room with a random colour
  for (const room of rooms) {
    //Get the random colour for this room
    const colour = (randomColours as any)[`${currentFloor.value}_${rooms.indexOf(room)}`];

    ctx.strokeStyle = colour;
    ctx.fillStyle = 'transparent';
    ctx.lineWidth = gridBorderSize * 3;

    const distance = 2;

    ctx.beginPath();

    //Add rounded border distance tiles out from the room
    ctx.roundRect((room.Bounds.Position.X - distance) * tileSize, (room.Bounds.Position.Y - distance) * tileSize, (room.Bounds.Size.X + distance * 2) * tileSize, (room.Bounds.Size.Y + distance * 2) * tileSize, 5);

    ctx.stroke();

    ctx.closePath();
  }

  //Draw a circle at 0,0
  // ctx.beginPath();
  // ctx.arc(tileSize / 2, tileSize / 2, tileSize / 6, 0, 2 * Math.PI);
  // ctx.fillStyle = '#ff0000';
  // ctx.fill();
  // ctx.closePath();

  ctx.globalAlpha = 1;
};

const setupCanvasEvents = () => {
  //Add zoom functionality to the canvas
  canvas.value?.addEventListener('wheel', (event) => {
    event.preventDefault();

    zoom.value += event.deltaY * -0.001;

    //Clamp zoom to 1
    zoom.value = Math.min(10, Math.max(0.5, zoom.value));

    requestAnimationFrame(drawDungeon);
  });

  //Add drag functionality to the canvas
  let isDragging = false;

  let lastX = 0;
  let lastY = 0;

  let lastViewCentre = {x: 0, y: 0};

  canvas.value?.addEventListener('mousedown', (event) => {
    isDragging = true;

    lastX = event.clientX;
    lastY = event.clientY;

    lastViewCentre = {x: viewCentre.value.x, y: -viewCentre.value.y};

    canvas.value!.style.cursor = 'grabbing';
  });

  canvas.value?.addEventListener('mouseup', () => {
    isDragging = false;

    canvas.value!.style.cursor = 'grab';
  });

  canvas.value?.addEventListener('mouseleave', () => {
    isDragging = false;

    canvas.value!.style.cursor = 'grab';
  });

  canvas.value?.addEventListener('mousemove', (event) => {
    if (isDragging) {
      //Calculate the difference between the last mouse position and the current one
      let diffX = event.clientX - lastX;
      let diffY = event.clientY - lastY;

      //Scale the difference by the zoom level
      diffX /= zoom.value;
      diffY /= zoom.value;

      //Set the view centre to the last view centre + the difference
      viewCentre.value = {x: lastViewCentre.x + diffX, y: -(lastViewCentre.y + diffY)};

      requestAnimationFrame(drawDungeon);
    }
    else {
      //If the mouse is currently hovered over an entity, show a tooltip
      // const floor = (props.dungeon?.Floors as any)[currentFloor.value.toString()] as Floor;

      // if (!floor) {
      //   return;
      // }

      // const entities = floor.Entities;

      // const x = event.offsetX;
      // const y = event.offsetY;

      // //Adjust by the view centre & zoom
      // const adjustedX = (x - viewCentre.value.x) / zoom.value;
      // const adjustedY = (y - viewCentre.value.y) / zoom.value;

      // for (const entity of entities) {
      //   const anyEntity = entity as any;

      //   if (adjustedX < anyEntity.Position.X + 0.5 && adjustedX > anyEntity.Position.X - 0.5 && adjustedY < anyEntity.Position.Y + 0.5 && adjustedY > anyEntity.Position.Y - 0.5) {
      //     $q.notify({
      //       message: `Entity: ${anyEntity.Entity}`,
      //       color: 'primary',
      //       position: 'top-right',
      //       timeout: 1000
      //     });
      //   }
      // }
    }
  });
}

</script>

<style type="text/css" scoped>
  #dungeonCanvas {
    border: 1px solid #d1d1d1;
  }
</style>
