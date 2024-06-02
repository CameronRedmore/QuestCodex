import { Buffer } from 'buffer';

//Quest Master refers to tiles by a unique ID, we need to map this to something more friendly
export enum DungeonTheme {
  EmberstoneQuarry = '322327c931c912e42a0c91f31eb8ded8',
  DewDropRoots = '7a77779f7f84e2a49bc3b602f19a4487',
  SandsweptRuins = 'ea3c060410de3db47887d09894c50973'
}

export enum TileType {
  Empty = '-1',

  /*
    Terrain
  */
  Floor = '3b6d8ed1f2a39064e933b3ec73a6eb41',
  LoweredFloor = 'e646b7c011f1c4458b60c563270b779d',
  Hole = '4d6a8fc4a1b8b794992e5a124085b0d2',
  FissuredFloor = 'a3a21fb47932ce149b0790cd2de5739c',
  Water = 'ca4576136ee31754680859009b86e8b6',
  Lava = 'cd565fe37b4c7e54aa3d3d2b16c5e2ce',
  Puddle = '47a48387e886c7a488f9cb2e623caa0c',
  Grating = 'db13e06a37dd249439085a6711b11b42',
  TreadPlate = 'a4ab6864420e26f4b9aa250b9a1808a0',
  Pipe = 'a46de763ba3577f4780ebe4aa8080252',
  TallGrass = 'f5bc82073d9fd4b5daa7736639711676',
  Fence = 'bced8eafa5a0a43389bcf215f9d4ab98',

  /*
    Entities
  */
  //Doors
  Entrance = 'acf8dc24bca464c4c8489f55e4cd0792',
  OpenDoor = 'd4b591a7123cf544c942561ac36c3555',
  ClosedDoor = '65918d5b4bd27cf45b17b524c35d2bbf',
  LockedDoor = '2a9b06111e1cac149b6e893ddbab2d5a',
  BigDoorEntrance = '744e1c00885e2ac42952b2b153459d4c',
  BigDoorExit = '0513a56b798a748d9a2c9ad85561362b',
  StairsUp = '6726e8ab98444324cbc25dbcb4e8b40f',
  StairsDown = '3c9dbea1c2774464b800a4132dcaa755',
  CrackedWall = 'a4cbc5ea17205ba4ea64fa64ce88da8d',
  Staircase = '17e266ad084564541aaf330af661041b',

  //Containers
  Chest = 'ea8177de24782e84fa4cf6e5854a6dd4',
  BigChest = '3c52b1248e2e2c546a9ee381ae228139',
  Pedestal = 'ff61144c334732e41847074eaf484522',

  //Tools
  FireRod = 'cdab999d0713ac040b316667fbbee700',
  Bomb = 'e3ef1757e00edf34db5c60410baeaa5c',
  Boomerang = 'bda038d7655b53146ba89ea6a8042721',
  FireBoomerang = 'd583e361863b042da93aee338394fcf2',

  //Passive
  Lantern = '0cf7f005095a28d4ca4212e6b55a3173',
  SpectralLantern = '906daae7471314971a076c037fb1700f',
  Feather = '31b0594a9e816dd45a8ceff684667368',
  Shovel = '57d72d9472f9c438f8e1c91a581b0255',
  Shield = 'a52c1d7252c3dba4696ed686d50627be',
  WoodenShield = '3d20489c4756c466f9338963c332374b',
  MirrorShield = 'a9401def8d1584a8c890c301c72b82c8',

  //Health
  Heart = 'cfd6d90fcfba2154cb2745833682fc37',
  HeartCrystal = '8fa35ec0a8d95804ba07c7081f1a076c',
  HeartFragment = '045944ef287a04641b0becaf3a909123',
  Fairy = 'ed7c91b9df5ae4c3592ae277c7990625',

  //Collectible
  Coin = '31a86e7e63c4c474c990d8aa5a45d607',
  Goal = 'd5a8981af60bf4d5f954ec20cab27b46',

  //Navigation
  SmallKey = '7efeb80b45190574e81fc2fb550966f0',
  BigKey = 'c5e904006ce96ce458ce44743eef02b7',
  Map = '7df90684d14d9894d96bf279cf6d8c9c',
  Compass = '6f0a0a502f3c1f9479f3e82b17a9bcf8',

  //Enemies
  Bat = '3f432d93edd82084a982a75d6251a50e',
  FireBat = 'ead9ab8b1f9b1144491a59e4f119bd8e',
  RedOctorok = 'b2d6cf2469bfd8e4b90a34714bd95525',
  BlueOctorok = 'e09ad07e2459281428bef40500b6b0f4',
  Snake = '090c9bef3facd1d4784c671a7c17a796',
  Cobra = '72ff9b430e5abbe4b963d4ed6784c759',
  Crab = 'f7a64fdc5ac3baa4ba500ea65f328319',
  Skeleton = '87127fc878921e541aca50fe69203c91',
  Worm = 'd6331c6530cbe5e49aa3e79c6648fc28',
  Goozer = '89ff51b3c94804a3c83db396ee59fe36',
  FireGoozer = 'c90121808dd74408da84aaec4ead50cf',
  Goozling = 'e5a29723e34234692b95863b20670dd2',
  FireGoozling = '23c653b89ed6e471c8fb657741d545da',
  ShadowLanze = 'db7a2926da24f460e84b08357a6ff127',
  ShadowJavelynn = '96e5439cc7f6344e7bd1ecdbf694d76f',
  ShadowShiv = '92edafb7d1cb14ec289af23239198c64',

  //Bosses
  Lyrm = '43f210e0827502d4191255cab87566e2',
  EnragedLyrm = '0b9a57a5d36ee4e7fb0afb55a0f4853e',
  Golem = 'f053e2eb885d64fcbb96e85baa06c9db',
  BrokenGolem = 'a435c0ef53a7d428fafd08e417b3e769',

  //Traps
  ReactiveBladeTrap = '6fdef16e256d6c5408829a8185fffa48',
  DirectionalBladeTrap = 'ca5b362d5d59b6a4295aa391f6329028',
  FloorSpikes = 'df40dc940b34e4b3aaf55e2e884d7579',
  FireBar = '0305267694564bc4085f9408c9cbd961',
  DoubleFireBar = '67bd8a14fc9f3714aa8e5bc4b360f2c0',
  TripleFireBar = '9357eaf913451c341a7e832dcfb55bd8',
  QuadrupleFireBar = 'b865347e6bd40204daf0409c22140ce0',
  ArrowTrap = '4bf18c2673886441f84efe09b23c73f0',
  TrapDoor = '76c514994084346769f8f787f54f46e1',
  RollingSpikeTrap = 'f78c886d9de9842f0b2de82babbcf79a',

  //Breakable
  BrownPot = '440918950ef2ed54097825fdeedd21a7',
  GreenPot = '84c6b45025262402a929f543d992bda5',
  BluePot = 'f24d64526ebb347ae97c00af2fa5b23c',
  RedPot = '0f387b55237d64dcfb8e0a6bbdcf3b80',
  Skull = '8bc075b56cd77c04089ce5feb5462c49',
  Rock = 'f491ad3ff8c854fa1a57e19a87d7637b',
  Barrel = '785f1dbd9e77d415b9926302a8953b56',
  WoodenCrate = '342fc1db3deb740688a9c568314e830c',
  MetalCrate = 'c1145b504346f45d69fc52e56e218b90',
  CrackedBlock = '2ce24561a6653804c9e9fc19193c08f7',
  CrackedFloor = '36e4780f443647849bb23419d280a7d2',
  DiggableHole = 'c8bfaab321b174cddaf2e54c9996b942',

  //Pushable
  Block = '8878ed7e8b49ae04992f943e72106002',
  Pillar = '1ef5a6c3fbca66847adc7ff8f7ae55d9',

  //Torches
  FloorTorch = '679c8bbe3eb6e97489973a176a25540c',
  SpectralFloorTorch = '365b606e5605f4a67a4a73a9554ae231',
  WallTorch = 'a0349709f0615bc4f8c6b8e1fa7469a1',

  //Switches
  ResetSwitch = '67adbd09c13df457eb0f02054a12a3b1',
  PressurePlate = '5e02f04ea39735e4da987d405bbadae0',
  LatchingPressurePlate = 'abad11f7bfa8e5d4ba721c6b6b9596de',
  Lever = '8c15745e6c8bbc64bb5884a39b46da45',
  CrystalSwitch = 'f1dd43405b0a3b3439ecafcc740e0b21',
  ConcurrentSwitch = 'b3f2262f33cad774298eb4dd051e124e',
  ColorSwitch = 'd62c50a133dad0742aa04d63e8047226',
  PullLever = '616db7544b2a9cc4f955377f61a18a77',
  FloorSwitch = 'a502c58112892b942a3ef822938da030',

  //Moving Platforms
  MovingPlatform = 'a0b7f76656527c441ad7c054c7cc6f29',
  LavaPlatform = '47a753439faf31442b2b53c7ff5b8d05',
  WaterLily = '35617a0c6b0f50e4d8fdf2537e2fd273',

  //Blockades
  LockedBlock = '1f68681692619994a89b81c60c4e563b',
  BigBlock = '4252336a451d14f4bbc16cdf8153c26b',
  RedBlock = '864d789ff9ff92f438b9c3cd7e3c8df5',
  BlueBlock = 'c5bd2bfb3654477448f998a94346c2fe',
  RetractableBlock = '721cd83bfca572f47a9e0299da18977c',

  //Miscellaneous
  BlueTeleporter = '58037b76fbcae7e438abee9be7ce0cb0',
  RedTeleporter = '96f61051da1d646628a970a2d7a7c4e4',
  GreenTeleporter = '18fd57319f3894b70b3828b965cca48c',
  DisabledTeleporter = 'f8c8411d33b2f9043b72dc5ad8cfce28',
  ConveyorBelt = '13603de182fa24b31becc9e50878a81f',
  ColorConveyorBelt = 'e58a6d13b4b544e8eb86605058744f9b',
  Checkpoint = '40543c33e307d49128f29d96127465d3',

  //Signs
  RightArrowSign = '765fd6266af30eb4bb61bfd8bfc28747',
  UpArrowSign = 'fc0c452e4bb664d998e6440a530b8258',
  LeftArrowSign = '0875a248a916b4f8986e2a1b6dd41fe2',
  DownArrowSign = 'e1399f663e47e4c1b9f3f5f34a7d746f',
  UpLeftArrowSign = '247db0cac68284d0a8d8133443531375',
  UpRightArrowSign = 'd3d1920ca683146469302d2888120458',
  DownLeftArrowSign = 'e5a7f8b0e55bd44978f55f3a0669dc9a',
  DownRightArrowSign = 'e396305e7e6bf44aaa6c06222d454b85',
  XSign = 'ffc06006ad0114a18b71f9ce4ccc4b7a',
  SkullSign = '18038695f17034a4dac7591837c2315d',
  ChestSign = '96d3bc7b35b6a4bb89f9e9ed1b4763c9',
  HeartSign = '7b4094516d30e4ec6a69bac5329321e5',

  //Rails
  Minecart = 'be2f577469d99224b88a0bf2e0cccab9',
  TrackClosure = '898fa6728512a4f91b4275ed75eec090',
  StraightRail = '32a5541b536bd424a99f79ebbc4a849d',
  CurvedRail = '1f33dd15e0608ac44b6573d39c358a7b',
  LevelJunction = 'a58d465f31644db458262c18ec627ab2',
  LeftRailSwitch = 'b0802540122a11b4486f80a5d6ed967f',
  SwitchedLeftRailSwitch = '211c19951224e494388e5e0ec0da1b37',
  RightRailSwitch = '0b0a525d620369e40930839b66f2d0c1',
  SwitchedRightRailSwitch = '4e3c3df9e4059544f9be7b367e61f400',
  Spring = 'f27d2a10dba6d4bdba592a2404a79cfe',
  Bumper = '5c25b8b5262f74eb2b7b59f113b5ca13'
}

export function loadTilesForRoom(palette: any, room: any): TileType[][][] {
  //Pallete is an object, we need to turn it into an array
  const paletteArray = Object.values(palette);

  const value = [];

  for (const data of Object.values(room.Tilemaps)) {
    const layerValue = [];

    //Decode the base64 data
    const buffer = Buffer.from(data as string, 'base64');

    //Each byte is an index into the palette
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer.readUInt8(i);

      if (byte === 0b11111111) {
        layerValue.push(TileType.Empty);
        continue;
      }

      const tile = paletteArray[byte] as TileType;

      layerValue.push(tile);
    }

    //Turn layerValue into a 2D array, based on room width
    const width = room.Bounds.Size.X;

    const layerValue2D = [];

    for (let i = 0; i < layerValue.length; i += width) {
      layerValue2D.push(layerValue.slice(i, i + width));
    }

    //Reverse the 2D array, as the data is stored in reverse order
    // layerValue2D.reverse();

    //Layer is rotated 90 degrees, so we need to transpose it
    const layerValue2DTranspose = [];

    for (let i = 0; i < layerValue2D[0].length; i++) {
      layerValue2DTranspose.push(layerValue2D.map((x) => x[i]));
    }

    value.push(layerValue2DTranspose);
  }

  //Reverse the array of layers, as the first layer is the top layer, and we need to draw the bottom layer first
  value.reverse();

  return value;
}
