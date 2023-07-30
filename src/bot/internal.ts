import { Dict } from "koishi"

import { logger } from "../utils"
import { Response, SenderError } from '../types'

export class Internal {
    _request?(action: string, params: Dict): Promise<Response>

    private async _get<T = any>(action: string, params = {}): Promise<T> {
        logger.debug('[request] %s %o', action, params)
        const response = await this._request(action, params)
        logger.debug('[response] %o', response)
        const { data, status } = response
        if (status === 200) return data
        throw new SenderError(params, action, status)
    }

    getSelf() {
        return this._get('getSelf')
    }
    getUser(userId: string) {
        return this._get('getUser', { userId })
    }
    getFriendList() {
        return this._get('getFriendList')
    }
    sendMessage(channelId: string, guildId: string, content: string) {
        return this._get('sendMessage', { channelId, guildId, content })
    }
    sendPrivateMessage(userId: string, content: string) {
        return this._get('sendPrivateMessage', { userId, content })
    }
}
