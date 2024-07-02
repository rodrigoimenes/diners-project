import "reflect-metadata";
import { Arg, Resolver, Query, Mutation } from "type-graphql";
import { Restaurant } from "../schemas/restaurant.schema";
import { findRestaurants } from "../queries/findRestaurants.query";
import { FindRestaurantsInput } from "../inputs/findRestaurants.input";
import { Reservation } from "../schemas/reservation.schema";
import { createReservation } from "../mutations/createReservation.mutation";
import { CreateReservationInput } from "../inputs/createReservation.input";
import { CancelReservationInput } from "../inputs/cancelReservation.input";
import { cancelReservation } from "../mutations/cancelReservation.mutation";

@Resolver()
export class RestaurantResolver {
  @Query((returns) => [Restaurant])
  async findRestaurants(
    @Arg("data") findRestaurantsInput: FindRestaurantsInput
  ): Promise<Restaurant[]> {
    return findRestaurants(findRestaurantsInput);
  }

  @Mutation((returns) => Reservation)
  async createReservation(
    @Arg("data") createReservationInput: CreateReservationInput
  ): Promise<Reservation> {
    return createReservation(createReservationInput);
  }

  @Mutation((returns) => Reservation)
  async cancelReservation(
    @Arg("data") cancelReservationInput: CancelReservationInput
  ): Promise<Reservation> {
    return cancelReservation(cancelReservationInput);
  }
}
