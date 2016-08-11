var os = require('os');
var exec = require('child_process').exec;


var hostname = process.env.COLLECTD_HOSTNAME || os.hostname();
var interval = parseInt(process.env.COLLECTD_INTERVAL, 10) || 60;

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
        var oldname = '';
        var pidnumber = 1;

        list.forEach(function (item) {
            var name = '';
            for(var i = 0, n = item.name.length; i < n; ++i) {
                name += item.name[i].match(/^[0-9a-zA-Z]+$/) ? item.name[i] : '_';
            }
            
            // Increase number of pid per application, easier to process than pid defined by pm2
            if (oldname != name) {
                oldname = name;
            }
            else {
                pidnumber = pidnumber + 1;
            }

            process.stdout.write("PUTVAL \"" + hostname + "/" + "nodejs-" + name + "/delay-" + "loop_delay-pid_" + pidnumber + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.axm_monitor["Loop delay"].value.replace('ms', '') + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + "nodejs-" + name + "/memory-" + "memory_used-pid_" + pidnumber + "\" interval=" + interval + " " + timestamp + ":" + item.monit.memory + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + "nodejs-" + name + "/vcpu-" + "cpu_used-pid_" + pidnumber + "\" interval=" + interval + " " + timestamp + ":" + item.monit.cpu + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + "nodejs-" + name + "/counter-" + "restarts-pid_" + pidnumber + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.restart_time + "\n");
            process.stdout.write("PUTVAL \"" + hostname + "/" + "nodejs-" + name + "/gauge-" + "unstable_restarts-pid_" + pidnumber + "\" interval=" + interval + " " + timestamp + ":" + item.pm2_env.unstable_restarts + "\n");
        });

        setTimeout(collect, interval*1000);
    });
}

collect();
