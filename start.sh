# linux 自动安装化脚本
echo "更新代码"
git pull

echo "安装依赖"
{ npm install; }

pm2 stop 0 1;pm2 delete 0 1;

cd ../
echo "启动服务器"
pm2 start ./service-node/src/main.js
pm2 start ./service-socket/src/main.js