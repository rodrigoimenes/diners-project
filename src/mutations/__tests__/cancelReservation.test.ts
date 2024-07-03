import PrismaClient from "../../lib/prisma";
import { cancelReservation } from "../cancelReservation.mutation";

describe("cancelReservation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should succeed canceling a valid reservation", async () => {
    const reservationId = 1;

    (PrismaClient.reservation.findUnique as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1 }]);

    (PrismaClient.reservation.delete as jest.Mock) = jest
      .fn()
      .mockResolvedValue(true);

    const result = await cancelReservation({ reservationId });

    expect(result).toEqual([
      {
        id: 1,
      },
    ]);
  });

  it("should throw an error if reservation were not found", async () => {
    const reservationId = 2;

    (PrismaClient.reservation.findUnique as jest.Mock) = jest
      .fn()
      .mockResolvedValue(false);

    try {
      await cancelReservation({ reservationId });
    } catch (e) {
      expect(e.message).toBe("Reservation was not found");
    }
  });
});
