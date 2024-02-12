# Usage

## Docker (recommend)

### Put file in directory like below
```
myapp
├── docker-compose.yml 
├── backend
│   ├── Dockerfile # backend dockerfile
│   └── files      # git clone https://github.com/LinZH-1995/forum-express-grading.git
└── frontend
    ├── Dockerfile # frontend dockerfile
    └── files      # git clone https://github.com/LinZH-1995/Vue2-practice.git
```

```sh
git clone https://github.com/LinZH-1995/forum-express-grading.git myapp/backend
```
```sh
git clone https://github.com/LinZH-1995/Vue2-practice.git myapp/frontend
```
```sh
cd myapp/backend
```
```sh
mv docker-compose.yml ../
```
```sh
cd ..
```
```sh
docker-compose build --no-cache
```
```sh
docker-compose up -d
```
```sh
http://localhost:3030
```

## Local (frontend see https://github.com/LinZH-1995/Vue2-practice?tab=readme-ov-file#local )
```sh
git clone https://github.com/LinZH-1995/forum-express-grading.git
```
```sh
cd forum-express-grading
```
```sh
npm install
```
```sh
npm run dev
```

## Test account in seed
* admin ：
  * email: root@example.com
  * password: 12345678
* user1：
  * email: user1@example.com
  * password: 12345678
* user2：
  * email: user2@example.com
  * password: 12345678
