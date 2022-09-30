const ping = require('ping');
const args = require('minimist')(process.argv.slice(2));
const { log } = require('./lib/logger')

let url, interval;
let HostAlive = false

if ('h' in args || 'host' in args) {
    url = args.h || args.host;
}

if ('i' in args || 'interval' in args) {
    interval = args.i || args.interval;
    if(isNaN(interval)) {
        log('error', 'Interval must be a number');
        process.exit(1);
    }

    if(interval < 100) {
        log('error', 'Interval must be greater than 100ms');
        process.exit(1);
    }
}

const GetHostCheck = (Host) => {
    return new Promise(function (resolve, reject) {
        ping.sys.probe(Host, function (isAlive) {
            if (isAlive !== HostAlive) {
                if (isAlive) {
                    //log with timestamp in german format
                    log.system(`Host is alive at ${new Date().toLocaleString('de-DE')}`)
                } else {
                    //log with timestamp in german format
                    log.system(`Host is dead at ${new Date().toLocaleString('de-DE')}`)
                }
            }
            HostAlive = isAlive;

            resolve(isAlive);
        });
    });
}

(async () => {
    while (true) {
        await GetHostCheck(url);
        await new Promise(r => setTimeout(r, interval));
    }
})();