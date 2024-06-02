export const versions = [
  {
    number: '0.4.2a',
    changes: 'Adds in some missing items, adds support for rotations, invisible entities, and winged entities.',
  },
  {
    number: '0.4.1a',
    changes: 'Minor branding update.',
  },
  {
    number: '0.4.0a',
    changes: 'Adds in a Dungeon Viewer! This is still a heavy WIP, so expect lots of broken stuff, missing assets etc.',
    codeName: 'The Viewer Update',
    major: true,
  },
  {
    number: '0.3.4a',
    changes: 'General system stability improvements were made to enhance the user\'s experience.'
  },
  {
    number: '0.3.3c',
    changes: 'Change product name & add favicon.',
    codeName: 'The Branding Update'
  },
  {
    number: '0.3.3b',
    changes: 'Further improves styling & aesthetics.',
  },
  {
    number: '0.3.3a',
    changes: 'Adds in background image to improve aesthetics.',
  },
  {
    number: '0.3.2a',
    changes: 'Adds in confirmation & notification when saving files.',
  },
  {
    number: '0.3.1a',
    changes: 'Enables saving of Directory Reference, allowing you to load dungeons from a previously selected directory without re-selecting.<br/>Adds a changelog page.',
  },
  {
    number: '0.3.0a',
    changes: 'Replaces history functionality.<br/>Implements the File System API for loading an entire directory of dungeons at once.',
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
]

export const latestCodeName = versions.find(v => v.major)?.codeName ?? '';
