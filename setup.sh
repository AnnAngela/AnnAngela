DEBIAN_FRONTEND=noninteractive DEBIAN_PRIORITY=critical apt install -y -o "Dpkg::Options::=--force-confold" --no-install-recommends curl wget ca-certificates nano git libpam-systemd-
wget https://raw.githubusercontent.com/tj/n/master/bin/n -O /tmp/n
bash /tmp/n lts
rm /tmp/n
npm install npm n --location=global
