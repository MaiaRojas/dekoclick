#! /usr/bin/env bash

SCRIPT_PATH="`dirname \"$0\"`"              # relative
SCRIPT_PATH="`( cd \"$MY_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$SCRIPT_PATH" ] ; then
  # error; for some reason, the path is not accessible
  # to the script (e.g. permissions re-evaled after suid)
  exit 1  # fail
fi

BUCKET="capitan.laboratoria.la"
DIST="${SCRIPT_PATH}/dist"

_updateACL() {
  local dir=${1}
  local absPath="${DIST}"

  if [ ! -z "${dir}" ]; then
    absPath="${DIST}/${dir}"
  fi

  for file in `ls ${absPath}`; do
    local relative="${dir}/${file}"
    if [ -d "${absPath}/${file}" ]; then
      _updateACL "${relative}"
    else
      gsutil acl ch -u AllUsers:R "gs://${BUCKET}${relative}"
    fi
  done
}

gsutil rsync -R dist "gs://${BUCKET}"
_updateACL
