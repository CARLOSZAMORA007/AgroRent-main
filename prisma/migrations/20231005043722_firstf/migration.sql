-- CreateTable
CREATE TABLE `alquiler_maquinas` (
    `id_alquiler` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reserva` INTEGER NOT NULL,
    `costo_hora_alquiler` FLOAT NOT NULL,
    `fecha_hora_entrega` DATETIME(0) NOT NULL,
    `costo_total_alquiler` FLOAT NOT NULL,

    INDEX `FK_ALQUILER_IDERESERVA`(`id_reserva`),
    PRIMARY KEY (`id_alquiler`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credenciales` (
    `id_crdencial` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` CHAR(30) NOT NULL,
    `contrasena_usuario` CHAR(20) NOT NULL,

    PRIMARY KEY (`id_crdencial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maquinarias` (
    `id_maquinaria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `nombre_maquina` CHAR(20) NOT NULL,
    `descripcion_maquina` CHAR(100) NOT NULL,
    `placa_maquina` CHAR(6) NULL,
    `modelo_maquina` CHAR(50) NULL,
    `estado_maquina` CHAR(100) NOT NULL,
    `precio_hora` FLOAT NOT NULL,

    INDEX `FK_MAQUINARI_IDUSUARIO`(`id_usuario`),
    PRIMARY KEY (`id_maquinaria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `multas` (
    `id_multa` INTEGER NOT NULL AUTO_INCREMENT,
    `id_alquiler` INTEGER NOT NULL,
    `nombre_multa` CHAR(15) NOT NULL,
    `descripcion_multa` CHAR(100) NOT NULL,
    `precio_multa` FLOAT NOT NULL,

    INDEX `FK_MULTAS_IDALQUILER`(`id_alquiler`),
    PRIMARY KEY (`id_multa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_maquinaria` INTEGER NOT NULL,
    `fecha_hra_inicio` DATETIME(0) NOT NULL,
    `facha_hora_fin` DATETIME(0) NOT NULL,
    `validacion_reserva` CHAR(1) NOT NULL,

    INDEX `FK_RESERVAS_IDMAQUINARIA`(`id_maquinaria`),
    INDEX `FK_RESERVAS_IDUSUARIO`(`id_usuario`),
    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `credenciales_id_crdencial` INTEGER NOT NULL,
    `nombre_usuario` CHAR(50) NOT NULL,
    `apellido_usuario` CHAR(50) NOT NULL,
    `tipo_documento` CHAR(2) NOT NULL,
    `documento_usuario` CHAR(25) NOT NULL,
    `numero_celu_usuario` INTEGER NOT NULL,
    `correo_usuario` CHAR(60) NOT NULL,
    `tipo_usuario` CHAR(1) NOT NULL,

    INDEX `fk_usuarios_credenciales1_idx`(`credenciales_id_crdencial`),
    UNIQUE INDEX `usuarios_id_usuario_key`(`id_usuario`),
    PRIMARY KEY (`id_usuario`, `credenciales_id_crdencial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alquiler_maquinas` ADD CONSTRAINT `FK_ALQUILER_IDERESERVA` FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `maquinarias` ADD CONSTRAINT `FK_MAQUINARI_IDUSUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `multas` ADD CONSTRAINT `FK_MULTAS_IDALQUILER` FOREIGN KEY (`id_alquiler`) REFERENCES `alquiler_maquinas`(`id_alquiler`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `FK_RESERVAS_IDMAQUINARIA` FOREIGN KEY (`id_maquinaria`) REFERENCES `maquinarias`(`id_maquinaria`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `FK_RESERVAS_IDUSUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_credenciales1` FOREIGN KEY (`credenciales_id_crdencial`) REFERENCES `credenciales`(`id_crdencial`) ON DELETE NO ACTION ON UPDATE NO ACTION;
