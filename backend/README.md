# Patient CRM Backend

## How to run the backend

1. Install mongodb on your local.
   You can follow [this guide](https://www.mongodb.com/docs/manual/installation) to install mongodb.
2. After install mongodb, create new collection and get the connection link.
   You can check this [doc](https://www.mongodb.com/docs/manual/reference/connection-string/)
3. Add values in .env
   Please check [.env.example](https://github.com/naruto0913/patient-crm/blob/master/backend/.env.example)

```bash
MONGODB_URL_API=mongodb_connection_string
JWT_SECRET=jwt_secret_key

SEED_ADMIN_NAME=admin_name
SEED_ADMIN_EMAIL=admin_email
SEED_ADMIN_PASSWORD=admin_password
```

4. Install npm packages by running

```bash
npm install
// or
yarn install
```

4. Seed DB

You can update the admin information(username, email and password in [dbSeed.ts](https://github.com/naruto0913/patient-crm/blob/master/backend/src/seed/dbSeed.ts))

Install ts-node by running

```bash
npm install -g typescript
npm install -g ts-node
```

Then run following command

```bash
npm run db:seed
// or
yarn db:seed
```

6. Start development server by running

```bash
npm run dev
// or
yarn dev
```

7. Run in docker

```bash
docker build -t patientcrm/backend .

docker run \
    -e MONGODB_URL_API=your_mongodb_url \
    -e JWT_SECRET=jwt_secret_key \
    patientcrm/backend
```

Please note to replace the "your_mongodb_url" and "jwt_secret_key" with your proper values.

## Backend Functions Description

### User types

There are 3 kinds of user types in this project.

- Admin:
  Only 1 admin exists and it can be created by db:seed.
  Admin can see all the menus including Doctors and Patients.
  ![image](https://user-images.githubusercontent.com/37606416/233425633-3428c6c8-0522-4d62-999b-4ef723413f56.png)

  Only admin can manage access and remove Doctors
  ![image](https://user-images.githubusercontent.com/37606416/233425829-54ae8a44-5363-4192-85fb-0b29b101e1c9.png)
  
  ![image](https://user-images.githubusercontent.com/37606416/233426036-49883b4a-2d59-4111-8c83-49dbeb3d6621.png)

- Doctor
  When you do register on signup page, then you will become the Doctor.
  Doctors can see only the patients and can not see other Doctors.
  ![image](https://user-images.githubusercontent.com/37606416/233426293-42354e3e-903d-4230-a6d6-02b6de9b9b10.png)

  When you register you will have READ and CREATE access role as default.
  But Doctors not update or remove patients as has no UPDATE and DELETE right.
  If admin give rights, then Doctors can do UPDATE and DELETE patients also.
  ![image](https://user-images.githubusercontent.com/37606416/233426425-a23e55d4-7a78-4a69-b7fb-a9680d7022ec.png)

- Patient
  All patients are showing inpPatient list page


### Work Flow

![image](https://user-images.githubusercontent.com/37606416/233428181-446d2c1b-ecea-4ec5-ac97-482232da7ed4.png)
