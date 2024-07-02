import { findRestaurants } from "../findRestaurants.query";
import PrismaClient from "../../lib/prisma";

describe("findRestaurants", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return restaurants with available tables that meet dietary restrictions", async () => {
    const eaterIds = [1];
    const reservationTime = new Date("2025-07-01T19:30:00");

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    (PrismaClient.restaurant.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([
        {
          id: 1,
          name: "Vegan Palace",
          endorsements: ["Vegan"],
          tables: [{ id: 1, capacity: 4, reservations: [] }],
        },
        {
          id: 2,
          name: "Testaurant",
          endorsements: ["Paleo"],
          tables: [],
        },
      ]);

    const result = await findRestaurants({ eaterIds, reservationTime });

    expect(result).toEqual([
      {
        id: 1,
        name: "Vegan Palace",
      },
    ]);
  });

  it("should throw an error if reservation time is less than 10 minutes in the future", async () => {
    const eaterIds = [1, 2, 3];
    const reservationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in the future

    try {
      await findRestaurants({ eaterIds, reservationTime });
    } catch (e) {
      expect(e.message).toBe(
        "Reservation date must be at least 10 minutes from now!"
      );
    }
  });

  it("should throw an error if eaters were not found", async () => {
    const eaterIds = [1, 2, 3];
    const reservationTime = new Date(Date.now() + 11 * 60 * 1000);

    (PrismaClient.eater.findMany as jest.Mock) = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Scott", endorsements: ["Vegan"] }]);

    try {
      await findRestaurants({ eaterIds, reservationTime });
    } catch (e) {
      expect(e.message).toBe("One or more eater(s) were not found");
    }
  });
});
