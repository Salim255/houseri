pipeline {
    agent any

    environment {
        CLIENT_IMAGE = "crawan/housori-client"
        SERVER_IMAGE = "crawan/housori-server"

        CLIENT_DIR = "housori"
        SERVER_DIR = "server"
    }

    stages {

        /***********************************
         * 1. CHECKOUT
         ***********************************/
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        /***********************************
         * 2. DETECT CHANGES
         ***********************************/
        stage('Detect Changes') {
            steps {
                script {

                    echo "🔍 Detecting changes..."

                    def changes = sh(
                        script: "git diff --name-only HEAD~1 HEAD || true",
                        returnStdout: true
                    ).trim()

                    echo "Changed files:\n${changes}"

                    def CLIENT_CHANGED = changes.contains("${CLIENT_DIR}/")
                    def SERVER_CHANGED = changes.contains("${SERVER_DIR}/")

                    env.CLIENT_CHANGED = CLIENT_CHANGED.toString()
                    env.SERVER_CHANGED = SERVER_CHANGED.toString()

                    echo "Client changed → ${CLIENT_CHANGED}"
                    echo "Server changed → ${SERVER_CHANGED}"
                }
            }
        }

        /***********************************
         * 3. BUILD CLIENT
         ***********************************/
        stage('Build Housori Client') {
            when {
                expression { env.CLIENT_CHANGED == "true" }
            }
            steps {
                echo "🚀 Building CLIENT image..."

                sh """
                    cd ${CLIENT_DIR}
                    docker build \
                        -t ${CLIENT_IMAGE}:${BUILD_NUMBER} \
                        -t ${CLIENT_IMAGE}:latest \
                        .
                """
            }
        }

        /***********************************
         * 4. BUILD SERVER
         ***********************************/
        stage('Build Housori Server') {
            when {
                expression { env.SERVER_CHANGED == "true" }
            }
            steps {
                echo "🚀 Building SERVER image..."

                withCredentials([file(credentialsId: 'houseri-server-env', variable: 'BACKEND_ENV')]) {
                    sh '''
                        echo "Injecting backend .env..."
                        cat "$BACKEND_ENV" > server/.env
                        chmod 600 server/.env
                    '''
                }

                sh """
                    cd ${SERVER_DIR}
                    docker build \
                        -t ${SERVER_IMAGE}:${BUILD_NUMBER} \
                        -t ${SERVER_IMAGE}:latest \
                        .
                """
            }
        }

        /***********************************
         * 5. DOCKER LOGIN
         ***********************************/
        stage('Docker Login') {
            when {
                expression {
                    env.CLIENT_CHANGED == "true" || env.SERVER_CHANGED == "true"
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        /***********************************
         * 6. PUSH IMAGES
         ***********************************/
        stage('Push Images') {
            when {
                expression {
                    env.CLIENT_CHANGED == "true" || env.SERVER_CHANGED == "true"
                }
            }
            steps {
                script {

                    if (env.CLIENT_CHANGED == "true") {
                        echo "📤 Pushing CLIENT image..."
                        sh """
                            docker push ${CLIENT_IMAGE}:${BUILD_NUMBER}
                            docker push ${CLIENT_IMAGE}:latest
                        """
                    }

                    if (env.SERVER_CHANGED == "true") {
                        echo "📤 Pushing SERVER image..."
                        sh """
                            docker push ${SERVER_IMAGE}:${BUILD_NUMBER}
                            docker push ${SERVER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        /***********************************
         * 7. DEPLOY (PULL ONLY)
         ***********************************/
        stage('Deploy with Docker Compose') {
            steps {
                echo "📦 Deploying with docker-compose..."

                sh """
                    docker-compose pull
                    docker-compose up -d
                """
            }
        }
    }

    /***********************************
     * POST
     ***********************************/
    post {
        always {
            echo "🧹 Cleaning Docker..."
            sh "docker system prune -af || true"
        }

        success {
            echo "✅ Deployment successful"
        }

        failure {
            echo "❌ Deployment failed"
        }
    }
}