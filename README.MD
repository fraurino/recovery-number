# Recover Number WhatsApp

## Description
API For Recovery Number WhatsApp

## Install
```npm install```

## Run 
```node index.js```

## Run in background
```npm install pm2 -g```

```pm2 index.js --name="APIRecovery"```

## Endpoint (POST)
```bash
http://localhost:3000/recovery
```

## Body (RAW JSON)
```json
{
    "number": "31994359435",
    "email": "contato@apigratis.com.br"
}
```

## Response success
```json
{
    "number": "31994359435",
    "email": "contato@apigratis.com.br",
    "message": "This number is solicited for WhatsApp Inc, this process await for 48h hours ty again",
    "solicited": true,
    "success": true,
    "confirmed": true,
    "updated_at": 1659492322
}
```
