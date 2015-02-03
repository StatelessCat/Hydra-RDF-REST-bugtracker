# Hydra-bugtracker
A very simple bugtracker API self-described in Hydra

## Requirements
MongoDB server running with a database nammed 'bugtracker'

## Usage
```shell
node server.js
```

### Get all users:
HTTP Request:
```
GET http://localhost:8080/api/user
```

HTTP Response:
```
[
    {
        "@context":"http://schema.org/",
        "@type":"Person",
        "familyName":"Cazenave-Leveque",
        "givenName":"Raphael",
    }
]
```

