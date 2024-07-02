const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const endorsements = ["Gluten Free", "Vegetarian", "Paleo", "Vegan"];
  const endorsementsObj = {};

  for (const name of endorsements) {
    const endo = await prisma.endorsement.create({ data: { name } });
    endorsementsObj[endo.name] = endo;
  }

  await prisma.restaurant.create({
    data: {
      name: "u.to.pi.a",
      endorsements: {
        connect: [
          { id: endorsementsObj["Vegetarian"].id },
          { id: endorsementsObj["Vegan"].id },
        ],
      },
      tables: {
        create: [{ capacity: 2 }, { capacity: 2 }],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Falling Piano Brewing Co",
      tables: {
        create: [
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 6 },
          { capacity: 6 },
          { capacity: 6 },
          { capacity: 6 },
          { capacity: 6 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Tetetlán",
      endorsements: {
        connect: [
          { id: endorsementsObj["Gluten Free"].id },
          { id: endorsementsObj["Paleo"].id },
        ],
      },
      tables: {
        create: [
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 6 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Lardo",
      endorsements: {
        connect: { id: endorsementsObj["Gluten Free"].id },
      },
      tables: {
        create: [
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 4 },
          { capacity: 4 },
          { capacity: 6 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Panadería Rosetta",
      endorsements: {
        connect: [
          { id: endorsementsObj["Gluten Free"].id },
          { id: endorsementsObj["Vegetarian"].id },
        ],
      },
      tables: {
        create: [
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 2 },
          { capacity: 4 },
          { capacity: 4 },
        ],
      },
    },
  });

  const eaters = {
    Michael: { endorsements: ["Vegetarian"] },
    "George Michael": { endorsements: ["Vegetarian", "Gluten Free"] },
    Lucile: { endorsements: ["Gluten Free"] },
    Gob: { endorsements: ["Paleo"] },
    Tobias: {},
    Maeby: { endorsements: ["Vegan"] },
  };

  for (var key in eaters) {
    if (eaters.hasOwnProperty(key)) {
      const connectObj = eaters[key].endorsements
        ? {
            connect: eaters[key].endorsements.map((name) => ({
              id: endorsementsObj[name].id,
            })),
          }
        : {};
      await prisma.eater.create({
        data: {
          name: key,
          endorsements: connectObj,
        },
      });
    }
  }

  console.log("Database has been seeded! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
