ARG NODE_IMAGE=public.ecr.aws/docker/library/node:22.3.0-slim

FROM --platform=linux/amd64 $NODE_IMAGE AS builder

# Set app as the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and yarn.lock files
COPY --chown=node:node ./package.json ./yarn.lock ./

# Install the dependencies along with devDependencies
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY --chown=node:node . .

# Build the project (output to /dist)
RUN yarn build && ls -la /app

FROM $NODE_IMAGE as production

# Set user to node
USER node

# Set app as the working directory
WORKDIR /app

# Copy package.json and yarn.lock files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built artifacts from the build stage and db folder
COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["node", "dist/src/main"]