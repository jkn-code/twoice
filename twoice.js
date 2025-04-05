
const speaker = require('speakertts')
var fs = require('fs');

let channelName

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

        var fs = require('fs');
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
                speak(tags['display-name'] + ' говорит ' + message)
        });
    }
    else speak('Канал в настройках не указан')
}
else speak('Файла cfg.txt нетути')


function speak(txt) {
    console.log(txt);
    speaker.speak(txt, '', 1, 'UTF-8')
}

function getIgnore() {
    let ot = []
    let lines = fs.readFileSync('cfg.txt')?.toString().split("\n");
    for (let i in lines) 
        if (i > 1) ot.push(lines[i].trim())
    return ot
}

// pkg -t node*-win-x64 twoice.js