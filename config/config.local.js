import { defineConfig } from 'umi';

import { headScripts as headScriptsSource } from './extraScript';

const corsTargetDomain = '';

const headScripts = [
  ...headScriptsSource,
  ...[
    {
      src: `${corsTargetDomain}/interactionConfig/initRemote.js`,
    },
  ],
];

export default defineConfig({
  // favicon: `${corsTargetDomain}/assists/image/favicon.ico`,
  // headScripts,
});
