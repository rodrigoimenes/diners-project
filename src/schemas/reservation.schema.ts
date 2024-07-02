import "reflect-metadata";
import { Field, ObjectType, ID } from "type-graphql";
import { Table } from "./table.schema";
import { Eater } from "./eater.schema";

@ObjectType()
export class Reservation {
  @Field((type) => ID)
  id!: number;

  @Field((type) => Table)
  table!: Table;

  @Field((type) => [Eater])
  eaters!: Eater[];

  @Field()
  start!: Date;

  @Field()
  end!: Date;
}
