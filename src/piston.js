const axios = require('axios')

class Piston {
    
    
    constructor() {
        this.run = (language, version, code) => {
            return new Promise((resolve, reject) => {
                let output = ''
                axios.post('https://emkc.org/api/v2/piston/execute', {
                    language: language,
                    version: version,
                    files: [{
                        name: 'App',
                        content: code
                    }]
                }).then(response => {
                   const stdout = response.data.run.stdout
                   const stderr = response.data.run.stderr
               
                   if (stderr == '') {
                       output = stdout;
                   } else {
                       output = stderr;
                   }
                   
                   resolve(output)
                }).catch(error => {
                    reject(error)
                })
            })
        }
        
        this.getSupportedLanguages = () => {
            return new Promise((resolve, reject) => {
                let languages = []
                axios.get('https://emkc.org/api/v2/piston/runtimes').then(response => {
                    response.data.map(data => {
                    	languages.push({
                    		name: data.language,
                    		version: data.version,
                    		aliases: data.aliases
                    	})
                    })
                    resolve(languages)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

module.exports = Piston