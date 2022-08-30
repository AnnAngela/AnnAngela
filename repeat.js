"use strict";
const fs = require("fs");
const child_process = require("child_process");
const exec = (cmd) => new Promise((res, rej) => {
    child_process.exec(cmd, {
        cwd: "/workspaces/.codespaces/.persistedshare/dotfiles",
    }, (error, stdout, stderr) => {
        if (!error) {
            res(stdout.trim() || stderr.trim());
        } else {
            rej({
                error, stdout: stdout.trim(), stderr: stderr.trim(),
            });
        }
    });
});
fs.rmSync("/home/codespace/.nvm", {
    recursive: true,
    force: true,
});
fs.rmSync("/home/codespace/.nvs", {
    recursive: true,
    force: true,
});
for (const bashrc of ["/home/codespace/.bashrc", "/root/.bashrc"]) {
    fs.writeFileSync(bashrc, `${fs.readFileSync(bashrc, "utf-8").replace(/\n[^\n]*(?:NVM_DIR|NVS_HOME|N_PRESERVE_NPM)[^\n]*/g, "")}\nexport N_PRESERVE_NPM=1`);
}
exec("whereis n").then(async (output) => {
    if (output.length === 2) {
        console.info("Not initialize, initializing");
        await exec("wget https://raw.githubusercontent.com/tj/n/master/bin/n -O /tmp/n");
        await exec("sudo N_PRESERVE_NPM=0 bash /tmp/n lts");
        fs.rmSync("/tmp/n", {
            recursive: true,
            force: true,
        });
        await exec("sudo npm install npm n eslint --location=global");
        await exec("npm up --location=global");
    }
});