# ![RealWorld Example App](logo.png)

> ### [YOUR_FRAMEWORK] codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **[YOUR_FRAMEWORK]** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **[YOUR_FRAMEWORK]** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

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
