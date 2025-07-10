nvm use
while true; do
    echo "instalando dependencias"
    npm i
    clear
    echo "Bot iniciado"
    NODE_OPTIONS=--openssl-legacy-provider node .
    echo "Bot caiu... reiniciando em 3 segundos"
    sleep 1
    clear
done
