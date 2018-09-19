#!/bin/sh
AWS_PROFILE="$AWS_PROFILE" _awsp_prompt

export AWS_PROFILE="$(cat ~/.awsp)"
