import { Adapter, Context, Quester, Schema, Time, WebSocketLayer } from 'koishi'

import { Minecraft } from './bot'
import { dispatchSession, logger } from './utils'
import { TimeoutError } from './types'

interface SharedConfig<T = 'ws' | 'ws-reverse'> {
    protocol: T
    responseTimeout?: number
}

export class WsClient extends Adapter.WsClient<Minecraft> {
    protected accept = accept

    prepare(bot: Minecraft<Minecraft.BaseConfig & WsClient.Config>) {
        const { token, endpoint } = bot.config
        const http = this.ctx.http.extend(bot.config)
        if (token) http.config.headers.Authorization = `Bearer ${token}`
        return http.ws(endpoint)
    }
}

export namespace WsClient {
    export interface Config extends SharedConfig<'ws'>, Quester.Config, Adapter.WsClient.Config { }

    export const Config: Schema<Config> = Schema.intersect([
        Schema.object({
            protocol: Schema.const('ws' as const).required(process.env.KOISHI_ENV !== 'browser'),
            responseTimeout: Schema.natural().role('time').default(Time.minute).description('等待响应的时间 (单位为毫秒)。'),
        }).description('连接设置'),
        Quester.createConfig(true),
        Adapter.WsClient.Config,
    ])
}

export class WsServer extends Adapter.Server<Minecraft<Minecraft.BaseConfig & WsServer.Config>> {
    public wsServer?: WebSocketLayer

    constructor(ctx: Context, bot: Minecraft) {
        super()

        const { path = '/miaokoishi' } = bot.config as WsServer.Config
        this.wsServer = ctx.router.ws(path, (socket, { headers }) => {
            logger.debug('connected with', headers)
            if (headers['x-client-role'] !== 'Universal') {
                return socket.close(1008, 'invalid x-client-role')
            }
            const selfId = headers['x-self-id'].toString()
            const bot = this.bots.find(bot => bot.selfId === selfId)
            if (!bot) return socket.close(1008, 'invalid x-self-id')

            bot.socket = socket
            accept(bot)
        })

        ctx.on('dispose', () => {
            logger.debug('ws server closing')
            this.wsServer.close()
        })
    }

    async stop(bot: Minecraft) {
        bot.socket?.close()
        bot.socket = null
    }
}

export namespace WsServer {
    export interface Config extends SharedConfig<'ws-reverse'> {
        path?: string
    }

    export const Config: Schema<Config> = Schema.object({
        protocol: Schema.const('ws-reverse' as const).required(process.env.KOISHI_ENV === 'browser'),
        path: Schema.string().description('服务器监听的路径。').default('/miaokoishi'),
        responseTimeout: Schema.natural().role('time').default(Time.minute).description('等待响应的时间 (单位为毫秒)。'),
    }).description('连接设置')
}

let counter = 0
const listeners: Record<number, (response: Response) => void> = {}

export function accept(bot: Minecraft<Minecraft.BaseConfig & SharedConfig>) {
    bot.socket.addEventListener('message', ({ data }) => {
        let parsed: any
        try {
            parsed = JSON.parse(data.toString())
        } catch (error) {
            return logger.warn('cannot parse message', data)
        }
        if (parsed.echo in listeners) {
            listeners[parsed.echo](parsed)
            delete listeners[parsed.echo]
        } else {
            if (parsed.meta_event_type != 'heartbeat') {
                logger.debug('receive %o', parsed)
            }
            if (bot.status != "online" && parsed.meta_event_type == 'lifecycle' && parsed.sub_type == 'login') {
                bot.initialize()
            }
            dispatchSession(bot, parsed)
        }
    })

    bot.socket.addEventListener('close', () => {
        delete bot.internal._request
    })

    bot.internal._request = (action, params) => {
        const data = { action, params, echo: ++counter }
        return new Promise((resolve, reject) => {
            listeners[data.echo] = resolve
            setTimeout(() => {
                delete listeners[data.echo]
                reject(new TimeoutError(params, action))
            }, bot.config.responseTimeout)
            bot.socket.send(JSON.stringify(data), (error) => {
                if (error) reject(error)
            })
        })
    }

    bot.initialize()
}
