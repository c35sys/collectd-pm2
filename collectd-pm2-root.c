#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdlib.h>
#include <signal.h>
#include <string.h>


int main(int argc, char* argv[]) {
    if (setuid(0) == -1 || setgid(0) == -1) {
        perror("setuid or setgid to root user error");
        fprintf(stderr, "\npermit setuid and setgid to root user: \n\tchown root:root %s\n\tchmod 4755 %s\n", argv[0], argv[0]);
        return EXIT_FAILURE;
    }

    return system("/bin/bash -c 'export PM2_HOME=${PM2_HOME:-~root/.pm2}; node /usr/local/bin/collectd-pm2.js'");
}
