import "reflect-metadata";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateReservationInput {
  @Field(() => [Number])
  eaterIds!: number[];

  @Field()
  reservationTime!: Date;

  @Field()
  restaurantId: number;
}
