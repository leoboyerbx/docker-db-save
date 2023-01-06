import ora from 'ora';
import inquirer from 'inquirer';

const now = new Date()
const pad = nbr => nbr.toString().padStart(2, '0')
const date =
    `db_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}h${pad(now.getMinutes())}m${pad(now.getSeconds())}s`

/**
 * Lanches the db save assistant
 * @param db DBManager
 * @returns {Promise<unknown>}
 */
const dbSaveAssistant = (db) => {
    return new Promise(resolve => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'filename',
                    message: 'Nom de fichier de sauvegarde',
                    default: date,
                    validate: input => {
                        if (input === 'last') {
                            return 'Le fichier ne peut pas être nommé "last".'
                        }
                        if (input.length < 0) {
                            return "Veuillez entrer une valeur."
                        }
                        return true
                    },
                }
            ])
            .then(answers => {
                const spinner = ora('Sauvegarde de la BDD...').start()
                db.backupDb(answers.filename)
                    .then(() => {
                        spinner.stop()
                        console.log('✓ Sauvegarde effectuée avec succès')
                        resolve()
                    })
                    .catch(error => {
                        console.error(`Une erreur s'est produite: ${error.message}`)
                        spinner.stop()
                        console.log("❌ Une erreur s'est produite durant la sauvegarde")
                    })
            })
            .catch(error => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                } else {
                    // Something else went wrong
                }
            })
    })
}

export default dbSaveAssistant
