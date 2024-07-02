import "reflect-metadata";
import { Field, ObjectType, ID } from "type-graphql";
import { Restaurant } from "./restaurant.schema";

@ObjectType()
export class Table {
  @Field((type) => ID)
  id!: number;

  @Field()
  capacity!: number;

  @Field((type) => Restaurant)
  restaurant!: Restaurant;
}
