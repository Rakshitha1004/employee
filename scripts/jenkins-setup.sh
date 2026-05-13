#!/bin/bash

# Jenkins Setup Script for AWS EC2
# This script configures Jenkins with necessary plugins and credentials

set -e

echo "=================================================="
echo "Jenkins Setup for Employee Task Backend CI/CD"
echo "=================================================="

# Install Jenkins
echo "📦 Installing Jenkins..."
sudo yum install -y java-11-amazon-corretto-devel
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum upgrade -y
sudo yum install -y jenkins

# Start Jenkins
echo "▶️ Starting Jenkins..."
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Install Maven
echo "🔨 Installing Maven..."
sudo yum install -y maven

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker jenkins

# Install Git
echo "📂 Installing Git..."
sudo yum install -y git

# Get Jenkins initial admin password
echo ""
echo "✅ Jenkins installed successfully!"
echo ""
echo "📝 Initial Admin Password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo ""
echo "🌐 Access Jenkins at: http://$(hostname -I):8080"
echo ""
echo "Next steps:"
echo "1. Complete Jenkins initial setup"
echo "2. Install required plugins:"
echo "   - GitHub Integration"
echo "   - AWS Credentials"
echo "   - Docker plugin"
echo "   - SSH Agent"
echo "3. Configure AWS credentials in Jenkins"
echo "4. Create a new pipeline job from Jenkinsfile"
