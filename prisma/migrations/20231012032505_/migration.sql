/*
  Warnings:

  - A unique constraint covering the columns `[credenciales_id_crdencial]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `usuarios_credenciales_id_crdencial_key` ON `usuarios`(`credenciales_id_crdencial`);
