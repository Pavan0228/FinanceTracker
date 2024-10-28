#!/bin/bash

# Navigate to the project directory

# Pull the latest code from the main branch
git pull origin main

cd Backend

npm i

# Restart the application using PM2
pm2 restart 0  # Replace 'index' with your PM2 process name

sudo systemctl restart nginx
