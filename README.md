# collectd-pm2

collectd-pm2 using [collectd](https://collectd.org/) to gather statistics of Node.js applications managed by [PM2](http://pm2.keymetrics.io).

## Supported metrics ##

### Memory used ###

### CPU used ###

### Loop delay ###

### Restart times ###

### Unstable restarts ###

## PM2 run with non-root user ##

### Configuration collectd ###

    cp collectd-pm2.js /usr/local/bin

Assume you start pm2 daemon with user "pm2" group "pm2", edit your collectd.conf file:

     LoadPlugin exec
 
     <Plugin exec>
         Exec "pm2:pm2" "node" "/usr/local/bin/collectd-pm2.js"
     </Plugin>

## PM2 run with root user ##

Because collectd exec plugin disallow executed with "root" user, see [man 5 collectd-exec](https://collectd.org/documentation/manpages/collectd-exec.5.shtml)

    CAVEATS
        ·   The user, the binary is executed as, may not have root privileges, i. e.  must have an UID that is non-zero. This is for your own good.

There is a optional program to bypass it.

### Build and install ###

    make
    make install

### Configuration collectd ###

     LoadPlugin exec
 
     <Plugin exec>
         Exec "nobody:nobody" "/usr/local/bin/collectd-pm2-root"
     </Plugin>
