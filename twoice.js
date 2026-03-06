
const speaker = require('speakertts')
var fs = require('fs');

// let channelName
let messages = []
let busy = false
let cfg = {}
const urlRegex = /(https?:\/\/[^\s]+)/g;

if (fs.existsSync('cfg.txt')) {
    let lines = fs.readFileSync('cfg.txt')?.toString().split("\n");
    for (let line of lines) if (line.trim() != "") {
        console.log(line);
        let prm = line.split(':')
        if (prm[0].trim() != "" && prm.length > 1)
            cfg[prm[0].trim()] = prm[1].trim()
    }

    let ni = []
    if (cfg['names ignore'])
        for (let name of cfg['names ignore'].split(',')) {
            name = name.trim()
            if (name != "" && !ni.includes(name))
                ni.push(name.trim())
        }
    cfg['names ignore'] = ni

    if (cfg['short name']) cfg['short name'] = parseInt(cfg['short name'])

    console.log("CFG: ", cfg);

    if (cfg.channel) {
        speak('Говорение начато')

        const tmi = require('tmi.js');
        const client = new tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            channels: [cfg.channel]
        });

        client.connect();

        client.on('message', (channel, tags, message, self) => {
            // console.log(`${tags['display-name']}: ${message}`);
            if (!cfg['names ignore'].includes(tags['display-name'])) {
                let name = tags['display-name']
                if (cfg['short name'] > 0)
                    name = name.substring(0, cfg['short name'])

                if (urlRegex.test(message)) message = "вэб-ссылка"
                
                messages.unshift(name + ' говорит ' + message)
            }
        });
    }
    else speak('Канал в настройках не указан')
}
else speak('Файла cfg.txt нетути')


function speak(txt) {
    console.log(txt);
    busy = true
    speaker.speak(txt, '', 1, 'UTF-8', () => { busy = false })
}


order_message()
function order_message() {
    if (!busy) {
        let msg = messages.pop()
        if (msg) speak(msg)
    }

    setTimeout(() => {
        order_message()
    }, 1000)
}



// to exe
// pkg -t node*-win-x64 twoice.js