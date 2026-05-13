pipeline {
    agent any

    environment {
        // AWS Configuration
        AWS_REGION = 'us-east-1'
        EC2_INSTANCE_IP = credentials('EC2_INSTANCE_IP')
        EC2_USER = 'ec2-user'
        EC2_PRIVATE_KEY = credentials('EC2_PRIVATE_KEY')
        
        // Application Configuration
        APP_NAME = 'employee-task-backend'
        BUILD_PATH = 'backend'
        ARTIFACT_NAME = "${APP_NAME}-0.1.0.jar"
        DEPLOY_PATH = '/opt/application'
        SERVICE_PORT = '4000'
        
        // Docker Configuration (optional)
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = credentials('DOCKER_REPO')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
    }

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['dev', 'staging', 'production'],
            description: 'Deployment environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip running unit tests'
        )
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🏗️  Building Spring Boot application with Maven...'
                dir("${BUILD_PATH}") {
                    sh '''
                        echo "Java version:"
                        java -version
                        echo "Maven version:"
                        mvn -version
                        echo "Building application..."
                        mvn clean package -DskipTests
                    '''
                }
            }
        }

        stage('Test') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                echo '🧪 Running unit tests...'
                dir("${BUILD_PATH}") {
                    sh '''
                        mvn test
                    '''
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo '🔍 Running code quality checks...'
                dir("${BUILD_PATH}") {
                    sh '''
                        echo "Code quality checks can be added here (SonarQube, etc.)"
                        mvn verify -DskipTests
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { params.DEPLOY_ENV == 'production' }
            }
            steps {
                echo '🐳 Building Docker image...'
                dir("${BUILD_PATH}") {
                    sh '''
                        docker build -t ${DOCKER_REPO}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_REPO}:${BUILD_NUMBER} ${DOCKER_REPO}:latest
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            when {
                expression { params.DEPLOY_ENV == 'production' }
            }
            steps {
                echo '📤 Pushing Docker image to registry...'
                sh '''
                    echo "${DOCKER_CREDENTIALS_PSW}" | docker login -u "${DOCKER_CREDENTIALS_USR}" --password-stdin
                    docker push ${DOCKER_REPO}:${BUILD_NUMBER}
                    docker push ${DOCKER_REPO}:latest
                '''
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                echo "🚀 Deploying to AWS EC2 (${params.DEPLOY_ENV})..."
                sh '''
                    # Create SSH config for EC2
                    mkdir -p ~/.ssh
                    echo "${EC2_PRIVATE_KEY}" > ~/.ssh/ec2-key.pem
                    chmod 600 ~/.ssh/ec2-key.pem
                    
                    # Add EC2 to known_hosts
                    ssh-keyscan -H ${EC2_INSTANCE_IP} >> ~/.ssh/known_hosts 2>/dev/null || true
                    
                    # Deploy JAR to EC2
                    echo "Copying JAR file to EC2..."
                    scp -i ~/.ssh/ec2-key.pem \
                        ${BUILD_PATH}/target/${ARTIFACT_NAME} \
                        ${EC2_USER}@${EC2_INSTANCE_IP}:${DEPLOY_PATH}/
                    
                    echo "Stopping old application..."
                    ssh -i ~/.ssh/ec2-key.pem ${EC2_USER}@${EC2_INSTANCE_IP} << 'ENDSSH'
                        set +e
                        sudo systemctl stop ${APP_NAME} || true
                        pkill -f "java -jar.*${ARTIFACT_NAME}" || true
                        set -e
                    ENDSSH
                    
                    echo "Starting new application..."
                    ssh -i ~/.ssh/ec2-key.pem ${EC2_USER}@${EC2_INSTANCE_IP} << 'ENDSSH'
                        cd ${DEPLOY_PATH}
                        
                        # Set environment variables based on deployment environment
                        export SPRING_PROFILES_ACTIVE=${DEPLOY_ENV}
                        
                        # Start application with nohup
                        nohup java -jar ${ARTIFACT_NAME} \
                            --server.port=${SERVICE_PORT} \
                            --app.frontend.origin=http://localhost:5173 \
                            > ${APP_NAME}.log 2>&1 &
                        
                        echo "Application started with PID: $!"
                    ENDSSH
                    
                    # Cleanup
                    rm -f ~/.ssh/ec2-key.pem
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '✅ Performing health checks...'
                sh '''
                    mkdir -p ~/.ssh
                    echo "${EC2_PRIVATE_KEY}" > ~/.ssh/ec2-key.pem
                    chmod 600 ~/.ssh/ec2-key.pem
                    ssh-keyscan -H ${EC2_INSTANCE_IP} >> ~/.ssh/known_hosts 2>/dev/null || true
                    
                    # Wait for application to start
                    sleep 10
                    
                    # Check application health
                    echo "Checking application health..."
                    ssh -i ~/.ssh/ec2-key.pem ${EC2_USER}@${EC2_INSTANCE_IP} << 'ENDSSH'
                        for i in {1..30}; do
                            if curl -s http://localhost:${SERVICE_PORT}/api/health | grep -q "ok"; then
                                echo "✅ Application is healthy!"
                                exit 0
                            fi
                            echo "Waiting for application to be ready... ($i/30)"
                            sleep 2
                        done
                        echo "❌ Application health check failed!"
                        exit 1
                    ENDSSH
                    
                    rm -f ~/.ssh/ec2-key.pem
                '''
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { params.DEPLOY_ENV == 'production' }
            }
            steps {
                echo '🌐 Deploying React frontend...'
                sh '''
                    mkdir -p ~/.ssh
                    echo "${EC2_PRIVATE_KEY}" > ~/.ssh/ec2-key.pem
                    chmod 600 ~/.ssh/ec2-key.pem
                    ssh-keyscan -H ${EC2_INSTANCE_IP} >> ~/.ssh/known_hosts 2>/dev/null || true
                    
                    # Deploy frontend build
                    ssh -i ~/.ssh/ec2-key.pem ${EC2_USER}@${EC2_INSTANCE_IP} << 'ENDSSH'
                        cd /opt/application
                        if [ -d "frontend" ]; then
                            rm -rf frontend
                        fi
                        mkdir -p frontend
                    ENDSSH
                    
                    scp -r -i ~/.ssh/ec2-key.pem \
                        frontend/dist/* \
                        ${EC2_USER}@${EC2_INSTANCE_IP}:/opt/application/frontend/
                    
                    rm -f ~/.ssh/ec2-key.pem
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
            // Add notification (email, Slack, etc.)
        }
        failure {
            echo '❌ Deployment failed!'
            // Add notification (email, Slack, etc.)
        }
        always {
            echo '🧹 Cleaning up...'
            sh '''
                rm -f ~/.ssh/ec2-key.pem
            '''
            cleanWs()
        }
    }
}
