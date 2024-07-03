import PrismaClient from "../../lib/prisma";
import { createReservation } from "../createReservation.mutation";

describe("findRestaurants", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should succeed", async () => {
    const eaterIds = [1];
    const reservationTime = new Date(Date.now() + 11 * 60 * 1000);
    const restaurantId = 1;

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    (PrismaClient.restaurant.findUnique as jest.Mock) = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        name: "Restaurant",
        endorsements: ["Vegan"],
        tables: [{ id: 1, capacity: 2, reservations: [] }],
      });

    (PrismaClient.reservation.create as jest.Mock) = jest
      .fn()
      .mockResolvedValue({
        id: 999,
      });

    const result = await createReservation({
      eaterIds,
      reservationTime,
      restaurantId,
    });

    expect(result).toEqual({
      id: 999,
    });
  });

  it("should throw an error if one or more eaters were not found", async () => {
    const eaterIds = [1, 2, 3];
    const reservationTime = new Date(Date.now() + 11 * 60 * 1000);
    const restaurantId = 1;

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    try {
      await createReservation({ eaterIds, reservationTime, restaurantId });
    } catch (e) {
      expect(e.message).toBe("One or more eaters not found");
    }
  });

  it("should throw an error if restaurant is not found", async () => {
    const eaterIds = [1];
    const reservationTime = new Date(Date.now() + 11 * 60 * 1000);
    const restaurantId = 2;

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    (PrismaClient.restaurant.findUnique as jest.Mock) = jest
      .fn()
      .mockResolvedValue(false);

    try {
      await createReservation({ eaterIds, reservationTime, restaurantId });
    } catch (e) {
      expect(e.message).toBe("Restaurant does not have this time available");
    }
  });

  it("should throw an error if there arent tables available", async () => {
    const eaterIds = [1];
    const reservationTime = new Date(Date.now() + 11 * 60 * 1000);
    const restaurantId = 1;

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    (PrismaClient.restaurant.findUnique as jest.Mock) = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        name: "Restaurant",
        endorsements: ["Vegan"],
        tables: [],
      });

    try {
      await createReservation({ eaterIds, reservationTime, restaurantId });
    } catch (e) {
      expect(e.message).toBe("No available table for the requested time");
    }
  });

  it("should throw an error if reservation time is less than 10 minutes in the future", async () => {
    const eaterIds = [1, 2, 3];
    const reservationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in the future
    const restaurantId = 1;

    try {
      await createReservation({ eaterIds, reservationTime, restaurantId });
    } catch (e) {
      expect(e.message).toBe(
        "The reservation time must be at least 10 minutes in the future"
      );
    }
  });
});
