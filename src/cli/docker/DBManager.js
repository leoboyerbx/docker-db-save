import { exec } from 'child_process'
import fs from 'fs'

class DBManager {
    containerName
    mySqlUser
    mySqlPassword
    savesPath

    constructor(userConfig = {}) {
        const defaultConfig = {
            containerName: 'mysqldb',
            mySqlUser: 'root',
            mySqlPassword: 'root',
            savesPath: './_docker/data/'
        }
        const config = Object.assign({}, defaultConfig, userConfig)

        this.containerName = config.containerName
        this.mySqlUser = config.mySqlUser
        this.mySqlPassword = config.mySqlPassword
        this.savesPath = config.savesPath
    }
    backupDb(filename) {
        return new Promise((resolve, reject) => {
            const command =
                `docker exec ${this.containerName} mysqldump -u ${this.mySqlUser} --password=${this.mySqlPassword} --all-databases > "${this.savesPath}/${filename}.sql" && docker exec ${this.containerName} mysqldump -u ${this.mySqlUser} --password=${this.mySqlPassword} --all-databases > ${this.savesPath}/last.sql`
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(stdout)
            })
        })
    }
    loadBackup(filename) {
        if (!filename.endsWith('.sql')) filename += '.sql'
        return new Promise((resolve, reject) => {
            const command = `docker exec -i ${this.containerName} mysql -u ${this.mySqlUser} --password=${this.mySqlPassword} < "${this.savesPath}/${filename}"`
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(stdout)
            })
        })
    }
    existingBackups( includeLast = true) {
        let files = fs.readdirSync(this.savesPath)
        if (!includeLast) {
            files = files.filter(file => file !== 'last.sql')
        }
        return files
    }
}

export default DBManager
