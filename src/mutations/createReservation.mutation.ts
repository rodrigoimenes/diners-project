import "reflect-metadata";
import { CreateReservationInput } from "../inputs/createReservation.input";
import { Reservation } from "../schemas/reservation.schema";
import { ApolloError } from "apollo-server";
import prisma from "../lib/prisma";

export async function createReservation(
  data: CreateReservationInput
): Promise<Reservation> {
  const { reservationTime: time, eaterIds, restaurantId } = data;

  const reservationTime = new Date(time);

  // Check if the reservation time is at least 10 minutes in the future
  const now = new Date();
  const minFutureTime = new Date(now.getTime() + 10 * 60 * 1000);
  if (reservationTime <= minFutureTime) {
    throw new ApolloError(
      "The reservation time must be at least 10 minutes in the future",
      "400"
    );
  }

  // Check if all eaters exist
  const eaters = await prisma.eater.findMany({
    where: { id: { in: eaterIds } },
  });

  if (eaters.length !== eaterIds.length) {
    throw new ApolloError("One or more eaters not found", "404");
  }

  // Check if the restaurant exists and find an available table
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      tables: {
        include: {
          reservations: {
            where: {
              start: {
                gte: new Date(reservationTime.getTime() - 2 * 60 * 60 * 1000),
                lte: new Date(reservationTime.getTime() + 2 * 60 * 60 * 1000),
              },
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    throw new ApolloError("Restaurant not found", "404");
  }

  // Check if there is an available table for the group size
  const groupSize = eaterIds.length;
  const table = restaurant.tables.find(
    (table) => table.capacity >= groupSize && table.reservations.length === 0
  );

  if (!table) {
    throw new ApolloError("No available table for the requested time", "409");
  }

  // Create the reservation
  const reservation = await prisma.reservation.create({
    data: {
      start: reservationTime,
      end: new Date(reservationTime.getTime() + 2 * 60 * 60 * 1000),
      table: {
        connect: { id: table.id },
      },
      eaters: {
        connect: eaters.map((eater) => ({ id: eater.id })),
      },
    },
    include: {
      table: {
        include: {
          restaurant: true,
        },
      },
      eaters: true,
    },
  });

  return reservation;
}
