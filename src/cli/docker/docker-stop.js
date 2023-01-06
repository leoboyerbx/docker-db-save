import ora from 'ora';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import dbSaveAssistant from './db-save.js'

export default function dockerStop(db) {
	return new Promise(resolve => {
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'backup',
				message: 'Sauvegarder la base de données avant de stopper les conteneurs ?',
				default: true,
			}
		])
		.then(async answers => {
			if (answers.backup) {
				await dbSaveAssistant(db)
			}
			const spinner = ora('Arrêt des conteneurs...').start()
			exec('docker-compose down', (error, stdout, stderr) => {
				if (error) {
					console.error(`error: ${error.message}`);
					resolve()
				}
				spinner.stop()
				console.log('✓ Les conteneurs ont été arrêtés.')
				resolve()
			})
		})
		.catch(error => {
			if(error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
			} else {
				// Something else went wrong
			}
			resolve()
		})
	})
}
