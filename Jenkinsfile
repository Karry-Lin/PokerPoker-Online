pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''build_name=jenkins/${PROJECT_NAME}:${BRANCH_NAME}-${BUILD_NUMBER}

docker build \\
  -t ${build_name} \\
  .'''
      }
    }

    stage('Deploy') {
      parallel {
        stage('main') {
          when {
            branch 'main'
          }
          steps {
            withCredentials(bindings: [
                                          string(credentialsId: 'pokerpoker_online-api_key', variable: 'API_KEY'),
                                          string(credentialsId: 'pokerpoker_online-auth_domain', variable: 'AUTH_DOMAIN'),
                                          string(credentialsId: 'pokerpoker_online-project_id', variable: 'PROJECT_ID'),
                                          string(credentialsId: 'pokerpoker_online-storage_bucket', variable: 'STORAGE_BUCKET'),
                                          string(credentialsId: 'pokerpoker_online-messaging_sender_id', variable: 'MESSAGING_SENDER_ID'),
                                          string(credentialsId: 'pokerpoker_online-app_id', variable: 'APP_ID'),
                                          string(credentialsId: 'pokerpoker_online-measurement_id', variable: 'MEASUREMENT_ID'),
                                          string(credentialsId: 'pokerpoker_online-api_url', variable: 'API_URL')
                                        ]) {
                sh '''run_name=jk-${PROJECT_NAME}-${BRANCH_NAME}
build_name=jenkins/${PROJECT_NAME}:${BRANCH_NAME}-${BUILD_NUMBER}

docker rm -f ${run_name}
docker run \\
  -d \\
  --restart=unless-stopped \\
  --name ${run_name} \\
  -p 53006:3000 \\
  -e API_KEY=${API_KEY} \\
  -e AUTH_DOMAIN=${AUTH_DOMAIN} \\
  -e PROJECT_ID=${PROJECT_ID} \\
  -e STORAGE_BUCKET=${STORAGE_BUCKET} \\
  -e MESSAGING_SENDER_ID=${MESSAGING_SENDER_ID} \\
  -e APP_ID=${APP_ID} \\
  -e MEASUREMENT_ID=${MEASUREMENT_ID} \\
  -e API_URL=${API_URL} \\
  ${build_name}'''
              }

            }
          }

        }
      }

      stage('Test') {
        steps {
          sh 'echo Not test yet!'
        }
      }

    }
    environment {
      PROJECT_NAME = 'pokerpoker_online'
    }
    post {
      success {
        library 'shared-library'
        discord_notifaction true
      }

      unsuccessful {
        library 'shared-library'
        discord_notifaction false
      }

    }
  }