# Employee Task & Workflow Management System

A full-stack enterprise-grade web application for managing employees, projects, tasks, sprint workflows, and team productivity.

## 🎯 Features

- **Role-based Access**: Admin, Manager, Employee
- **Employee Directory**: Manage team members and project ownership
- **Task Management**: Create, assign, and track task status with priority levels
- **Workflow Management**: Sprint planning, review gates, and deployment workflows
- **Authentication**: JWT-based secure authentication
- **RESTful API**: Comprehensive API endpoints for all operations
- **Database**: MySQL with JPA/Hibernate ORM
- **Modern UI**: React frontend with TypeScript
- **CI/CD**: Jenkins integration for automated deployment
- **Cloud Ready**: AWS EC2 and Docker support

## 🏗️ Architecture

### Backend Stack
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with CORS support

### Frontend Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS

### Deployment
- **CI/CD**: Jenkins
- **Cloud**: AWS EC2
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose / Kubernetes ready

## 📋 Prerequisites

### Local Development
- Java 21+ (JDK)
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+ (for frontend)
- Docker & Docker Compose (optional)

### AWS Deployment
- AWS Account with EC2 access
- Jenkins server (can be hosted on EC2)
- SSH key pair for EC2 instances
- Security groups configured for ports 22, 80, 443, 4000, 3306

## 🚀 Getting Started

### 1. Local Development Setup

#### Option A: Docker Compose (Recommended)

```bash
# Copy environment file
cp .env.example .env

# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f backend
```

Application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Database**: localhost:3306

#### Option B: Manual Setup

```bash
# Start MySQL (ensure it's running on localhost:3306)

# Backend Setup
cd backend
mvn clean install
mvn spring-boot:run

# Frontend Setup (in another terminal)
cd frontend
npm install
npm run dev
```

### 2. Default Login Credentials

```
Admin Account:
- Email: admin@corp.com
- Password: Admin123!

Manager Account:
- Email: manager@corp.com
- Password: Manager123!

Employee Account:
- Email: employee@corp.com
- Password: Employee123!
```

### 3. API Endpoints

#### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires auth)

#### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create project (requires auth)
- `PUT /api/projects/{id}` - Update project (requires auth)
- `DELETE /api/projects/{id}` - Delete project (requires auth)

#### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/{id}` - Get task details
- `GET /api/tasks/project/{projectId}` - Get tasks by project
- `POST /api/tasks` - Create task (requires auth)
- `PUT /api/tasks/{id}` - Update task (requires auth)
- `DELETE /api/tasks/{id}` - Delete task (requires auth)

#### Workflows
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/{id}` - Get workflow details
- `GET /api/workflows/project/{projectId}` - Get workflows by project
- `POST /api/workflows` - Create workflow (requires auth)
- `PUT /api/workflows/{id}` - Update workflow (requires auth)
- `DELETE /api/workflows/{id}` - Delete workflow (requires auth)

#### Health
- `GET /api/health` - Application health check

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t employee-task-backend:latest backend/
```

### Run with Docker Compose

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ AWS EC2 Deployment with Jenkins

### Step 1: Prepare AWS Infrastructure

```bash
# 1. Create EC2 instance (Amazon Linux 2)
# 2. Create security group with inbound rules:
#    - Port 22 (SSH)
#    - Port 4000 (Backend)
#    - Port 3306 (MySQL)
#    - Port 5173 (Frontend)

# 3. Create or use existing key pair
# 4. Note the Elastic IP / Public DNS
```

### Step 2: Setup EC2 Instance

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Run setup script
curl -O https://your-repo/scripts/ec2-setup.sh
bash ec2-setup.sh

# Create .env file with your configuration
nano /opt/application/.env
```

### Step 3: Setup Jenkins

#### Option A: On separate EC2 instance
```bash
ssh -i your-key.pem ec2-user@jenkins-ec2-ip
curl -O https://your-repo/scripts/jenkins-setup.sh
bash jenkins-setup.sh
```

#### Option B: On same EC2 instance
```bash
bash /home/ec2-user/scripts/jenkins-setup.sh
```

### Step 4: Configure Jenkins

1. **Access Jenkins**
   ```
   http://jenkins-ec2-ip:8080
   ```

2. **Install Plugins**
   - GitHub Integration
   - AWS Credentials
   - Docker Pipeline
   - SSH Agent
   - Timestamper

3. **Add Credentials in Jenkins**
   - AWS Access Key & Secret Key
   - GitHub SSH Key
   - EC2 Private Key
   - Docker Registry Credentials

4. **Create Pipeline Job**
   - New Item > Pipeline
   - Name: `employee-task-backend`
   - Pipeline > Definition: `Pipeline script from SCM`
   - SCM: Git
   - Repository URL: `https://your-repo.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

### Step 5: Deploy

1. **Manual Trigger**
   - Go to Jenkins job
   - Click "Build with Parameters"
   - Select environment (dev/staging/production)
   - Click "Build"

2. **Automated Trigger (GitHub Webhook)**
   - Configure webhook in GitHub
   - Payload URL: `http://jenkins-url:8080/github-webhook/`
   - Events: Push, Pull requests
   - Active: ✓

## 📦 Build & Deployment Commands

### Maven Build
```bash
cd backend

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Build JAR
mvn clean package

# Build with tests
mvn clean package -DskipTests

# Run locally
mvn spring-boot:run
```

### Deployment Manual Steps
```bash
# Build application
mvn clean package

# Copy to EC2
scp -i your-key.pem target/employee-task-backend-0.1.0.jar ec2-user@your-ec2-ip:/opt/application/

# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Start application
java -jar /opt/application/employee-task-backend-0.1.0.jar

# Or use systemd service
sudo systemctl start employee-task-backend
sudo systemctl status employee-task-backend
```

## 🔧 Configuration

### Environment Variables (.env file)

```properties
# Spring Boot
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=4000

# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/employee_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
SPRING_JPA_HIBERNATE_DDL_AUTO=create-drop

# JWT
APP_JWT_SECRET=your-secret-key-here
APP_JWT_EXPIRATION=86400000

# CORS
APP_FRONTEND_ORIGIN=http://localhost:5173
```

## 📊 Monitoring

### Application Logs
```bash
# Docker
docker-compose logs -f backend

# Systemd
sudo journalctl -u employee-task-backend -f

# Direct file
tail -f /var/log/employee-task-backend/*.log
```

### Health Check
```bash
curl http://localhost:4000/api/health
```

### Database Connection Check
```bash
mysql -h localhost -u root -p employee_db
```

## 🔐 Security

- **Authentication**: JWT-based with 24-hour expiration
- **CORS**: Configured for specific frontend origin
- **Password**: BCrypt hashing for user passwords
- **Validation**: Request input validation on all endpoints
- **HTTPS**: Configure in production with SSL/TLS

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run with coverage
mvn clean test jacoco:report
```

## 📈 Performance Optimization

### Production Recommendations
1. Enable GZIP compression
2. Use connection pooling (HikariCP)
3. Enable query caching
4. Use CDN for static frontend assets
5. Implement rate limiting
6. Use load balancer (AWS ELB)

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_project_owner ON projects(ownerId);
CREATE INDEX idx_task_project ON tasks(projectId);
CREATE INDEX idx_task_assignee ON tasks(assigneeId);
CREATE INDEX idx_workflow_project ON workflows(projectId);
CREATE INDEX idx_user_email ON users(email);
```

## 🐛 Troubleshooting

### MySQL Connection Issues
```bash
# Check MySQL is running
sudo systemctl status mysqld

# Test connection
mysql -h localhost -u root -p -e "SELECT 1"

# Check JDBC URL format
jdbc:mysql://host:port/database?createDatabaseIfNotExist=true
```

### Port Already in Use
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>
```

### JWT Token Expired
- Tokens expire after 24 hours
- Login again to get new token
- Update `APP_JWT_EXPIRATION` in configuration if needed

### Application Won't Start
```bash
# Check Java version
java -version

# Check logs for errors
docker-compose logs backend

# Or
tail -f /var/log/employee-task-backend/error.log
```

## 📚 Project Structure

```
employee/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/employee/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA entities
│   │   ├── exception/                # Exception handlers
│   │   ├── repository/               # Data access layer
│   │   ├── security/                 # JWT & security
│   │   ├── service/                  # Business logic
│   │   └── EmployeeApplication.java  # Main class
│   ├── src/main/resources/
│   │   └── application.yml           # Configuration
│   ├── pom.xml                       # Maven configuration
│   └── Dockerfile                    # Container image
├── frontend/                          # React Application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── scripts/
│   ├── ec2-setup.sh                  # EC2 setup script
│   └── jenkins-setup.sh              # Jenkins setup script
├── Jenkinsfile                        # CI/CD pipeline
├── docker-compose.yml                # Development compose
├── docker-compose.prod.yml           # Production compose
└── README.md                          # This file
```

## 📝 Database Schema

### Users
- id (UUID)
- name
- email (unique)
- password (hashed)
- role (ADMIN/MANAGER/EMPLOYEE)
- team

### Projects
- id (UUID)
- name
- description
- ownerId (foreign key to Users)
- status (PLANNED/ACTIVE/COMPLETED)

### Tasks
- id (UUID)
- title
- description
- projectId (foreign key to Projects)
- assigneeId (foreign key to Users)
- status (BACKLOG/IN_PROGRESS/REVIEW/DONE)
- priority (LOW/MEDIUM/HIGH)

### Workflows
- id (UUID)
- name
- description
- phase (IDEATION/SPRINT/REVIEW/DEPLOYMENT)
- projectId (foreign key to Projects)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team
- Check documentation in `/docs` folder

## 🎉 Deployment Checklist

- [ ] Database created and configured
- [ ] JWT secret key configured in production
- [ ] Frontend origin correctly set in CORS
- [ ] SSL/TLS certificates configured (production)
- [ ] Backups configured for database
- [ ] Monitoring and logging enabled
- [ ] Security groups configured correctly
- [ ] Domain name configured (if applicable)
- [ ] CI/CD pipeline tested
- [ ] Health checks passing
- [ ] Application responding to API calls
- [ ] Frontend accessible and functional
