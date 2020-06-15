FROM node:12

WORKDIR /usr/src/backendapi 

COPY ./ ./ 

RUN npm install 

EXPOSE 3000

CMD ["npm", "start"]