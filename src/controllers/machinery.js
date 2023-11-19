const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const prisma = new PrismaClient();

const createMachinery = async (req, res) =>{
    let body = req.body;
    try{
        const user = await prisma.usuarios.findUnique({
            where:{
                documento_usuario: body.documento_usuario,
            }
        });
        console.log(user)
        const create = await prisma.maquinarias.create({
            data:{ 
                id_usuario : user.id_usuario,
                nombre_maquina : body.nombre_maquina, 
                descripcion_maquina: body.descripcion_maquina,
                categoria : body.categoria,
                placa_maquina: body.placa_maquina,
                modelo_maquina : body.modelo_maquina,
                precio_hora : body.precio_hora
            }
        });
        if(body.path.length > 0){
            image(body.path, create.id_maquinaria, res)
        }
        res.status(200).json({mesanje:"maquinaria creada"})
    }catch(error){
        console.log(error.code)
        if(error instanceof TypeError){
            res.status(404).json({mesanje:"usuario no encontrado"})
        }else{
            res.status(500).json({mesanje:"error al agregar la maquinaria"})
        }
    }
}

const getMachinery = async (req, res)=>{
    try {
        const getMachinery = await prisma.maquinarias.findMany();
        const paths = await prisma.imagenes.findMany();
        const mapMachinery = mapMachineryT(getMachinery, paths);
        res.status(200).json(mapMachinery);
    } catch (error) {
        console.error(error)
        res.status(500).json({mesanje : "error al mostar las maquinaria"}); 
    }
}

const filterCategory = async (req, res) =>{
    let body = req.query
    if(req.query.id){
        body = { id_maquinaria: parseInt(body.id) }
    }
    try{
        const category = await prisma.maquinarias.findMany({
            where: body
        });
        const paths = await prisma.imagenes.findMany();
        const mapMachinery = mapMachineryT(category, paths);
        res.status(200).json(mapMachinery);
    }catch(error){
        console.error(error)
        if(error.message.includes("Argument `id_maquinaria` is missing.")){
            res.status(404).json({mesanje:"El valor ingresado es incorrecto"})
        }else{
            res.status(500).json({mesanje : "error al mostar las maquinaria"});
        }
    }
}

async function image(body, machinery, res){
    try{
        for (let i = 0; i< body.length; i++){
            const image = await prisma.imagenes.create({
                data:{
                    id_maquinaria : machinery,
                    path : body[i]
                }
            }
            );
        }
    }catch(error){
        res.status(500).json({mensaje: "error al agregar la maquinaria"})
    }
}

function mapMachineryT(getMachinery, paths){
    const mapMachinery = getMachinery.map((maquinarias) => {
        return {
            id_maquinaria : maquinarias.id_maquinaria,
            id_usuario : maquinarias.id_usuario,
            nombre_maquina : maquinarias.nombre_maquina, 
            descripcion_maquina : maquinarias.descripcion_maquina,
            categoria : maquinarias.categoria,
            placa_maquina : maquinarias.placa_maquina,
            modelo_maquina : maquinarias.modelo_maquina,
            estado_maquina : maquinarias.estado_maquina,
            precio_hora : maquinarias.precio_hora,
            path : getPaths(paths, maquinarias.id_maquinaria)
        }
    });
    return mapMachinery
}

function getPaths(images, id_maquinaria){
    if (Array.isArray(images)) {
        const filter = images.filter(object => object.id_maquinaria === id_maquinaria);
        // Extraer los valores de "path" de los objetos filtrados
        return filter.map(object => object.path)
      } else {
        return[]
      }
}



module.exports={createMachinery, getMachinery, filterCategory};
