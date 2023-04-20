# Patient CRM Dashboard

### You need to start the Patient CRM Backend first

1. Navigate to the frontend directory and create .env and .env.local then add values in .env
   Please check [.env.example](https://github.com/naruto0913/patient-crm/blob/master/frontend/.env.example)

```bash
NEXT_PUBLIC_BASE_API=http://localhost:4000/
```

2. Install npm packages by running

```bash
npm install
// or
yarn install
```

3. Start development server by running

```bash
npm run dev
// or
yarn dev
```

4. Run in docker

```bash
docker build -t patientcrm/frontend .

docker run \
    -e NEXT_PUBLIC_BASE_API=http://localhost:4000/ \
    patientcrm/frontend
```

Please note to replace the "NEXT_PUBLIC_BASE_API" with your proper value.

Open your favorite browser then check http://localhost:3000
