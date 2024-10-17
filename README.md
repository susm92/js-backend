# js-backend

Detta är backend repot för kursen JSRAMVERK som tillhandahålls av Blekinge Tekniksa Högskola (BTH).

Backendet körs på http://localhost:8080 vid lokal körning. 

## Övrig information

Backendet använder sig av miljövariabler för fullständig funktionalitet, i för våran del innebär det en backend del med följande information som behöver finnas innan det kommer gå att starta lokalt.

```
ATLAS_USERNAME=<MongoDB användarnamn för autentisering>
ATLAS_PASSWORD=<MongoDB lösenord för autentisering>
SECRET_KEY=<Nyckel för att signera och skapa JWT tokens>
MAILGUN_API_KEY=<API nyckel för mailgund>
MAILGUN_DOMAIN=<Domän för mailgun mailflöde>
```

Applikationen startas via kommando
`npm run watch`
