pipeline {
    agent any

    environment {
        SONAR_HOME = tool name: 'sonar1', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
    }

    stages {
        stage("Clone Code from GitHub") {
            steps {
                git url: "https://github.com/akashsingh6474/wanderlust", branch: "dev-main"
            }
        }

        stage("Generate .env Files") {
            steps {
                // Write frontend .env.docker
                sh """
                cp frontend/.env.sample frontend/.env.docker
                cp backend/.env.sample backend/.env.docker
                """
            }
        }

        stage("Quality Analysis") {
            steps {
                withSonarQubeEnv('sonar1') {
                    sh """
                    ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectName=wanderlust \
                        -Dsonar.projectKey=wanderlust \
                        -Dsonar.sources=.
                    """
                }
            }
        }

        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage("Wait for Sonar Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("Run Test Cases") {
            parallel {
                stage("Run Frontend Tests") {
                    steps {
                        sh """
                        cd frontend
                        npm install
                        npm test -- --watchAll=false
                        """
                    }
                }
                stage("Run Backend Tests") {
                    steps {
                        sh """
                        cd backend
                        npm install
                        npm test -- --watchAll=false
                        """
                    }
                }
            }
        }

        stage("Trivy Filesystem Scan") {
            steps {
                sh """
                trivy fs --format table -o trivy-fs-report.html . 
                """
            }
        }

        stage("Handle Existing Containers") {
            steps {
                // Automatically stop and remove frontend, backend, and mongo containers
                sh """
                docker rm -f frontend || true
                docker rm -f backend || true
                docker rm -f mongo || true
                """
            }
        }

        stage("Deployment") {
            steps {
                // Ensure the deployment script starts the containers automatically
                sh """
                chmod +x start_and_import.sh
                ./start_and_import.sh
                """
            }
        }
    }

    post {
        success {
            // Display success message
            echo 'Pipeline completed successfully!'
            
            // Optionally reload the application (this could be a restart or reload command)
            sh """
            echo 'Reloading the application...'
            # Command to reload the application
            docker restart frontend || true
            docker restart backend || true
            docker restart mongo || true
            """
        }
        failure {
            // Handle failure case
            echo 'Pipeline failed!'
        }
    }
}
