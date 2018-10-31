# Installation
This process will install rage-mp and all required dependencies.
```
#Prerequisite
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install libstdc++6

# Downloading server
wget https://cdn.rage.mp/lin/ragemp-srv-036.tar.gz</code>

# Extract the server files
tar -xzf ragemp-srv-036.tar.gz

# accessing the directory
cd ragemp-srv

# Set executable permission
chmod +x server
```


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
All tests should be ran and pass before build rollouts or any code moves.
```
npm test
```
