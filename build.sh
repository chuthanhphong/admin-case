rm -rf package-lock.json &&
npm cache clean --force &&
npm install &&
npm run build &&
docker-compose -f docker-compose-nginx.yaml up -d