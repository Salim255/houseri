/* ============================================================
 *  JENKINS PIPELINE — HOUSERI + SERVER SMART DEPLOYMENT
 *  ------------------------------------------------------------
 *  This pipeline:
 *    - Fetches code from GitHub
 *    - Detects which folders changed (houseri/server)
 *    - Builds only the changed Docker images
 *    - Runs docker compose to deploy updated services
 *    - Provides clean logs and clear structure
 * ============================================================ */

pipeline {
    agent any

    stages {

        /* ---------------------------------------------------------
         * 1. CHECKOUT SOURCE CODE
         * --------------------------------------------------------- */
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        /* ---------------------------------------------------------
         * 2. DETECT CHANGES
         * ---------------------------------------------------------
         * We detect whether client/ or server/ changed.
         * This version avoids Declarative env{} and uses env.* directly.
         * --------------------------------------------------------- */
        stage('Detect Changes') {
            steps {
                script {

                    // Default values
                    env.CLIENT_CHANGED = ""
                    env.SERVER_CHANGED = ""

                    // First build → rebuild everything
                    if (env.BUILD_NUMBER == "1") {
                        env.CLIENT_CHANGED = "force"
                        env.SERVER_CHANGED = "force"
                    } else {
                        // Detect client changes
                        env.CLIENT_CHANGED = sh(
                            script: "git diff --name-only HEAD HEAD~1 | grep '^houseri/' || true",
                            returnStdout: true
                        ).trim()

                        // Detect server changes
                        env.SERVER_CHANGED = sh(
                            script: "git diff --name-only HEAD HEAD~1 | grep '^server/' || true",
                            returnStdout: true
                        ).trim()
                    }

                    echo "Client changed: ${env.CLIENT_CHANGED != ''}"
                    echo "Server changed: ${env.SERVER_CHANGED != ''}"
                }
            }
        }

        /* ---------------------------------------------------------
         * 3. BUILD CLIENT (ONLY IF CHANGED)
         * --------------------------------------------------------- */
        stage('Build  Houseri Client') {
            steps {
                script {
                    if (env.CLIENT_CHANGED != "") {
                        sh '''
                            echo "Building CLIENT Docker image..."
                            cd houseri
                            docker build -t houseri-client .
                        '''
                    } else {
                        echo "Houseri Client unchanged — skipping build."
                    }
                }
            }
        }

        /* ---------------------------------------------------------
         * 4. BUILD SERVER (ONLY IF CHANGED)
         * --------------------------------------------------------- */
        stage('Build Houseri Server') {
            steps {
                script {
                    if (env.SERVER_CHANGED != "") {
                        sh '''
                            echo "Building SERVER Docker image..."
                            cd server
                            docker build -t houseri-server .
                        '''
                    } else {
                        echo "Houseri Server unchanged — skipping build."
                    }
                }
            }
        }

        stage('Prepare environment') {
            steps {
                script {

                    echo "Preparing environment files for Houseri..."

                    /************************************************************
                    * BACKEND .env
                    * ----------------------------------------------------------
                    * We use a Jenkins FILE credential (ID: houseri-server.env)
                    * This credential contains the entire .env file content.
                    * Jenkins mounts it as a temporary file, and we copy it
                    * into server/.env inside the workspace.
                    ************************************************************/
                    withCredentials([file(credentialsId: 'houseri-server-env', variable: 'BACKEND_ENV')]) {
                        sh '''
                            echo "Injecting backend .env..."
                            mkdir -p servers/server
                            cat "$BACKEND_ENV" > server/.env
                            chmod 600 server/.env
                        '''
                    }

                    echo "Backend .env created successfully."
                }

                // Debug: show the file exists (permissions only, not content)
                sh 'ls -l server'
            }
        }

        /* ---------------------------------------------------------
         * 5. DEPLOY USING DOCKER COMPOSE
         * --------------------------------------------------------- */
        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Running Docker Compose deployment..."
                    docker-compose up -d --build
                '''
            }
        }
    }

    /* ---------------------------------------------------------
     * 6. POST ACTIONS
     * --------------------------------------------------------- */
    post {
        success {
            echo "Deployment completed successfully."
        }
        failure {
            echo "Deployment failed."
        }
    }
}
