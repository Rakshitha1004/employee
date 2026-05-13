#!/bin/bash

# AWS EC2 Setup Script for Employee Task Backend
# This script sets up a fresh EC2 instance with all required dependencies

set -e

echo "=================================================="
echo "Employee Task Backend - AWS EC2 Setup"
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Java 21
echo "☕ Installing Java 21..."
sudo yum install -y java-21-amazon-corretto-devel

# Install Maven
echo "🔨 Installing Maven..."
sudo yum install -y maven

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install MySQL Client
echo "💾 Installing MySQL Client..."
sudo yum install -y mysql

# Install Git
echo "📂 Installing Git..."
sudo yum install -y git

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/application
sudo chown ec2-user:ec2-user /opt/application

# Create systemd service for the application
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/employee-task-backend.service > /dev/null <<EOF
[Unit]
Description=Employee Task Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/application
ExecStart=/usr/bin/java -jar employee-task-backend-0.1.0.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# Create log directory
echo "📝 Creating log directory..."
sudo mkdir -p /var/log/employee-task-backend
sudo chown ec2-user:ec2-user /var/log/employee-task-backend

# Install CloudWatch agent (optional)
echo "📊 Installing CloudWatch agent..."
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

echo "✅ EC2 setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone <your-repo-url>"
echo "2. Copy .env file with database credentials"
echo "3. Build the application: mvn clean package"
echo "4. Deploy the JAR to /opt/application/"
echo "5. Start the service: sudo systemctl start employee-task-backend"
echo "6. Check status: sudo systemctl status employee-task-backend"
