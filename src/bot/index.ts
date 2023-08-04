import { Bot, Context, Schema } from "koishi"

import { BaseBot } from "./base"
import { Internal } from "./internal"
import { WsClient, WsServer } from "../ws"
import { logger } from "../utils"

export class Minecraft<T extends Minecraft.Config = Minecraft.Config> extends BaseBot<T> {
    constructor(ctx: Context, config: T) {
        super(ctx, config)
        this.platform = 'minecraft'

        this.selfId = config.selfId
        this.username = '等待链接...'
        this.avatar = 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-76x76.png'

        this.internal = new Internal()

        if (config.protocol === 'ws') {
            ctx.plugin(WsClient, this)
        } else if (config.protocol === 'ws-reverse') {
            ctx.plugin(WsServer, this)
        }
    }

    async stop() {
        return super.stop()
    }

    async initialize() {
        await Promise.all([
            this.getSelf().then(data => Object.assign(this, data)),
        ]).then(() => this.online(), error => {
            logger.error(error)
            this.offline(error)
        })
    }
}

export namespace Minecraft {
    export interface BaseConfig extends BaseBot.Config {
        selfId: string
        password?: string
        token?: string
    }

    export const BaseConfig: Schema<BaseConfig> = Schema.object({
        selfId: Schema.string().description('服务器唯一ID 默认为 minecraft 如需接入多个服务器 请到 MiaoKoishi 修改配置 并且两边保持一致。').required(),
        token: Schema.string().role('secret').description('发送信息时用于验证的字段，应与 MiaoKoishi 配置文件中的 `token` 保持一致。'),
        protocol: process.env.KOISHI_ENV === 'browser'
            ? Schema.const('ws').default('ws')
            : Schema.union(['ws', 'ws-reverse']).description('选择要使用的协议。').default('ws-reverse'),
    })

    export type Config = BaseConfig & (WsServer.Config | WsClient.Config)

    export const Config: Schema<Config> = Schema.intersect([
        BaseConfig,
        Schema.union([
            WsClient.Config,
            WsServer.Config,
        ]),
        Schema.object({
            advanced: BaseBot.AdvancedConfig,
        }),
    ])
}