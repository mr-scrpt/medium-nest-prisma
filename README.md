<p align="center">
  <a href="https://github.com/mr-scrpt/medium-nest-prisma" target="blank">
     <img src="https://github.com/mr-scrpt/medium-nest-prisma/project-logo.png" alt="Project Logo" />
  </a>
</p>

## Description

Backend on NestJs using Prisma for [RealWorld](https://github.com/gothinkster/realworld) projects

## About

The project uses GRASP and SOLID patterns. There is an emphasis on the division of responsibility, layered architecture

## Note

The database for the project is used in a docker container, so you will need tools to work with the docker

## Download

```bash
git clone https://github.com/mr-scrpt/medium-nest-prisma.git
cd medium-nest-prisma
```

## Install dependencies

```bash
$ yarn install
```

## Start Postgres DB on docker container

```bash
$ docker-compose up -d
```

## Run migration for DB

```bash
$ yarn migrate:dev
```

## (Optional) Add seed data

```bash
$ yarn seed:dev
```

## Running the app

```bash
# development
$ yarn start:dev

# prod mode
$ yarn run start:prod

```
