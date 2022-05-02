### Database setup
```
docker run --name db -e POSTGRES_PASSWORD=mapstat -e POSTGRES_USER=mapstat -p 5432:5432 -d postgres
```

### Add user for testing:
Check the server/tools directory and execute adduser.js via CLI:
> **_NOTE:_**  `<username> <password> <email> <role>`
```
node adduser.js admin admin admin@ii.ii admin
```
