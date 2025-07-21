#!/bin/sh

if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky: $*"
  }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  readonly husky_dir="$(dirname "$(dirname "$0")")"
  readonly git_params="$*"
  if [ -f "$husky_dir/.huskyrc" ]; then
    debug "reading $husky_dir/.huskyrc"
    . "$husky_dir/.huskyrc"
  fi
  export readonly husky_skip_init=1
  sh -e "$husky_dir/.husky/$hook_name" "$git_params"
  exitCode="$?"
  debug "$hook_name finished with exit code $exitCode"
  exit "$exitCode"
fi
