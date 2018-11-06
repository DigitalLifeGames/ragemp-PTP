#Prerequisite
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install libstdc++6

# Downloading RageMP server
wget https://cdn.rage.mp/lin/ragemp-srv-036.tar.gz

# Extract the server files
tar -xzf ragemp-srv-036.tar.gz
rm ragemp-srv-036.tar.gz

# Set executable permission
chmod +x ./ragemp-srv/server

# Download latest ptp build
rm -rf ragemp-PTP
git clone https://github.com/DigitalLifeGames/ragemp-PTP.git

#Copy files over into ptp main folder
mkdir -p ragemp-srv/packages/ptp
mkdir -p ragemp-srv/client_packages
cp -a ./ragemp-PTP/packages/. ragemp-srv/packages
cp -a ./ragemp-PTP/client_packages/. ragemp-srv/client_packages
cp -a ./ragemp-PTP/package.json ./ragemp-srv/packages/ptp
cp -a ./ragemp-PTP/package-lock.json ./ragemp-srv/packages/ptp

cd ragemp-srv/packages/ptp
npm install

# Run the server
cd ../../
./server

