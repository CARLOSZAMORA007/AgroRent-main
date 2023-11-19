const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {encrypt, compare} = require('../hendleB/handleBcrypt.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const login = async (req, res) =>{
    let body = req.body;
    console.log(process.env.ACCES_TOKEN);
    try{
        let credencial = await prisma.credenciales.findUnique({
            where:{
                nombre_usuario: body.nombre_user,
            },
        });
        if(credencial === null){
            credencial = await prisma.usuarios.findUnique({
                where:{
                    correo_usuario:body.nombre_user,
                }
            });
            credencial = await prisma.credenciales.findUnique({
                where:{
                    id_crdencial: credencial.credenciales_id_crdencial,
                }
            });
        }
        const user =  await prisma.usuarios.findFirst({
            where:{
                credenciales_id_crdencial: credencial.id_crdencial,
            }, include:{
                credenciales:{
                    select: {
                        nombre_usuario: true // El nombre de usuario de la tabla "credenciales"
                    }
                }
            }
        });
       
        const checkPassword = await compare(body.contrasena_usuario, credencial.contrasena_usuario);
        if(checkPassword && user.estado_usuario == 'A'){  
            /*const accesToken = jwt.sign({tipo_usuario:user.tipo_usuario}, process.env.ACCES_TOKEN,{
                expiresIn:'8m'
            });
            res.status(200).json(accesToken);*/
            res.status(200).json(mapUsersF(user));
        }else if(credencial){
            throw new Error("P2002")
        }
    }catch(error){
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.message === "P2002") {
            if (!error instanceof TypeError && error.meta.target.includes('nombre_usuario')) {
                res.status(404).json({ mensaje: 'ya hay alaguien con ese documento ' }); 
           }else{
                res.status(404).json({ mensaje: "Contrasena o Usuario invalido" });
           }
        } else if(error instanceof TypeError){
            res.status(404).json({ mensaje: "Contrasena o Usuario invalido" });
        } else {
            res.status(500).json({ mensaje: "Error al iniciar sesion" });
        }
    }
}

const recoverPassword = async(req, res) =>{
    let body = req.body;
    try {
        let credencial = await prisma.credenciales.findUnique({
            where:{
                nombre_usuario: body.nombre_user,
            },
        });
        if(credencial === null){
            credencial = await prisma.usuarios.findUnique({
                where:{
                    correo_usuario:body.nombre_user,
                }
            });
            credencial = await prisma.credenciales.findUnique({
                where:{
                    id_crdencial: credencial.credenciales_id_crdencial,
                }
            });
        }
        const user =  await prisma.usuarios.findFirst({
            where:{
                credenciales_id_crdencial: credencial.id_crdencial,
            },
        });
        console.log(user.correo_usuario);
        const password = generatecorre();
        var mailOptions = {
            from : process.env.EMAIL,
            to: user.correo_usuario,
            subject : 'Recuperacion de contraseña',
            html: '<p> <b>Tus credenciales son </b> <br> <b>Email: '+user.correo_usuario+'</b> <br> <b> Contraseña: </b> <b><u>'+ password+ '</b> </p>'
        }
        trasporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('Error al enviar el correo:', error);
                res.status(404).json({mensaje: 'correo no existente'});
            }
        });
        const passwordHash = await encrypt(password);
        await prisma.credenciales.update({
            where:{
                id_crdencial: credencial.id_crdencial
            },
            data:{
                contrasena_usuario: passwordHash
            }
        });
        res.status(200).json({mensaje: 'Correo enviado'});
    
    } catch (error) {
        if(error instanceof TypeError){
            console.log('Usuario o correo invalidos')
            res.status(404).json({mensaje:'Usuario o correo invalidos'})
        }else{
            res.status(500).json({mensaje:'Error al recuperar contraseña'})
        }
    }
}

var trasporter = nodemailer.createTransport({
    service : 'gmail',
    auth :{
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
});

function generatecorre(){
    
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    console.log(password)
    return password;
};

function mapUsersF(users){
    const user = {
        "nombre_user": users.credenciales.nombre_usuario,
        "id_usuario": users.id_usuario,
        "nombre_usuario": users.nombre_usuario,
        "apellido_usuario": users.apellido_usuario,
        "tipo_documento": users.tipo_documento,
        "documento_usuario": users.documento_usuario,
        "numero_celu_usuario": users.numero_celu_usuario,
        "correo_usuario": users.correo_usuario,
        "tipo_usuario": users.tipo_usuario,
        "imagen": users.imagen
    }
    return user
}

  
  // Uso de la función para generar una contraseña de 12 caracteres
  /*const randomPassword = generateRandomPassword(12);
  console.log("Contraseña generada:", randomPassword);*/

module.exports={login, recoverPassword};