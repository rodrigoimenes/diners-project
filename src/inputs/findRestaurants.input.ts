import "reflect-metadata";
import { Field, InputType } from "type-graphql";

@InputType()
export class FindRestaurantsInput {
  @Field(() => [Number])
  eaterIds: number[];

  @Field()
  reservationTime!: Date;
}
