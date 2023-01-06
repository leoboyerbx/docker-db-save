export function createCli() {
    const commands = []
    const registerCommand = (command, handler) => {
        commands.push({
            name: command,
            handler
        })
    }
    const showAvailableCommands = () => {
        console.log('Available commands are:')
        for (const c of commands) {
            console.log(' - ' + c.name)
        }
    }
    const runWithArgs = async (args) => {
        const command = args[0]
        if (!command) {
            console.error(`Error: no command specified.`)
            showAvailableCommands()
            return 1
        }
        for  (const c of commands) {
            if (c.name === command) {
                return c.handler(args.slice(1))
            }
        }
        console.error(`${command} is not a valid command.`)
        showAvailableCommands()

        return 1
    }
    return {
        registerCommand,
        runWithArgs,
        showAvailableCommands
    }
}
