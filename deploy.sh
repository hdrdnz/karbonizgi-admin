
set -e
set -a
source .env
set +a

echo "APP_NAME: $APP_NAME"
echo "React uygulaması build ediliyor..."
npm install
npm run build
if [ ! -d "dist" ]; then
  echo "Build (dist) klasörü bulunamadı. npm run build başarısız olabilir."
  exit 1
fi


COPY_FILES="dist Dockerfile package*.json tsconfig*.json vite.config.* index.html src public nginx .env"
if [ -d "nginx" ]; then
  COPY_FILES="$COPY_FILES nginx"
fi

echo "Uzak sunucuda klasör oluşturuluyor..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p /home/$APP_NAME"


echo "Uygulama dosyaları rsync ile gönderiliyor..."
rsync -avz --delete $COPY_FILES $REMOTE_USER@$REMOTE_HOST:/home/$APP_NAME/


echo "Eski konteyner temizleniyor..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
if docker ps -a --format '{{.Names}}' | grep -Eq "^$APP_NAME\$"; then
    docker stop $APP_NAME || true
    docker rm $APP_NAME || true
else
    echo "Önceki konteyner bulunamadı, atlanıyor."
fi
EOF
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd /home/$APP_NAME
docker build -t $APP_NAME . || {
  echo "Build başarısız!"
  exit 1
}
docker run -dti --restart=on-failure -p $PORT_MAPPING --name $APP_NAME $APP_NAME || {
    echo "Docker konteyner başlatılamadı, image yok veya sorun var."
    exit 1
}
CONTAINER_ID=\$(docker ps -q --filter "name=$APP_NAME")
if [ ! -z "\$CONTAINER_ID" ]; then
    docker update --restart unless-stopped \$CONTAINER_ID
fi
EOF

echo "Deploy işlemi başarıyla tamamlandı!"
