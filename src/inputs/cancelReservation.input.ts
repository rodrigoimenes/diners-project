import "reflect-metadata";
import { Field, InputType } from "type-graphql";

@InputType()
export class CancelReservationInput {
  @Field()
  reservationId: number;
}
