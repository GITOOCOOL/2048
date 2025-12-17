# Dockerfile Official Reference (Condensed)
*Source: docs.docker.com/engine/reference/builder/*

## Common Instructions

### FROM
`FROM <image>[:<tag>]`
Initializes a new build stage and sets the base image.
- Example: `FROM node:18-alpine`

### WORKDIR
`WORKDIR /path/to/workdir`
Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions that follow it.
- Example: `WORKDIR /app`

### COPY
`COPY <src>... <dest>`
Copies new files or directories from `<src>` and adds them to the filesystem of the container at the path `<dest>`.
- **Best Practice**: Copy `package.json` first, then run install, then copy source code (to leverage caching).
- Example: `COPY package*.json ./`

### RUN
`RUN <command>`
Executes any commands in a new layer on top of the current image and commits the results.
- Example: `RUN npm install`

### EXPOSE
`EXPOSE <port> [<port>/<protocol>...]`
Informs Docker that the container listens on the specified network ports at runtime. DOES NOT actually publish the port (use `-p` or `ports` in compose for that).
- Example: `EXPOSE 3000`

### CMD
`CMD ["executable","param1","param2"]` (Exec form, preferred)
The main purpose of a CMD is to provide defaults for an executing container. There can only be one CMD instruction in a Dockerfile.
- Example: `CMD ["npm", "run", "start"]`

### ENV
`ENV <key>=<value> ...`
Sets the environment variable `<key>` to the value `<value>`.
- Example: `ENV NODE_ENV=production`
