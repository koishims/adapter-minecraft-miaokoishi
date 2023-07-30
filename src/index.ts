import { Minecraft } from './bot'

export default Minecraft

declare global {
  namespace Satori {
    interface Session {
      minecraft?: any
    }

    interface Events {
    }
  }
}