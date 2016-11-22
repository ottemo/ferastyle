#!/bin/bash

# SRCDIR
HOME=/home/ottemo
SRCDIR=$HOME/code/store
MEDIADIR=$HOME/media

# STORE
STORE="local"
if [ "$REMOTE_HOST" == 'dev.ottemo.io' ]; then
    STORE="dev"
elif [ "$REMOTE_HOST" == 'fs.staging.ottemo.io' ]; then
    STORE="fs-staging"
fi

if [ "$BRANCH" == 'develop' ]; then
    configName=${SRCDIR}/config/${STORE}.json
    THEME=`ssh ottemo@$REMOTE_HOST "cd $SRCDIR && grep theme ${configName} | sed 's/^.*:.*\"\(.*\)\".*$/\1/'"`
    THEMEDIR=${SRCDIR}/src/themes/${THEME}
    
    currentBranch=`ssh ottemo@$REMOTE_HOST "cd $SRCDIR && git symbolic-ref --quiet --short HEAD 2> /dev/null || git rev-parse --short HEAD 2> /dev/null || echo '(unknown)'"`
    echo ""
    echo "STORE BRANCH IS ${currentBranch}"

    if [ "$currentBranch" == 'develop' ]; then
        echo UPDATING REMOTE GIT REPOSITORY WITH DEVELOP BRANCH.
        ssh ottemo@$REMOTE_HOST "cd $SRCDIR && git checkout develop && git fetch --prune && git pull"
    fi

    currentBranch=`ssh ottemo@$REMOTE_HOST "cd $THEMEDIR && git symbolic-ref --quiet --short HEAD 2> /dev/null || git rev-parse --short HEAD 2> /dev/null || echo '(unknown)'"`
    echo ""
    echo "THEME (${THEME}) BRANCH IS ${currentBranch}"

    if [ "$currentBranch" == 'develop' ]; then
        echo UPDATING REMOTE THEME REPOSITORY WITH DEVELOP BRANCH.
        ssh ottemo@$REMOTE_HOST "cd $THEMEDIR && git checkout develop && git fetch --prune && git pull"
    fi

    echo ""
    echo REMOVING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && rm -rf dist"

    echo ""
    echo RUNNING PRODUCTION GULP BUILD AND RESTORING SYMLINK TO MEDIA FOLDER.
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && gulp build --env=staging --config=${STORE}"

    echo ""
    echo RESTORING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "rm -rf $HOME/store/* && cp -R $SRCDIR/dist/* $HOME/store && ln -s $MEDIADIR $HOME/store/media"

    echo ""
    echo DEPLOY FINISHED
fi
