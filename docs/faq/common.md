# Common errors


During your development with NestJS, you may encounter various errors as you learn the framework. This page will try to list the most common errors and how to fix them.

### Cannot find module 'typescript'

For now, anyone who has this issue has two options:

- Add typescript to dependencies in your package.json and run a project
- Comment out (or remove) `__exportStar(require("./typescript"), exports);` in `node_modules/nestjs-i18n/dist/utils/index.js`
