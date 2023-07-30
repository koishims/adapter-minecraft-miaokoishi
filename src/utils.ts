import { Bot, Logger, defineProperty } from "koishi";

export const logger = new Logger('minecraft')

export async function dispatchSession(bot: Bot, data: any) {
    const session = await adaptSession(bot, data)
    if (!session) return
    defineProperty(session, 'minecraft', Object.create(bot.internal))
    Object.assign(session.minecraft, data)
    bot.dispatch(session)
}

export async function adaptSession(bot: Bot, data: any) {
    const session = bot.session()
    return Object.assign(session, data)
}