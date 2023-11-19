const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

const createReserve = async (req, res) =>{
    body = req.body
    try{
        const create = await prisma.reservas.create({
            data:body
        });
        res.status(200).json({mensaje:"reserva creada"})
    }catch(error){
        console.error(error);
        console.log(error.meta.field_name)
        if(error.code == 'P2003'){
            if (error.meta.field_name =='id_usuario' ) {
                res.status(404).json({ mensaje: 'El usuario no se encontro' });
            }else if(error.meta.field_name == 'id_maquinaria'){
                res.status(404).json({ mensaje: 'La maquina no se encontro' });
            }
        }else{
            res.status(500).json({ mensaje: 'Error al crear la reserva' });
        }
    }
}

const date = async(req, res)=>{
    body = req.body;
    const get = await prisma.reservas.findMany();
    const mapReserve = get.map((reservas) => {
        return {
            fecha_hra_inicio : reservas.fecha_hra_inicio,
            facha_hora_fin : reservas.facha_hora_fin
        }
    });
    validateDate(mapReserve, body)
    console.log(mapReserve)
    res.status(200).json(mapReserve)
}

function validateDate(mapReserve, body){
    console.log(mapReserve.length);
    var rango1ContenidoEnRango2 = true;
    var rango2ContenidoEnRango1 = true;
    var count = 0;
    while(rango1ContenidoEnRango2 && rango2ContenidoEnRango1){
       // Definir los rangos
        const rango1 = {
            inicio: new Date(mapReserve[count].fecha_hra_inicio),
            fin: new Date(mapReserve[count].facha_hora_fin)
        };
        const rango2 = {
            inicio: new Date(body.fecha_hra_inicio),
            fin: new Date(body.facha_hora_fin)
        };
        
        rango1ContenidoEnRango2 = rango1.inicio >= rango2.inicio && rango1.fin <= rango2.fin;
        rango2ContenidoEnRango1 = rango2.inicio >= rango1.inicio && rango2.fin <= rango1.fin;
        const limiteInicioRango2EnRango1 = rango2.inicio >= rango1.inicio && rango2.inicio <= rango1.fin;
        const limiteFinRango2EnRango1 = rango2.fin >= rango1.inicio && rango2.fin <= rango1.fin;

        // Verificar si alguna fecha está contenida en el otro rango
        const fechaEnRango1 = rango2.inicio >= rango1.inicio && rango2.inicio <= rango1.fin;
        const fechaEnRango2 = rango1.inicio >= rango2.inicio && rango1.inicio <= rango2.fin;
        console.log(rango1ContenidoEnRango2, "  " , rango2ContenidoEnRango1, " ",limiteInicioRango2EnRango1,  " ", limiteFinRango2EnRango1,
        "  ", fechaEnRango1, "  ", fechaEnRango2)
        
        // Imprimir los resultados
        console.log('¿Rango1 está contenido en Rango2?', rango1ContenidoEnRango2);
        console.log('¿Rango2 está contenido en Rango1?', rango2ContenidoEnRango1);
        
    }
    const hola =rango1ContenidoEnRango2 && rango2ContenidoEnRango1? 'fecha acepatada' : 'fecha rechazada';
    console.log(hola)
}

module.exports={createReserve,date};