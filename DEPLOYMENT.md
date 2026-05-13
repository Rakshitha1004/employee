# AWS EC2 & Jenkins Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Employee Task Backend application to AWS EC2 using Jenkins CI/CD pipeline.

## Architecture

```
┌─────────────┐
│   GitHub    │
└──────┬──────┘
       │ (Webhook)
       ▼
┌─────────────────┐
│     Jenkins     │ (on EC2 or separate)
│   - Build       │
│   - Test        │
│   - Deploy      │
└────────┬────────┘
         │ (SSH/Docker)
         ▼
┌──────────────────────────┐
│  Application EC2         │
│  - Java Application      │
│  - MySQL Database        │
│  - React Frontend (opt.) │
└──────────────────────────┘
```

## Prerequisites

### AWS Account Setup

1. **Create AWS Account** - https://aws.amazon.com
2. **Create IAM User for Jenkins**
   - Console > IAM > Users > Create user
   - Attach policy: `AmazonEC2FullAccess`
   - Generate access keys
   - Save credentials securely

3. **Create EC2 Key Pair**
   - EC2 Dashboard > Key Pairs > Create key pair
   - Format: `.pem` (for Linux)
   - Download and save securely: `employee-app-key.pem`

### Local Prerequisites

- Git
- SSH client
- Text editor
- AWS CLI (optional)

## Step 1: Create EC2 Instances

### Instance 1: Application Server

```bash
# Launch instance
1. AWS Console > EC2 > Instances > Launch Instances
2. Choose AMI: Amazon Linux 2
3. Instance Type: t3.medium (or t3.small for dev)
4. Security Group:
   - Inbound rules:
     - SSH (22): Your IP
     - HTTP (80): Anywhere
     - HTTPS (443): Anywhere
     - Custom (4000): Anywhere (Backend)
     - Custom (3306): Jenkins SG (Database)
     - Custom (5173): Anywhere (Frontend)
5. Key Pair: employee-app-key
6. Launch

# Note the public IP/DNS
```

### Instance 2: Jenkins Server (Optional)

```bash
# Same process, but:
1. Instance Type: t3.medium
2. Security Group:
   - Inbound rules:
     - SSH (22): Your IP
     - HTTP (8080): Anywhere (Jenkins)
     - HTTPS (443): Anywhere
3. Key Pair: Same key pair
```

## Step 2: Configure Application Server

### Connect to Instance

```bash
# Make key readable
chmod 400 employee-app-key.pem

# SSH into instance
ssh -i employee-app-key.pem ec2-user@<ec2-public-ip>
```

### Run Setup Script

```bash
# Download setup script
curl -O https://raw.githubusercontent.com/your-repo/scripts/ec2-setup.sh

# Make executable
chmod +x ec2-setup.sh

# Run setup
./ec2-setup.sh

# This will install:
# - Java 21
# - Maven
# - Docker
# - Docker Compose
# - MySQL Client
# - Git
# - Create systemd service
```

### Configure Environment

```bash
# Create .env file
sudo nano /opt/application/.env

# Add configuration:
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=4000
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/employee_db
SPRING_DATASOURCE_USERNAME=employee
SPRING_DATASOURCE_PASSWORD=your-secure-password
APP_JWT_SECRET=your-very-long-random-secret-key
APP_FRONTEND_ORIGIN=http://your-domain.com

# Save: Ctrl+X, Y, Enter
```

### Setup MySQL

```bash
# Install MySQL Server
sudo yum install -y mysql-server

# Start MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure MySQL
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p << EOF
CREATE DATABASE employee_db;
CREATE USER 'employee'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee'@'localhost';
FLUSH PRIVILEGES;
EOF
```

## Step 3: Configure Jenkins Server

### Connect to Jenkins Instance

```bash
ssh -i employee-app-key.pem ec2-user@<jenkins-ip>
```

### Run Jenkins Setup

```bash
# Download setup script
curl -O https://raw.githubusercontent.com/your-repo/scripts/jenkins-setup.sh

# Make executable
chmod +x jenkins-setup.sh

# Run setup
./jenkins-setup.sh

# Note the initial admin password
```

### Initial Jenkins Configuration

1. **Access Jenkins**
   ```
   http://<jenkins-ip>:8080
   ```

2. **Complete Setup Wizard**
   - Enter initial admin password from console output
   - Install suggested plugins
   - Create admin user

3. **Install Additional Plugins**
   - Manage Jenkins > Manage Plugins
   - Available tab:
     - GitHub Integration
     - AWS Credentials
     - Docker Pipeline
     - SSH Agent
     - Timestamper
     - AnsiColor

4. **Configure AWS Credentials**
   ```
   Manage Jenkins > Manage Credentials > Global
   Add Credentials > AWS Credentials
   - Kind: AWS Credentials
   - Access Key ID: <from IAM user>
   - Secret Access Key: <from IAM user>
   - ID: aws-credentials
   ```

5. **Add EC2 Private Key**
   ```
   Add Credentials > SSH Username with private key
   - Username: ec2-user
   - Private Key: Paste content of employee-app-key.pem
   - ID: ec2-key
   ```

6. **Add Docker Credentials** (if using Docker registry)
   ```
   Add Credentials > Username/Password
   - Username: <docker-username>
   - Password: <docker-password>
   - ID: docker-credentials
   ```

## Step 4: Create Jenkins Pipeline

### Create Pipeline Job

1. **New Pipeline Job**
   ```
   Jenkins Dashboard > New Item
   - Item Name: employee-task-backend
   - Type: Pipeline
   - OK
   ```

2. **Configure Pipeline**
   ```
   Pipeline section:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/your-repo/employee.git
   - Credentials: (none for public repo, add for private)
   - Branch: */main
   - Script Path: Jenkinsfile
   ```

3. **Build Triggers**
   ```
   ☑ GitHub hook trigger for GITScm polling
   ```

4. **Save**

### Setup GitHub Webhook

1. **Go to Repository Settings**
   ```
   GitHub > Your Repo > Settings > Webhooks > Add webhook
   ```

2. **Configure Webhook**
   ```
   - Payload URL: http://jenkins-ip:8080/github-webhook/
   - Content Type: application/json
   - Events: Push, Pull requests
   - Active: ✓
   - Add webhook
   ```

## Step 5: Configure Jenkinsfile Parameters

Update `Jenkinsfile` with your values:

```groovy
environment {
    AWS_REGION = 'us-east-1'  // Your AWS region
    EC2_INSTANCE_IP = credentials('EC2_INSTANCE_IP')  // App server IP
    DOCKER_REPO = 'your-docker-repo'  // Docker Hub repo
    // ... other values
}
```

## Step 6: First Deployment

### Manual Trigger

1. **Go to Jenkins Job**
   ```
   Jenkins Dashboard > employee-task-backend
   ```

2. **Build with Parameters**
   ```
   Build with Parameters
   - DEPLOY_ENV: dev (or staging/production)
   - SKIP_TESTS: unchecked
   - Build
   ```

3. **Monitor Build**
   ```
   Watch Console Output for progress
   ```

### Verify Deployment

```bash
# SSH into application server
ssh -i employee-app-key.pem ec2-user@<app-server-ip>

# Check service status
sudo systemctl status employee-task-backend

# Check logs
sudo journalctl -u employee-task-backend -f

# Test API
curl http://localhost:4000/api/health
```

## Step 7: Production Deployment

### Pre-Production Checklist

- [ ] Database backups configured
- [ ] SSL/TLS certificates obtained
- [ ] Domain name configured
- [ ] Security groups properly configured
- [ ] Monitoring and alerts setup
- [ ] Application tested in staging
- [ ] Jenkins credentials secured
- [ ] EC2 instances hardened
- [ ] SSH access restricted
- [ ] AWS IAM policies least privilege

### Configure HTTPS (Optional but Recommended)

```bash
# SSH into app server
ssh -i employee-app-key.pem ec2-user@<app-server-ip>

# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Or use AWS Certificate Manager
# In EC2 Security Group, add:
# - HTTPS (443): Anywhere
```

### Setup Reverse Proxy (Nginx/Apache)

```bash
# Install Nginx
sudo yum install -y nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/employee-app.conf
```

```nginx
upstream backend {
    server localhost:4000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Troubleshooting

### Jenkins Can't Connect to EC2

```bash
# Check security group rules
# SSH from Jenkins to App should be allowed

# Test connectivity from Jenkins
curl -vvv ssh://ec2-user@app-server-ip
```

### Application Won't Start

```bash
# Check logs
sudo journalctl -u employee-task-backend -n 100

# Check if port is in use
sudo netstat -tulpn | grep :4000

# Check Java is installed
java -version
```

### Database Connection Failed

```bash
# Check MySQL is running
sudo systemctl status mysqld

# Test connection
mysql -u employee -p -h localhost employee_db

# Check user permissions
mysql -u root -p << EOF
SHOW GRANTS FOR 'employee'@'localhost';
EOF
```

### Jenkins Can't Push to Docker Registry

```bash
# Check Docker credentials in Jenkins
# Verify Docker is running on Jenkins server
docker ps

# Test Docker login locally
docker login -u <username> -p <password>
```

## Monitoring

### CloudWatch Setup

```bash
# Install CloudWatch Agent (from EC2 setup script)
# Configure CloudWatch metrics

# In AWS Console:
# CloudWatch > Dashboards > Create dashboard
# Add metrics for:
# - CPU Utilization
# - Memory Usage
# - Network I/O
# - Disk I/O
```

### Health Checks

```bash
# Application health endpoint
curl http://localhost:4000/api/health

# Response:
# {"status":"ok","timestamp":"2024-05-13T10:30:00"}
```

## Backup & Recovery

### Database Backup

```bash
# Automated daily backup
sudo crontab -e

# Add line:
0 2 * * * mysqldump -u employee -ppassword employee_db > /backups/employee_$(date +\%Y\%m\%d).sql
```

### Restore from Backup

```bash
mysql -u employee -p employee_db < /backups/employee_backup.sql
```

## Maintenance

### Update Application

```bash
# Jenkins will handle this automatically on git push

# Or manual:
cd /opt/application
sudo systemctl stop employee-task-backend
java -jar employee-task-backend-0.1.0.jar &
```

### Update System

```bash
# On EC2 instance
sudo yum update -y
sudo yum upgrade -y
```

### View Application Logs

```bash
# Real-time logs
sudo journalctl -u employee-task-backend -f

# Last 100 lines
sudo journalctl -u employee-task-backend -n 100

# Specific date
sudo journalctl -u employee-task-backend --since "2024-05-13"
```

## Security Best Practices

1. **Rotate SSH Keys**
   ```
   Regenerate EC2 key pairs periodically
   ```

2. **Security Groups**
   ```
   - Restrict SSH to your IP only
   - Restrict MySQL to internal/Jenkins only
   - Allow frontend/backend only where needed
   ```

3. **IAM Policies**
   ```
   - Use least privilege principle
   - Regularly audit permissions
   - Use temporary credentials
   ```

4. **SSL/TLS**
   ```
   - Use HTTPS in production
   - Update certificates before expiry
   ```

5. **Secrets Management**
   ```
   - Never commit secrets to git
   - Use AWS Secrets Manager
   - Rotate API keys regularly
   ```

## Scaling

### Load Balancing

```
1. Create AMI from current instance
2. Create launch template
3. Create Auto Scaling Group
4. Add Application Load Balancer
5. Configure target groups
```

### Database Scaling

```
1. RDS Multi-AZ setup
2. Read replicas for scaling
3. Parameter groups optimization
```

## Cost Optimization

- Use t3 instances instead of t2 (more cost-effective)
- Set up AWS Budgets for alerts
- Use Reserved Instances for long-term
- Automated shutdown for non-production
- Optimize storage with S3

## Support & References

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Docker Documentation](https://docs.docker.com/)
