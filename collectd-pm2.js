var os = require('os');
var exec = require('child_process').exec;


var hostname = process.env.COLLECTD_HOSTNAME || os.hostname();
var interval = parseInt(process.env.COLLECTD_INTERVAL, 10) || 1;

function collect () {
    exec('pm2 jlist', function (error, stdout, stderr) {
        if (error) {
            process.stderr.write(error.toString());
            process.exit(1);
        }

        if (stderr) {
            process.stderr.write(stderr.toString());
        }

        var timestamp = Math.floor(Date.now() / 1000);
        var list = JSON.parse(stdout);
        list.forEach(function (item) {
            var name = '';
            for(var i = 0, n = item.name.length; i < n; ++i) {
                name += item.name[i].match(/^[0-9a-zA-Z]+$/) ? item.name[i] : '_';
            }
            process.stdout.write("PUTVAL \"" + hostname + "/" + name + "-loop_delay" + "/delay-" + item.pm_id + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.axm_monitor["Loop delay"].value.replace('ms', '') + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + name + "-memory_used" + "/gauge-" + item.pm_id + "\" interval=" + interval + " " + timestamp + ":" + item.monit.memory + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + name + "-cpu_used" + "/gauge-" + item.pm_id + "\" interval=" + interval + " " + timestamp + ":" + item.monit.cpu + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + name + "-restart_time" + "/gauge-" + item.pm_id + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.restart_time + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + name + "-unstable_restarts" + "/gauge-" + item.pm_id + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.unstable_restarts + "\n");
        });

        setTimeout(collect, interval*1000);
    });
}

collect();
