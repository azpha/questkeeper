FROM node:22
WORKDIR /usr/src/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package*.json ./
COPY pnpm-*.yaml ./

COPY . ./
RUN pnpm i

ENV NODE_ENV production
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm run start"]