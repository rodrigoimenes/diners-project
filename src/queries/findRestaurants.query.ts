import "reflect-metadata";
import { Restaurant } from "../schemas/restaurant.schema";
import { FindRestaurantsInput } from "../inputs/findRestaurants.input";
import { ApolloError } from "apollo-server";
import prisma from "../lib/prisma";

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
          name: true,
        },
      },
    },
  });

  if (eaters.length !== groupSize) {
    throw new ApolloError("One or more eater(s) were not found", "404");
  }

  const endorsements = new Set(
    eaters.flatMap((eater) => eater.endorsements.map((dr) => dr.name))
  );

  const restaurants = await prisma.restaurant.findMany({
    where: {
      AND: Array.from(endorsements).map((restriction) => ({
        endorsements: {
          some: {
            name: restriction,
          },
        },
      })),
    },
    include: {
      tables: {
        where: {
          capacity: { gte: groupSize },
          reservations: {
            none: {
              start: {
                gte: reservationTime,
                lt: new Date(reservationTime.getTime() + 2 * 60 * 60 * 1000),
              },
            },
          },
        },
      },
    },
  });

  const availableRestaurants = restaurants.filter(
    (restaurant) => restaurant.tables.length > 0
  );

  return availableRestaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
  })) as Restaurant[];
}
