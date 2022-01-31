pipeline { // pipe line의 시작
    // 스테이지 별로 다른 거
    agent any // 아무거나 사용해라

    triggers { // 몇분 주기로 trigger 될것인지? > git을 3분 주기로
        pollSCM('*/3 * * * *')
    }

    environment { // pipeline에서 쓸 환경 변수 > jenkins 내부에서 설정
      AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId')
      AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey')
      AWS_DEFAULT_REGION = 'ap-northeast-2'
      HOME = '.' // Avoid npm root owned
    }

    stages { // 큰 단위
        // 레포지토리를 다운로드 받음
        stage('Prepare') {
            agent any

            steps {
                echo 'Clonning Repository'

                git url: 'https://github.com/Sangmeeeee/JenkinsTest',
                    branch: 'main',
                    credentialsId: 'Jenkins for GitHub'
            }

            post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success { // 성공하면 출력
                    echo 'Successfully Cloned Repository'
                }

                always { // 성공하던 안하던 출력
                  echo "i tried..."
                }

                cleanup { // post 종료 후 출력
                  echo "after all other post condition"
                }
            }
        }
        
        // aws s3 에 파일을 올림
        stage('Deploy Frontend') { // index.html을 s3에 올림
          steps {
            echo 'Deploying Frontend'
            // 프론트엔드 디렉토리의 정적파일들을 S3 에 올림, 이 전에 반드시 EC2 instance profile 을 등록해야함.
            dir ('./website'){ // s3 bucket에 올림
                sh '''
                aws s3 sync ./ s3://sangminbucket
                '''
            }
          }

          post {
              // If Maven was able to run the tests, even if some of the test
              // failed, record the test results and archive the jar file.
              success {
                  echo 'Successfully Cloned Repository'

//                   mail  to: 'sangmin971223@gmail.com',
//                         subject: "Deploy Frontend Success",
//                         body: "Successfully deployed frontend!"

              }

              failure {
                  echo 'I failed :('

//                   mail  to: 'sangmin971223@gmail.com',
//                         subject: "Failed Pipelinee",
//                         body: "Something is wrong with deploy frontend"
              }
          }
        }
        
        stage('Lint Backend') {
            // Docker plugin and Docker Pipeline 두개를 깔아야 사용가능!
            agent {
              docker { // 이 agent는 Docker로 일하는데 Node 최신버전으로 일한다. 원래는 Ecr에서 끌어오는듯
                image 'node:latest'
              }
            }
            
            steps {
              dir ('./server'){
                  sh '''
                  npm install&&
                  npm run lint
                  '''
              }
            }
        }
        
        stage('Test Backend') {
          agent {
            docker {
              image 'node:latest'
            }
          }
          steps {
            echo 'Test Backend'

            dir ('./server'){
                sh '''
                npm install
                npm run test
                '''
            }
          }
        }
        
        stage('Bulid Backend') {
          agent any
          steps {
            echo 'Build Backend'

            dir ('./server'){ // docker를 만들어서 배포
                sh """
                docker build . -t server
                """
            }

//                         dir ('./server'){ // docker를 만들어서 배포
//                             sh """
//                             docker build . -t server --build-arg env=${PROD}
//                             """
//                         }
          }

          post {
            failure { // server 빌드하다가 실패하면 다음 step으로 안넘어가기위해 에러
              error 'This pipeline stops here...'
            }
          }
        }
        
        stage('Deploy Backend') {
          agent any

          steps {
            echo 'Build Backend'

            dir ('./server'){
                sh '''
                docker run -p 80:80 -d server
                '''
            }
          }

          post {
            success {
                echo 'Deploy Success'
//               mail  to: 'sangmin971223@gmail.com',
//                     subject: "Deploy Success",
//                     body: "Successfully deployed!"
//
            }
          }
        }
    }
}
