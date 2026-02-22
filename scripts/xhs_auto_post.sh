#!/bin/bash
set -euo pipefail

WORKDIR="/Users/vitachums/.openclaw/workspace"
STATE_DIR="$WORKDIR/.state"
MEDIA_DIR="$WORKDIR/media"
LAST_FILE="$STATE_DIR/xhs_last_post.txt"
MCP_URL="http://localhost:18060/mcp"

mkdir -p "$STATE_DIR" "$MEDIA_DIR"

# Only post if 72h passed
now_ts=$(date +%s)
last_ts=0
if [ -f "$LAST_FILE" ]; then
  last_ts=$(cat "$LAST_FILE" || echo 0)
fi
if [ $((now_ts - last_ts)) -lt $((72*3600)) ]; then
  exit 0
fi

# Pick content template
TITLES=(
  "外包后更累？问题在岗位放错"
  "外包不省心？先把岗位放对"
  "外包翻车最多的点：岗位不匹配"
)
BODIES=(
"很多老板说：外包后反而更累。\n我见过的核心原因只有一个：岗位放错了。\n\n正确的分工很简单：\n- 客户与决策留在本地\n- 流程执行放菲律宾\n- 关键交付指定接口人\n\n这样做的结果是：\n沟通更顺、成本更稳、招聘速度更快。\n\n不适合所有公司，但适合的那部分，效果会非常明显。\n\n你现在团队里最难招、最难管的是哪类岗位？"
"外包的坑，多数不是人不行，而是岗位安排错了。\n\n建议的结构：\n- 业务与客户沟通留在本地\n- 流程型岗位放菲律宾\n- 每个交付节点有清晰负责人\n\n调整后，效率会明显提升，团队也更稳。\n\n你最头疼的是哪类岗位？"
"看过太多外包失败案例，核心问题常常是：岗位不匹配。\n\n做法其实不复杂：\n- 决策和客户关系留在本地\n- 执行与流程放菲律宾\n- 关键岗位设置接口人\n\n适合的公司，效果很快会出现。\n\n你现在最难招的是哪类岗位？"
)

idx=$((RANDOM % ${#TITLES[@]}))
TITLE="${TITLES[$idx]}"
CONTENT="${BODIES[$idx]}"

# Generate image
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
import os, time
W,H=1080,1440
bg=(250,248,244)
img=Image.new('RGB',(W,H),bg)
d=ImageDraw.Draw(img)
font_path='/Library/Fonts/Arial Unicode.ttf'
font_title=ImageFont.truetype(font_path,70)
font_sub=ImageFont.truetype(font_path,46)
lines=["外包后更累？", "岗位放错了"]
y=200
for line in lines:
    w,h=d.textbbox((0,0),line,font=font_title)[2:]
    d.text(((W-w)//2,y),line,fill=(30,30,30),font=font_title)
    y+=96

d.line((170,460,910,460),fill=(220,210,190),width=3)
body=["客户与决策留在本地", "流程执行放菲律宾", "团队才会更稳"]
y=580
for line in body:
    w,h=d.textbbox((0,0),line,font=font_sub)[2:]
    d.text(((W-w)//2,y),line,fill=(60,60,60),font=font_sub)
    y+=80
out=f"/Users/vitachums/.openclaw/workspace/media/xhs_auto_{int(time.time())}.png"
img.save(out)
print(out)
PY

IMG_PATH=$(ls -t "$MEDIA_DIR"/xhs_auto_*.png | head -n 1)

# Init MCP
HDRS=$(mktemp)
curl -s -D "$HDRS" -o /tmp/mcp_init.json -X POST "$MCP_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"openclaw","version":"1.0"}},"id":1}' > /dev/null
SID=$(awk -F': ' '/Mcp-Session-Id/{print $2}' "$HDRS" | tr -d '\r')

curl -s -X POST "$MCP_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: $SID" \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}' > /dev/null

# Publish
payload=$(cat <<EOF
{"jsonrpc":"2.0","method":"tools/call","params":{"name":"publish_content","arguments":{"title":"$TITLE","content":"$CONTENT","images":["$IMG_PATH"],"tags":["外包团队","远程团队","团队管理","人力成本","跨国团队"]}},"id":2}
EOF
)

curl -s -X POST "$MCP_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: $SID" \
  -d "$payload" > /tmp/mcp_auto_publish.json

# update last post time
printf "%s" "$now_ts" > "$LAST_FILE"
