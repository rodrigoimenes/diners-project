import "reflect-metadata";
import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
export class Eater {
  @Field((type) => ID)
  id!: number;

  @Field()
  name!: string;
}
