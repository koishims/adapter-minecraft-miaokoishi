import { Bot, Fragment, Schema, SendOptions } from 'koishi'

import { MinecraftMessenger } from './messager'

export class BaseBot<T extends BaseBot.Config = BaseBot.Config> extends Bot<T> {
    public parent?: BaseBot
    static MessageEncoder = MinecraftMessenger

    async getSelf() {
        return this.internal.getSelf()
    }

    async getUser(userId: string) {
        return this.internal.getUser(userId)
    }
}

export namespace BaseBot {
    export interface Config extends Bot.Config {
        advanced?: AdvancedConfig
    }

    export interface AdvancedConfig {
        splitMixedContent?: boolean
    }

    export const AdvancedConfig: Schema<AdvancedConfig> = Schema.object({
        splitMixedContent: Schema.boolean().description('是否自动在混合内容间插入空格。').default(true),
    }).description('高级设置')
}
