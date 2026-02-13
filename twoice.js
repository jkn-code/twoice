
const speaker = require('speakertts')
var fs = require('fs');

let channelName
let messages = []
let busy = false
const urlRegex = /(https?:\/\/[^\s]+)/g;

if (fs.existsSync('cfg.txt')) {
    let lines = fs.readFileSync('cfg.txt')?.toString().split("\n");
    for (let i in lines) {
        if (i == 0) {
            let a = lines[i].split(':')
            if (a.length > 1) channelName = a[1].trim()
        }
    }

    if (channelName) {
        speak('Говорение начато')

        const tmi = require('tmi.js');
        const client = new tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            channels: [channelName]
        });

        client.connect();

        client.on('message', (channel, tags, message, self) => {
            // console.log(`${tags['display-name']}: ${message}`);

            if (!getIgnore().includes(tags['display-name']))
                messages.unshift(tags['display-name'] + ' говорит ' + message)
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

function getIgnore() {
    let ot = []
    let lines = fs.readFileSync('cfg.txt')?.toString().split("\n");
    for (let i in lines)
        if (i > 1) ot.push(lines[i].trim())
    return ot
}

order_message()
function order_message() {
    if (!busy) {
        let msg = messages.pop()
        if (msg) {
            if (!urlRegex.test(msg))
                speak(msg)
            else
               speak("Отправлена ссылка")
        }
    }

    setTimeout(() => {
        order_message()
    }, 1000)
}



// to exe
// pkg -t node*-win-x64 twoice.js