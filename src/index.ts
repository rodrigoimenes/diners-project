import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { RestaurantResolver } from "./resolvers/restaurant.resolver";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const schema = await buildSchema({
    resolvers: [RestaurantResolver],
    emitSchemaFile: true,
  });

  new ApolloServer({
    schema,
  }).listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at: <http://localhost:${process.env.PORT}>`)
  );
}

main();
