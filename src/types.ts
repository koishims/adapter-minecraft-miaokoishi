import { Dict } from 'koishi'

export interface Response {
    status: number
    data: any
    echo?: number
}

export class SenderError extends Error {
    constructor(args: Dict, url: string, retcode: number) {
        super(`Error with request ${url}, args: ${JSON.stringify(args)}, retcode: ${retcode}`)
        Object.defineProperties(this, {
            code: { value: retcode },
            args: { value: args },
            url: { value: url },
        })
    }
}
export class TimeoutError extends Error {
    constructor(args: Dict, url: string) {
        super(`Timeout with request ${url}, args: ${JSON.stringify(args)}`)
        Object.defineProperties(this, {
            args: { value: args },
            url: { value: url },
        })
    }
}
