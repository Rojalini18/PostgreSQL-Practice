const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

//1
const typeDefs = gql`
  type Posts {
    id: Int
    login: String
    type: String
    avatar_url: String
  }

  type Query {
    posts: [Posts]
  }
`;

//2
const resolvers = {
  Query: {
    posts: async () => {
      try {
        const posts = await axios.get("https://api.github.com/users");
        return posts.data.map(({ id, login, type, avatar_url }) => ({
          id,
          login,
          type,
          avatar_url,
        }));
      } catch (err) {
        throw err;
      }
    },
  },
};

// 3
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen(4000)
  .then(({ url }) => console.log(`Server is running on ${url}`));
