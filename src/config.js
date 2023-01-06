import { resolve } from 'path'

let config
export default async function getConfig() {
    if (!config) {
        try {
            config = await import('file://'+resolve(process.cwd(), 'docker-db.config.js'))
        } catch(e) {
            return {}
        }
    }
    return config.default
}
