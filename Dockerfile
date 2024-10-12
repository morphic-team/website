# Base image: Use a lightweight Debian image
FROM debian:bookworm-slim

# Set the environment variables to non-interactive for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies: curl, git, and any build dependencies you might need
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    curl \
    && apt-get clean

# Install Node.js (current stable version, e.g., 20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm

# Create and set the working directory
WORKDIR /usr/src/app

# Install global Angular CLI
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Disable Angular analytics
RUN ng analytics off

# Expose the default Angular port
EXPOSE 4200

# Command to run the Angular development server
CMD ["npm", "start"]