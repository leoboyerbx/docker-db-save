import {spawn} from 'child_process';

export default function dockerStart() {
    return new Promise(resolve => {
        const child = spawn('docker-compose', ['up', '-d'], {stdio : 'inherit'})
        child
            .on('close', () => {
                resolve('ok')
            })
            .on('error', err => {
                resolve('err:' + err)
            })
    })
}
