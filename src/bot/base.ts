import { Bot, Fragment, Schema, SendOptions } from 'koishi'

import { MinecraftMessenger } from './messager'

export class BaseBot<T extends BaseBot.Config = BaseBot.Config> extends Bot<T> {
    public parent?: BaseBot

    sendMessage(channelId: string, fragment: Fragment, guildId?: string, options?: SendOptions) {
        return new MinecraftMessenger(this, channelId, guildId, options).send(fragment)
    }

    sendPrivateMessage(userId: string, fragment: Fragment, options?: SendOptions) {
        return new MinecraftMessenger(this, userId, null, options).send(fragment)
    }

    async deleteMessage(channelId: string, messageId: string) {
    }

    async getSelf() {
        return Object.assign({
            avatar: ''
        }, await this.internal.getSelf())
    }

    async getUser(userId: string) {
        return this.internal.getUser(userId)
    }

    async getFriendList() {
        return this.internal.getFriendList()
    }

    async handleFriendRequest(messageId: string, approve: boolean, comment?: string) {
        // await this.internal.setFriendAddRequest(messageId, approve, comment)
    }

    async handleGuildRequest(messageId: string, approve: boolean, comment?: string) {
        // await this.internal.setGroupAddRequest(messageId, 'invite', approve, comment)
    }

    async handleGuildMemberRequest(messageId: string, approve: boolean, comment?: string) {
        // await this.internal.setGroupAddRequest(messageId, 'add', approve, comment)
    }

    async deleteFriend(userId: string) {
        // await this.internal.deleteFriend(userId)
    }

    async getMessageList(channelId: string, before?: string) {
        return []
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
