/*
  Warnings:

  - You are about to alter the column `estado_maquina` on the `maquinarias` table. The data in that column could be lost. The data in that column will be cast from `Char(100)` to `Enum(EnumId(4))`.
  - Added the required column `categoria` to the `maquinarias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `maquinarias` ADD COLUMN `categoria` VARCHAR(191) NOT NULL,
    MODIFY `estado_maquina` ENUM('A', 'I') NOT NULL DEFAULT 'A';

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `imagen` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `imagenes` (
    `id_atributo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_maquinaria` INTEGER NOT NULL,
    `atributo` VARCHAR(191) NOT NULL,

    INDEX `FK_IMAGENES_IDMAQUINARIA`(`id_maquinaria`),
    PRIMARY KEY (`id_atributo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `imagenes` ADD CONSTRAINT `FK_IMAGENES_IDMAQUINARIA` FOREIGN KEY (`id_maquinaria`) REFERENCES `maquinarias`(`id_maquinaria`) ON DELETE RESTRICT ON UPDATE RESTRICT;
