#!/usr/bin/env bash

if [ "$1" = "--drafts" ]; then
  bundle exec jekyll liveserve --drafts
else
  bundle exec jekyll liveserve
fi
