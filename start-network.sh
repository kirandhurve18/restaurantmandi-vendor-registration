#!/bin/bash

# Get the local IP address
LOCAL_IP=$(ipconfig getifaddr en0)

echo "🚀 Starting Angular app for network access..."
echo "📱 Local URL: http://localhost:4200"
echo "🌐 Network URL: http://$LOCAL_IP:4200"
echo "📲 Share this network URL with mobile devices on the same WiFi"
echo ""

# Start the Angular development server
ng serve --host 0.0.0.0 --port 4200 --disable-host-check

