all: collectd-pm2-root


collectd-pm2-root: collectd-pm2-root.c
	gcc -O2 collectd-pm2-root.c -o collectd-pm2-root

clean:
	-rm collectd-pm2-root

install: collectd-pm2-root
	cp collectd-pm2.js /usr/local/bin &&\
	cp collectd-pm2-root /usr/local/bin &&\
	chown root:root /usr/local/bin/collectd-pm2-root &&\
	chmod 4755 /usr/local/bin/collectd-pm2-root

uninstall:
	-rm /usr/local/bin/collectd-pm2.js
	-rm /usr/local/bin/collectd-pm2-root
