#!/bin/bash

set -e

export PATH="${BITBUCKET_CLONE_DIR}/bin:$PATH"
TAG_PATTERNS='^(model-.*|qa-.*|stg-.*|release-.*)'
PREFIX=$(grep -o -E $TAG_PATTERNS <<<$BITBUCKET_TAG | cut -d'-' -f1)
if [[ -z $PREFIX ]]; then
  echo "Nothing to do for tag $BITBUCKET_TAG with prefix $PREFIX ... exiting ..."
  exit 0
fi

export AWS_ACCESS_KEY_ID=$(echo $AWS_ACCESS_KEY_ID | base64 --decode)
export AWS_SECRET_ACCESS_KEY=$(echo $AWS_SECRET_ACCESS_KEY | base64 --decode)
export AWS_DEFAULT_REGION=$(echo $AWS_DEFAULT_REGION | base64 --decode)
export SECRET_NAME=$(echo $SECRET_NAME | base64 --decode)

generate_vars () {
  export PRODUCT=$BITBUCKET_REPO_SLUG

  export SECRETS=$(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --query SecretString --output text --region $AWS_DEFAULT_REGION | jq -r '"\(.)"')

  export BITBUCKET_SSH_KEY=$(get_secret BITBUCKET_SSH_KEY)

  export HELM_CHART_URL=$(get_secret HELM_CHART_URL)
  export HELM_VERSION=$(get_secret HELM_VERSION)

  export NEXUS_NPM=$(get_secret NEXUS_NPM)
  export NEXUS_USERNAME=$(get_secret NEXUS_USERNAME)
  export NEXUS_PASSWORD=$(get_secret NEXUS_PASSWORD)

  export AWS_DOCKER=$(get_secret AWS_DOCKER)
  export CACHE_URL=$AWS_DOCKER
 
  mkdir -p ${BITBUCKET_CLONE_DIR}/.kube
  KUBECONFIG=$(get_secret KUBECONFIG)
  echo $KUBECONFIG | base64 --decode > ${BITBUCKET_CLONE_DIR}/.kube/config
  export KUBECONTEXT="nura-$REGION"
  export KUBECONFIG=${BITBUCKET_CLONE_DIR}/.kube/config

  case $PREFIX in
    "model")
      export ENVIRONMENT="web-model"
      export VERSION=$(echo $BITBUCKET_TAG | cut -c7-l) ;;
    "qa")
      export ENVIRONMENT="web-qa"
      export VERSION=$(echo $BITBUCKET_TAG | cut -c4-) ;;
    "stg")
      export ENVIRONMENT="web-staging"
      export VERSION=$(echo $BITBUCKET_TAG | cut -c5-) ;;
    "release")
      export ENVIRONMENT="web-prod"  
      export VERSION=$(echo $BITBUCKET_TAG | cut -c9-) ;;
  esac

  case $REGION in
    "na-east")
      export AWS_DEFAULT_REGION="us-east-1" ;;
    "sa-east")
      export AWS_DEFAULT_REGION="sa-east-1" ;;
    "eu-central")
      export AWS_DEFAULT_REGION="eu-central-1" ;;
    "cn" | "cn-north" | "cn-west")
      export AWS_DEFAULT_REGION="cn-north-1"
      export AWS_DOCKER=$(get_secret AWS_DOCKER_CN)
      export AWS_ACCESS_KEY_ID=$(get_secret AWS_ACCESS_KEY_ID_CN)
      export AWS_SECRET_ACCESS_KEY=$(get_secret AWS_SECRET_ACCESS_KEY_CN)
  esac
}

get_secret () {
  SECRET=$1
  echo $SECRETS | jq -r ".$SECRET"
}

docker_login () {
  docker login -u AWS -p $(AWS_DEFAULT_REGION=cn-north-1 AWS_ACCESS_KEY_ID=$(get_secret AWS_ACCESS_KEY_ID_CN) AWS_SECRET_ACCESS_KEY=$(get_secret AWS_SECRET_ACCESS_KEY_CN) aws ecr get-login-password --region cn-north-1) $(get_secret AWS_DOCKER_CN)

  docker login -u AWS -p $(AWS_DEFAULT_REGION=us-east-1 AWS_ACCESS_KEY_ID=$(get_secret AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(get_secret AWS_SECRET_ACCESS_KEY) aws ecr get-login-password --region us-east-1) $(get_secret AWS_DOCKER)
}

docker_cache () {
  docker pull $CACHE_URL/$PRODUCT:latest || true
}

docker_build () {

  docker build --target deploy --cache-from $CACHE_URL/$PRODUCT:latest --tag $CACHE_URL/$PRODUCT:latest .

  docker tag $CACHE_URL/$PRODUCT:latest $PRODUCT:$VERSION
}

docker_save () {
  mkdir -p images

  docker save $CACHE_URL/$PRODUCT:latest | gzip > images/${PRODUCT}_latest.tgz
}

docker_load () {
  docker load --input images/${PRODUCT}_latest.tgz
}

docker_tag () {
  docker tag $CACHE_URL/$PRODUCT:latest $AWS_DOCKER/$PRODUCT:latest
  docker tag $CACHE_URL/$PRODUCT:latest $AWS_DOCKER/$PRODUCT:$VERSION
}

if [ "$1" == "build" ]; then
  generate_vars

  docker_login
  docker_cache
  docker_build
  docker_save
fi

if [ "$1" == "push" ]; then
  generate_vars

  docker_login
  docker_load
  docker_tag
  docker push $AWS_DOCKER/$PRODUCT
fi

if [ "$1" == "deploy" ]; then
  generate_vars

  git clone $HELM_CHART_URL --branch=new-arch

  kubectl config use $KUBECONTEXT

  ./dfx-helm/stable/$BITBUCKET_REPO_SLUG/install.sh -d $AWS_DOCKER -e $ENVIRONMENT -v $VERSION -r $AWS_DEFAULT_REGION

  helm ls -n $ENVIRONMENT
fi