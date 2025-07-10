while true; do
    NODE_OPTIONS=--openssl-legacy-provider node .
    echo "Bot caiu... reiniciando em 5 segundos"
    sleep 5
    clear
    echo "instalando dependencias"
    nvm use && npm i
    sleep 4
    clear
    echo "Bot iniciado"
done
