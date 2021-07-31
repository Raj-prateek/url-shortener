FROM node:14.17.4-stretch-slim

# Creating the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Adding node_modules
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Adding package.json & package-lock.json
ADD package.json /usr/src/app/package.json
ADD package-lock.json /usr/src/app/package-lock.json

# Install package
RUN npm install --production

# Add all files to the working directory
ADD . /usr/src/app

# Run application
CMD node /usr/src/app/
