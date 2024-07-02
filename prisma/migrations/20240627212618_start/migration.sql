-- CreateTable
CREATE TABLE "Eater" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Eater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endorsement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "capacity" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "tableId" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EaterToEndorsement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EaterToReservation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EndorsementToRestaurant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EaterToEndorsement_AB_unique" ON "_EaterToEndorsement"("A", "B");

-- CreateIndex
CREATE INDEX "_EaterToEndorsement_B_index" ON "_EaterToEndorsement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EaterToReservation_AB_unique" ON "_EaterToReservation"("A", "B");

-- CreateIndex
CREATE INDEX "_EaterToReservation_B_index" ON "_EaterToReservation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EndorsementToRestaurant_AB_unique" ON "_EndorsementToRestaurant"("A", "B");

-- CreateIndex
CREATE INDEX "_EndorsementToRestaurant_B_index" ON "_EndorsementToRestaurant"("B");

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EaterToEndorsement" ADD CONSTRAINT "_EaterToEndorsement_A_fkey" FOREIGN KEY ("A") REFERENCES "Eater"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EaterToEndorsement" ADD CONSTRAINT "_EaterToEndorsement_B_fkey" FOREIGN KEY ("B") REFERENCES "Endorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EaterToReservation" ADD CONSTRAINT "_EaterToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Eater"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EaterToReservation" ADD CONSTRAINT "_EaterToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EndorsementToRestaurant" ADD CONSTRAINT "_EndorsementToRestaurant_A_fkey" FOREIGN KEY ("A") REFERENCES "Endorsement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EndorsementToRestaurant" ADD CONSTRAINT "_EndorsementToRestaurant_B_fkey" FOREIGN KEY ("B") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
