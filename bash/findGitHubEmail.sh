#!/usr/bin/env bash

# based on FindGitHubEmail (https://github.com/hodgesmr/FindGitHubEmail)

EVENTRESPONSE=$1

EMAIL=`echo "$EVENTRESPONSE" | grep "\"email\":" | sed -e's/[,|"]//g' | sort | uniq -c | sort -n | awk '{print $(NF)}' | grep -v null | tail -n1`

if [ -n "$EMAIL" ] ; then
  echo "$EMAIL"
  exit
fi

exit 1
