import "reflect-metadata";
import { Restaurant } from "../schemas/restaurant.schema";
import { FindRestaurantsInput } from "../inputs/findRestaurants.input";
import { ApolloError } from "apollo-server";
import prisma from "../lib/prisma";
import { RESERVATION_TIME } from "../lib/constants";

export async function findRestaurants(
  input: FindRestaurantsInput
): Promise<Restaurant[]> {
  const { eaterIds, reservationTime } = input;
  const groupSize = eaterIds.length;
  const now = new Date();
  const minFutureTime = new Date(now.getTime() + 10 * 60 * 1000);

  if (reservationTime <= minFutureTime) {
    throw new ApolloError(
      "Reservation date must be at least 10 minutes from now!",
      "400"
    );
  }

  const eaters = await prisma.eater.findMany({
    where: { id: { in: eaterIds } },
    include: {
      endorsements: {
        select: {
          id: true,
        },
      },
    },
  });

  if (eaters.length !== groupSize) {
    throw new ApolloError("One or more eater(s) were not found", "404");
  }

  const endorsements = Array.from(
    new Set(eaters.flatMap((eater) => eater.endorsements.map((dr) => dr.id)))
  );

  const restaurants = await prisma.restaurant.findMany({
    where: {
      tables: {
        some: {
          capacity: { gte: groupSize },
          reservations: {
            none: {
              start: {
                gte: reservationTime,
                lt: new Date(reservationTime.getTime() + RESERVATION_TIME),
              },
            },
          },
        },
      },
    },
    include: {
      tables: true,
      endorsements: true,
    },
  });

  const availableRestaurants = restaurants.filter(
    (restaurant) => restaurant.tables.length > 0
  );

  // Filter out restaurants that don't have all the required endorsements
  const filteredRestaurants = availableRestaurants.filter((restaurant) => {
    const restaurantEndorsements = restaurant.endorsements.map((e) => e.id);
    return endorsements.every((id) => restaurantEndorsements.includes(id));
  });

  return filteredRestaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
  }));
}
