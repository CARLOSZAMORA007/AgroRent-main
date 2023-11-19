/*
  Warnings:

  - A unique constraint covering the columns `[documento_usuario]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo_usuario]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `usuarios_documento_usuario_key` ON `usuarios`(`documento_usuario`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_correo_usuario_key` ON `usuarios`(`correo_usuario`);
