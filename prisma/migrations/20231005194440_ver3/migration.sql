/*
  Warnings:

  - You are about to alter the column `validacion_reserva` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Char(1)` to `Enum(EnumId(0))`.
  - You are about to alter the column `tipo_documento` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Char(2)` to `Enum(EnumId(1))`.
  - You are about to alter the column `tipo_usuario` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Char(1)` to `Enum(EnumId(2))`.

*/
-- DropIndex
DROP INDEX `credenciales_nombre_usuario_key` ON `credenciales`;

-- AlterTable
ALTER TABLE `reservas` MODIFY `validacion_reserva` ENUM('P', 'R', 'A') NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `estado_usuario` ENUM('A', 'I') NOT NULL DEFAULT 'A',
    MODIFY `tipo_documento` ENUM('CC', 'CE', 'PA') NOT NULL,
    MODIFY `tipo_usuario` ENUM('A', 'C') NOT NULL;
