# Installation
This process will install rage-mp, all required dependencies, aswell as the latest build of PTP.
```
#Prerequisite
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install libstdc++6

# Downloading RageMP server
wget https://cdn.rage.mp/lin/ragemp-srv-036.tar.gz</code>

# Extract the server files
tar -xzf ragemp-srv-036.tar.gz

# accessing the directory
cd ragemp-srv

# Set executable permission
chmod +x server

# Download latest ptp build
git clone https://github.com/DigitalLifeGames/ragemp-PTP.git
```

# Install PTP dependencies
cd packages/ptp
npm install
echo "PTP installed successfully."

# Run the server
This will run an instance of the rage-mp server.
```
./server
```

# Setting up Development Environment
```
npm install
```


# Running Tests
First do npm install to set up development evironment
```
npm install
```

All tests should be ran and pass before build rollouts or any code moves.
```
npm test
npm run mock-server
```
