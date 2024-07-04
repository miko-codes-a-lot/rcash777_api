## Running the project

1. Install dependencies

```bash
  yarn
```

2. Create .env by copying exising env sample

```bash
  cp .env.example .env
```

Please ask the dev for the actual ".env" file as it contains provider tokens

3. Spin up the backend

```bash
  yarn up -d
```

#### To restore default db migration data (needed on first install)

- Go to Docker -> Containers
- Click `rcash-api`
- Go to `Terminal` tab
- run `yarn migration:run`

#### All Done!

---

#### To access pgadmin

- go to http://localhost:5050/
- authenticate using the creds from .env
- If server is not yet connected
  - Click Add new server
  - Add any name eg: pg-admin
  - Go to Connection tab
  - Add Host, Username and Password from .env
  - Click Save

#### To access api documentation:

- Navigate to http://localhost:5001/api/swagger

#### To test the API, generate token first using the following info:

- POST:http://localhost:5001/api/auth/login
- email: admin@thefirm.tech
- password: admin123

#### To generate new migration data

- `yarn migration:generate -- db/migrations/{MigrationName}`

#### To generate seed data

- `yarn seed`
  - For generated users, the default password is `user123`

## Deployment

```bash
$ aws --profile rcash777 ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
$
$ docker buildx build --platform linux/amd64 -f docker/remote/Dockerfile -t $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/staging-rcash777-backend:latest .
$
$ docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/staging-rcash777-backend:latest 
```