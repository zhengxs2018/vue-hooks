import { resolve } from 'path'

import type { UserConfig } from 'vite'

export default <UserConfig>{
  alias: {
    '/@/': resolve(__dirname, 'src'),
  },
  port: 3000,
}
