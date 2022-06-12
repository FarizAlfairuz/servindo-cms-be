FROM node:18-alpine

# Setting up directory
RUN mkdir -p /app/api
WORKDIR /app/api

# Installing dependencies
COPY package.json .
COPY package-lock.json .

RUN apk update && apk add bash
RUN npm install --production
RUN npm install global sequelize-cli

# Copying source code
COPY . .

# Create folder for invoice files
RUN mkdir -p /app/api/invoice