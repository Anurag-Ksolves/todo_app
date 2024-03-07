pipeline {
    agent any
   
    environment{
        DOCKER_CRED = credentials('docker-cred')
        GITHUB_CRED = credentials('github-cred')
    }

    stages {
        stage('Cleaning Workspace') {
            steps {
                script{
                    echo "***'Cleaning Work Space'***"
                    sh '''
                    docker rm -f frontend backend_node mysql_db
                    docker image prune -af
                    '''
                }
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                script {
                    echo "***'In Checkout Stage'***"
                    echo "Checking out the code using scm"
                    git branch: 'main',
                        url: 'https://github.com/Anurag-Ksolves/todo_app.git/'
                }
            }
        }


        stage('Build') {
            steps {
                // Build your application here (e.g., compile, package, etc.)
                echo "***'In Build Stage'***"
                sh '''
                docker compose build
                ls
                '''
            }
        }

        
        stage('Tag and Publish') {
            steps {
                // Deploy your application to a target environment
                echo "***'In Tagging Stage'***"
                echo "Tagging Backend Image"
                sh "docker tag backend_todo:latest $DOCKER_CRED_USR/backend_todo:$BUILD_NUMBER"

                echo "Tagging Frontend Image"
                sh "docker tag frontend_todo:latest $DOCKER_CRED_USR/frontend_todo:$BUILD_NUMBER"

                echo "Pushing Tagged Images"
                sh "docker push $DOCKER_CRED_USR/backend_todo:$BUILD_NUMBER"
                sh "docker push $DOCKER_CRED_USR/frontend_todo:$BUILD_NUMBER"

                sh "docker image prune -af"
                echo "Deleted local images"
                sh "docker images"
            }
        } 
        
        stage('Deploy'){
            steps {
                // Update docker-compose.yml with new image tags
                echo "***'In release stage'***" 
                echo "Altering the Docker Compose File"
                sh "sed -i 's/backend_todo/$DOCKER_CRED_USR\\/backend_todo:$BUILD_NUMBER/g' docker-compose.yml"
                sh "sed -i 's/frontend_todo/$DOCKER_CRED_USR\\/frontend_todo:$BUILD_NUMBER/g' docker-compose.yml"
                sh "cat docker-compose.yml"
                sh 'docker compose up -d'
                // sh '''
                // git add .
                // git config user.name "Anurag-Ksolves"
                // git config user.email "anurag.karumuri@ksolves.com"
                // git commit -m "commit from build: $BUILD_NUMBER"
                // git remote set-url origin https://$GITHUB_CRED_USR:$GITHUB_CRED_PSW@github.com/$GITHUB_CRED_USR/todo_app.git
                // git push -u origin main
                // '''
            }
        }   
        
    }

    post {
        success {
            // Actions to perform when the pipeline succeeds
            echo 'Pipeline succeeded!'
        }
        failure {
            // Actions to perform when the pipeline fails
            echo 'Pipeline failed!'
        }
        always{
            cleanWs()
        }
    }
}