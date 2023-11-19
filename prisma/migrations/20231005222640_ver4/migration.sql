/*
  Warnings:

  - A unique constraint covering the columns `[nombre_usuario]` on the table `credenciales` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `credenciales_nombre_usuario_key` ON `credenciales`(`nombre_usuario`);
