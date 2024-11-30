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
                sh """
                cp frontend/.env.sample frontend/.env.docker
                cp backend/.env.sample backend/.env.docker
                """
            }
        }

        stage("Stop Running Containers") {
            steps {
                echo "Stopping running containers..."
                sh """
                docker ps -q | xargs -r docker stop || true
                docker ps -aq | xargs -r docker rm || true
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
        
        stage("Trivy Filesystem Scan") {
            steps {
                sh """
                trivy --download-db-only
                trivy fs --format table -o trivy-fs-report.html .
                """
            }
        }

        stage("Deployment") {
            steps {
                sh """
                chmod +x start_and_import.sh
                ./start_and_import.sh
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
        always {
            cleanWs() // Clean up workspace
        }
    }
}
