# Hydra-bugtracker
A very simple bugtracker API self-described in Hydra

## Requirements
MongoDB server running with a database nammed 'bugtracker'

## Usage

```
bower install
npm install
```

Launch the API:

```shell
node server.js
```

### Post an user into the API

```
curl localhost:8080/api/user -v -d "familyName=CazenaveLeveque" -d "givenName=Raphael"
```
```
> {"message": "created!"}
```

### Get all users:
HTTP Request:
```
GET http://localhost:8080/api/user
```

HTTP Response:
```json
[
    {
      "@context": {
        "@vocab": "http://schema.org/"
      },
      "@id": "/api/user/54d13498f04ea3e410000001",
      "@type": "Person",
      "familyName": "Cazenave-Leveque",
      "givenName": "Raphael"
    }
]
```

### Get a RDF-REST Core abstracting the behavior of the ressource
In public/js/ng-user-controller.js, specifify wich ressource you want to get:

```
var bc = coreFactory.getCore("http://localhost:8080/api/user/54d357ea2f6af8e974000001");
```

And use it [example here](https://github.com/StatelessCat/Hydra-RDF-REST-bugtracker/blob/master/public/js/ng-user-controller.js)

Normally if you GET http://localhost:8080/public/ in your browser, you can see all the triples:

```
S: http://vps.schrodingerscat.ovh/api/54da8d9d0f7c387641739640 P: http://www.w3.org/1999/02/22-rdf-syntax-ns#type O: http://schema.org/Person
S: http://vps.schrodingerscat.ovh/api/54da8d9d0f7c387641739640 P: http://schema.org/familyName                    O: "CazenaveLeveque"
S: http://vps.schrodingerscat.ovh/api/54da8d9d0f7c387641739640 P: http://schema.org/givenName                     O: "Raphael"
```
