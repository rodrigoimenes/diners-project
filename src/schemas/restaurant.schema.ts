import "reflect-metadata";
import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
export class Restaurant {
  @Field((type) => ID)
  id!: number;

  @Field()
  name!: string;
}
