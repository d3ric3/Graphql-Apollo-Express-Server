# Sample Code for Graphql Apollo Express Server

### Configure the project environment variables

1. Rename .env-sample to .env
2. provide mongodb URL to DB environment variable in .env file

### Run the project in dev mode

```javascript
  npm run dev
```

### Sample Graphql query

#### You may copy the sample query and paste into the Graphql playground at http://localhost:4000/graphql to start testing the query

```javascript
# Write your query or mutation here
mutation registerUser {
  register(
    name: "Derice Kong",
    email: "dericekong@gmail.com",
    username: "dericekong",
    password: "Pass@word1"
  ) {
    user{
      id
      username
      email
      name
    }
    token
    refreshToken
  }
}

query loginUser {
  login(
    username: "dericekong",
  	password: "Pass@word1"
  ){
    user {
      id
      username
      name
      email
    }
    token
    refreshToken
  }
}

query userProfile {
  profile {
    name
    username
    email
    id
  }
}

query refreshToken {
  refreshToken{
    user{
      id
      email
      username
      name
    }
    token
    refreshToken
  }
}

query userList {
  users{
    email
    name
    username
    id
  }
}

```

### Insert Authorization / refresh_token in Graphql Playground

1. Go to http://localhost:4000/graphql
2. Perform loginUser query to get the **_token_** and **_refeshToken_**
3. Look for **_QUERY VARIABLES / HTTP HEADERS_** section located at the bottom left of the graphql playground
4. Insert

```javascript
  {
  "Authorization": "your_token_here",
  "refresh_token": "your_refresh_token_here"
}
```
