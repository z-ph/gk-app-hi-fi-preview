#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "=== 清理已有服务 ==="
# Kill processes on port 3010 (frontend) and 3014 (mock backend)
lsof -ti:3010 | xargs kill -9 2>/dev/null || true
lsof -ti:3014 | xargs kill -9 2>/dev/null || true
sleep 1

echo "=== 启动 Mock 后端 (http://127.0.0.1:3014) ==="
cd mock-server
node index.js &
MOCK_PID=$!
cd ..

echo "=== 启动前端 (http://127.0.0.1:3010) ==="
pnpm dev &
DEV_PID=$!

echo ""
echo "服务已启动:"
echo "  前端: http://127.0.0.1:3010"
echo "  Mock 后端: http://127.0.0.1:3014"
echo ""
echo "按 Ctrl+C 停止两个服务"
echo ""

# Wait for both background processes
wait $MOCK_PID $DEV_PID
