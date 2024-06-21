FROM node:slim as builder

# Set app as the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install the dependencies along with devDependencies
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the project (output to /dist)
RUN yarn build

FROM node:18-slim as production

USER node

# Set app as the working directory
WORKDIR /app

# Copy package.json and yarn.lock files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built artifacts from the build stage and db folder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

EXPOSE 3000

CMD ["node", "dist/main"]