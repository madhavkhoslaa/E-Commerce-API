#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

sudo yum erase codedeploy-agent
sudo rm -rf /opt/codedeploy-agent
sudo ./install auto

#create our working directory if it doesnt exist
DIR="/home/ec2-user/E-Commerce"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi