# Spring Boot Backend - Quick Start Guide

## Project Overview

This is a Spring Boot 3.2.5 application using Java 21, MySQL database, and JWT authentication for the Employee Task & Workflow Management System.

## Prerequisites

- Java 21 JDK
- Maven 3.8+
- MySQL 8.0+
- Git

## Quick Start - Local Development

### Option 1: Using Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

- Backend API: http://localhost:4000
- MySQL: localhost:3306
- Database: employee_db
- MySQL User: employee / employee123

### Option 2: Manual Setup

#### 1. Start MySQL

```bash
# macOS (with Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysqld

# Windows
net start MySQL80
```

#### 2. Create Database

```bash
mysql -u root -p << EOF
CREATE DATABASE employee_db;
CREATE USER 'employee'@'localhost' IDENTIFIED BY 'employee123';
GRANT ALL PRIVILEGES ON employee_db.* TO 'employee'@'localhost';
FLUSH PRIVILEGES;
EOF
```

#### 3. Build and Run

```bash
# From backend directory
mvn clean install

# Run application
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/employee-task-backend-0.1.0.jar
```

Backend will be available at: http://localhost:4000

## Default Credentials

```
Admin:
  Email: admin@corp.com
  Password: Admin123!

Manager:
  Email: manager@corp.com
  Password: Manager123!

Employee:
  Email: employee@corp.com
  Password: Employee123!
```

## API Endpoints

### Authentication
```
POST /api/auth/login
  Body: { "email": "admin@corp.com", "password": "Admin123!" }
  Response: { "token": "jwt-token", "user": {...} }

GET /api/auth/me (requires JWT token)
  Header: Authorization: Bearer <token>
```

### Projects
```
GET /api/projects
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}
GET /api/projects/{id}
```

### Tasks
```
GET /api/tasks
POST /api/tasks
PUT /api/tasks/{id}
DELETE /api/tasks/{id}
GET /api/tasks/{id}
GET /api/tasks/project/{projectId}
```

### Workflows
```
GET /api/workflows
POST /api/workflows
PUT /api/workflows/{id}
DELETE /api/workflows/{id}
GET /api/workflows/{id}
GET /api/workflows/project/{projectId}
```

### Health
```
GET /api/health
```

## Environment Configuration

Create `application-dev.yml` for development overrides:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/employee_db_dev
    username: root
    password: your_password

app:
  jwt:
    secret: your-dev-secret-key
```

## Development Commands

### Build Project
```bash
mvn clean install
```

### Run Tests
```bash
mvn test
```

### Run with Debug
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

### Build JAR
```bash
mvn clean package
```

### Run JAR
```bash
java -jar target/employee-task-backend-0.1.0.jar
```

### View Logs
```bash
# Docker
docker-compose logs -f backend

# Or if running directly
tail -f logs/application.log
```

## Project Structure

```
src/main/java/com/employee/
├── EmployeeApplication.java       # Main class
├── config/
│   ├── DataInitializationConfig.java    # Seed data
│   ├── SecurityConfig.java              # Spring Security
│   └── WebMvcConfig.java               # CORS configuration
├── controller/
│   ├── AuthController.java
│   ├── ProjectController.java
│   ├── TaskController.java
│   ├── WorkflowController.java
│   └── HealthController.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── UserResponse.java
│   ├── ProjectResponse.java
│   ├── TaskResponse.java
│   └── WorkflowResponse.java
├── entity/
│   ├── User.java
│   ├── Project.java
│   ├── Task.java
│   └── Workflow.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
├── repository/
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   ├── TaskRepository.java
│   └── WorkflowRepository.java
├── security/
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
└── service/
    ├── AuthService.java
    ├── ProjectService.java
    ├── TaskService.java
    └── WorkflowService.java

src/main/resources/
└── application.yml                # Main configuration
```

## Testing API with curl

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@corp.com","password":"Admin123!"}'
```

### Get Current User (replace TOKEN with actual JWT)
```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Get All Projects
```bash
curl http://localhost:4000/api/projects
```

### Create Project (requires auth)
```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Description",
    "ownerId": "u2",
    "status": "ACTIVE"
  }'
```

## Database Management

### Access MySQL CLI
```bash
mysql -u employee -p employee_db
```

### View Users
```sql
SELECT id, name, email, role FROM users;
```

### View All Tasks
```sql
SELECT * FROM tasks;
```

## Troubleshooting

### Port 4000 Already in Use
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check MySQL is running
sudo systemctl status mysqld

# Test connection
mysql -h localhost -u employee -p -e "SELECT 1"
```

### Application Won't Start
```bash
# Check Java version
java -version

# Check logs for detailed error
tail -f /var/log/employee-app.log

# Or view Docker logs
docker-compose logs backend
```

### JWT Token Expired
- Tokens expire after 24 hours
- Login again to get new token
- Update `APP_JWT_EXPIRATION` to change expiry time (in milliseconds)

## IDE Setup (IntelliJ IDEA)

1. Open Project > Settings > Maven > Runner
2. Check "Delegate IDE build/run actions to Maven"
3. Run > Edit Configurations > Add new Spring Boot configuration
4. Main class: `com.employee.EmployeeApplication`
5. VM options: `-Dspring.profiles.active=dev`

## Performance Tips

- Use indexes on frequently queried columns
- Enable connection pooling (HikariCP - default in Spring Boot)
- Use pagination for large result sets
- Cache static data when applicable

## Security Notes

- JWT tokens are signed and validated on every request
- Passwords are hashed with BCrypt
- CORS is configured to only allow frontend origin
- All endpoints except login and health require authentication

## Next Steps

1. Test the API endpoints with Postman or curl
2. Integrate with frontend React application
3. Setup AWS deployment (see DEPLOYMENT.md)
4. Configure CI/CD pipeline (see Jenkinsfile)
5. Setup database backups
6. Configure logging and monitoring

## Support

For issues or questions:
1. Check application logs: `docker-compose logs -f backend`
2. Review error messages in console
3. Verify database connectivity
4. Check configuration in application.yml
5. Review DEPLOYMENT.md for AWS/Jenkins issues

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT Guide](https://jwt.io/introduction)
