while true; do
    NODE_OPTIONS=--openssl-legacy-provider node .
    echo "Bot caiu... reiniciando em 3 segundos"
    sleep 1
    clear
    echo "instalando dependencias"
    npm i
    clear
    echo "Bot iniciado"
done
