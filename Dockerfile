FROM amd64/node:alpine3.15
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
