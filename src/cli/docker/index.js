import { createCli } from '../createCli.js'
import DBManager from './DBManager.js'
import dockerStart from './docker-start.js'
import dockerStop from './docker-stop.js'
import dbLoadAssistant from './db-load.js'
import dbSaveAssistant from './db-save.js'
import getConfig from '../../config.js'

const cli = createCli()

export default async function dockerCli(args) {
    const config = await getConfig()
    const userConfig = config ?? {}
    const db = new DBManager(userConfig)

    cli.registerCommand('start', async () => {
        return dockerStart()
    })
    cli.registerCommand('stop', async () => {
        return dockerStop(db)
    })
    cli.registerCommand('db-load', async () => {
        return dbLoadAssistant(db)
    })
    cli.registerCommand('db-save', async () => {
        return dbSaveAssistant(db)
    })

    return cli.runWithArgs(args)
}
