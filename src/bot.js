require('dotenv').config()
const Piston = require('./piston.js')
const Bootbot = require('bootbot')

class Bot {
    
    constructor() {
        const piston = new Piston()
        const commands = ['/run', '/start', '/fcoder']
        const bot = new Bootbot({
            accessToken: process.env.FB_ACCESS_TOKEN,
            verifyToken: process.env.FB_VERIFY_TOKEN,
            appSecret: process.env.FB_APP_SECRET
        })
        
        bot.hear(commands, (payload, chat) => {
        	start(chat)
        })
        
        const start = (chat) => {
            chat.say({
                text: 'Welcome to FCoder!\nSelect:',
                buttons: [
                    { title: 'Start coding', type: 'postback', payload: 'START_CODING' },
                    { title: 'Help', type: 'postback', payload: 'HELP' },
                    { title: 'About', type: 'postback', payload: 'ABOUT' }
                ]
            })
        }
        
        bot.on('postback:START_CODING', (payload, chat) => {
        	const askProgrammingLanguage = (convo) => {
        		convo.ask('Example:\njavascript\n\nEnter programming language:', (payload, convo) => {
        			async function run() {
        				const supportedLanguages = await piston.getSupportedLanguages()
        				const message = payload.message.text.toLowerCase()
        				
        				try {
        					const language = supportedLanguages.find(data => data.name == message).name
        					const version = supportedLanguages.find(data => data.name == message).version
        					convo.set('language', language)
        					convo.set('version',  version)
        					startCoding(convo)
        				} catch(error) {
        					chat.say('Unknown language: ' + message).then(() => {
        						askProgrammingLanguage(convo)
        					})
        				}
        			}
        			
        			run()
        		})
        	}
        	
        	const startCoding = (convo) => {
        		convo.ask('You can start coding now!\nTo exit just type /exit\n\nEnter your code:', (payload, convo) => {
        			async function run() {
        				const code = payload.message.text
        				
        				if (code != '/exit') {
        					const output = await piston.run(convo.get('language'), convo.get('version'), code)
        					chat.say(output).then(() => {
        						startCoding(convo)
        					})
        				} else {
        					convo.end()
        					start(chat)
        				}
        			}
        			
        			run()
        		})
        	}
        	
        	chat.conversation((convo) => {
        		askProgrammingLanguage(convo)
        	})
        })
        
        bot.on('postback:HELP', (payload, chat) => {
        	chat.say({
        		text: 'Select:',
        		buttons: [
        			{ title: 'Supported languages', type: 'postback', payload: 'SUPPORTED_LANGUAGES' }
        		]
        	})
        })
        
        bot.on('postback:SUPPORTED_LANGUAGES', (payload, chat) => {
        	async function run() {
        		const supportedLanguages = await piston.getSupportedLanguages()
        		let languages = ''
        		supportedLanguages.map(data => {
        			languages += data.name + data.version + ', '
        		})
        		chat.say('Supported languages:\n\n' + languages)
        	}
        		
        	run()
        })
        
        bot.on('postback:ABOUT', (payload, chat) => {
        	chat.say('Developer: Justin karl, C. Salimbagat\n\n' +
        			 'Links:\n' +
        			 'Facebook: https://www.facebook.com/leah.berenio\n' +
        			 'Github: https://github.com/gx0c\n' +
        			 'Email: salimbagat1124@gmail.com\n\n' +
        			 'Note:\n' +
        			 'This project is buggy since im new to nodejs ' +
        			 'and in javascript in general,\n' +
        			 'anyway i am still learning and dont know if i am gonna continue updating' +
        			 'this bot, i am busy with my school and i want to move on' +
        			 'and build new projects')
        })
        
        bot.start()
    }
}

module.exports = Bot
