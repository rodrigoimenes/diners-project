import "reflect-metadata";
import prisma from "../lib/prisma";
import { CancelReservationInput } from "../inputs/cancelReservation.input";
import { Reservation } from "../schemas/reservation.schema";
import { ApolloError } from "apollo-server";

export async function cancelReservation(
  data: CancelReservationInput
): Promise<Reservation> {
  const { reservationId } = data;
  // Check if the reservation exists
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      table: {
        include: {
          restaurant: true,
        },
      },
      eaters: true,
    },
  });

  if (!reservation) {
    throw new ApolloError("Reservation was not found", "404");
  }

  await prisma.reservation.delete({
    where: { id: reservationId },
  });

  return reservation;
}
