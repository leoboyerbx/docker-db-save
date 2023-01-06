#!/usr/bin/env node
import dockerCli from './src/cli/docker/index.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

// const cli = createCli()
// // Register CLI plugins
// cli.registerCommand('docker', dockerCli)
dockerCli(process.argv.slice(2)).then(async result => {
    const pkg = await fs.readFile(resolve(dirname(fileURLToPath(import.meta.url)), 'package.json'))
    const { version } = JSON.parse(pkg.toString())
    console.log("\nDocker db save v" + version)
    process.exit(result ?? 0)
})
// Run CLI
