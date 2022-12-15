# Group 4 COMP308 Project

This is a web application built for the final group project in course _COMP308 (Emerging Technologies)_ at [Centennial College](https://www.centennialcollege.ca/) in Winter 2022 semester.

## Project Overview

This app seeks to provide a platform for nurse-patient interactions with health monitoring capabilities.

### Purpose

- Design and code web apps using emerging web frameworks
- Build a Graph QL API using Express, Next.js, or Gatsby
- Build a Front-End (React or Svelte) that utilizes the Graph QL API
- Apply appropriate design patterns and principles
- Use Machine Learning to make intelligent use of data

## Project Structure

The general structure looks like below.

```txt
project/
│
├─ client/            Workspace `client`
│  └─ src/
│     ├─ components/  React components that can be reused
│     ├─ pages/       React components that are decidated to a route
│     ├─ graphql/     Any queries, mutations, and fragments that are shared
│     ├─ index.js     Entry point for the client-side app
│     └─ App.js       Layout and top-level routes configuration
│
├─ server/            Workspace `server`
│  ├─ config/         Config values that can change the application runtime
│  ├─ models/         Database models
│  ├─ controllers/    Controllers that can be called in GraphQL API
│  ├─ graphql/        GraphQL schema definitions and resolvers
│  └─ index.js        Entry point for the server-side app with Express config
│
├─ package.json
└─ .graphqlrc.js      Config for GraphQL language server and code generation
```

### NPM Workspaces

This project utilises [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). This enables you to have only one `node_modules` folder in the whole project and run npm scripts in the workspaces without actually going into the folder. The folder names are the names of the workspaces; `server` and `client` are the names in this project.

In the top-level `package.json` file, there are some scripts pre-defined to facilitate the development experience. The two commands below will be the mostly used ones.

#### `npm run dev:server`

This script will run two things in parallel: `npm run dev:graphql` and `npm run dev:server-only`. The graphql part is for generating type information from the graphql schema and operations we write. The server part is for watching for changes in javascript code and restarting the server.

#### `npm run dev:client`

This will start a dev server for the client-side code driven by `react-scripts`. It is equivalent to going into the client directory and running `npm start`.

#### Installing Dependencies

If you want to add a dependency to the project, first think about if it is needed only on server, only on client, or on both. If you need it in both apps, you could just install it normally with `npm i <package>`.

If the package is only needed on the server, you can use `npm -w server i <package>`. Same for the client, `npm -w client i <package>`.

### `graphql-codegen`

This is a tool that generates variety of code from a schema. In this project, it is used for providing type information so that vscode can provide more detailed autocompletion and error reporting. Since we are not using typescript, if you wish to utilise this feature, [you have to explicitly specify it](#typing-shenanigans).

#### Defining Schema

GraphQL schema definition files are all in `server/graphql` folder. You will notice that the schema is separated into several `*.graphql` and `*.graphql.js` files. The `index.js` file aggregates all of those when the server starts and combines them into one schema.

I did over-separate the files at the beginning. It was to demonstrate that this kind of thing is possible, and we can use that feature to work on our own tasks while not interfering much with each other's work.

The rule of thumb is to group the fields and operations (queries and mutations) in regards to business domain. One object type can have its fields defined across several files.

##### But What Are Those `*.graphql.js` Files

Sorry, I tried my best to keep the structure that was shown in class examples, but that approach just has too many limits. On the bright side, because of a little bit of change, we now also have `DateTime` scalar type in our schema. You just need to be careful about the type signatures of the resolvers, but that shouldn't be too bad if you utilise the type information.

#### Client-Side Operations

For queries and mutations, the generated type information provides the structure of the returned type and what variables to input. To use it, you first need to write your operation in literal strings (using backticks, not quotes) followed by `gql` tag.

```js
import { gql } from "@apollo/client";

const MY_QUERY = gql`
  query MyQuery($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;
```

If the GraphQL extension for vscode is working properly, you'll also get helpful autocompletions while typing the operation. I say _if_ because it's been a bit buggy from time to time. If it's not working, maybe try restarting the extension.

Next, you need to save the code and let `graphql-codegen` run. If you're running `npm run dev:server` or `npm run dev:graphql`, it should be automatically done when you save. After that, add a type information about the operation you just wrote like below:

```js
/** @type {typeof import("../graphql.gen").MyQueryDocument} */
const MY_QUERY = gql`
query MyQuery(...) {
  ...
}
`;
```

The part inside `import` might differ a little bit depending on where your file is, but it just needs to point to the `graphql.gen.d.ts` file at the root of the client app directory. The name to put after the `.` depends on how you name your operation, either after `query` or `mutation`. Lastly, that `typeof` at the front is important, so don't forget to put it.

After that, you'll be able to use your operation and get type hints and autocompletion.

```js
import { gql, useQuery } from "@apollo/client";

export default function MyComponent() {
  const { data, loading, error } = useQuery(MY_QUERY);

  return <div>{data?.signIn?.token}</div>;
  // yay autocompletion
}
```

### Typing Shenanigans

Specifying type information in javascript is done in the form of writing JSDocs. It starts with `/**` and ends with `*/`. Special tags that start with `@` are used to state specific properties of whatever is being described, and type information is one of them.

#### Specifying Type for a Variable/Function/Property/etc

The JSDoc block below specifies that `someVariable` has a type is that declared in another file.

```js
/**
 * Optional summary/overview statement
 * @type {import("../some-generated-file").SomeGeneratedType}
 */
const someVariable = ...;
```

#### Giving a New Name to a Type

The JSDoc bloc below gives a new name to the specified type. This is useful when the expression for the type gets too long and complicated especially because of `import`s.

```js
/**
 * Optional explanation/summary
 * @typedef {import("./something.gen").GenericType<ParamType, string>} NewName
 */
// Since @typedef is for defining a type, it is not followed by a value
```
