import { Messenger, segment } from "koishi";
import { BaseBot } from "./base";

export class MinecraftMessenger extends Messenger<BaseBot> {
    private message: string = ''
    async flush(): Promise<void> {
        this.bot.internal.sendMessage(this.channelId, this.guildId, this.message)
    }
    async visit(element: segment): Promise<void> {
        if (element.type == 'text') {
            this.message = this.message + element.attrs.content
        }
    }
}
