# development stage
FROM node:slim

# Set app as the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock tsconfig.json ./
# Copy the source code
COPY ./src ./src

# Install the dependencies
RUN yarn install

ENV NODE_ENV=development

EXPOSE 1337 

CMD [ "npm", "run", "dev" ]
