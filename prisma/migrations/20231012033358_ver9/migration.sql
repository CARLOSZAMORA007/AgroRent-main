/*
  Warnings:

  - A unique constraint covering the columns `[id_crdencial]` on the table `credenciales` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `credenciales_id_crdencial_key` ON `credenciales`(`id_crdencial`);
