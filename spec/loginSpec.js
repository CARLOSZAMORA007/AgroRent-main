describe('login', function(){
it('debe retornar los datos del usuario cuando ingresa correctamente', async function() {
        const req = {
            body: {
                nombre_user: 'valid_username',
                contrasena_usuario: 'valid_password'
            }
        };
        const res = {
            status: jasmine.createSpy().and.returnValue(res),
            json: jasmine.createSpy()
        };
        const prismaMock = {
            credenciales: {
                findUnique: jasmine.createSpy().and.returnValue(null),
                findFirst: jasmine.createSpy().and.returnValue({
                    id_usuario: 1,
                    nombre_usuario: 'John',
                    apellido_usuario: 'Doe',
                    tipo_documento: 'ID',
                    documento_usuario: '123456789',
                    numero_celu_usuario: '1234567890',
                    correo_usuario: 'john.doe@example.com',
                    tipo_usuario: 'admin',
                    imagen: 'profile.jpg',
                    estado_usuario: 'A',
                    credenciales: {
                        nombre_usuario: 'valid_username'
                    }
                })
            },
            usuarios: {
                findUnique: jasmine.createSpy().and.returnValue({
                    credenciales_id_crdencial: 1
                })
            }
        };
        const compareMock = jasmine.createSpy().and.returnValue(true);
        spyOn(require('../hendleB/handleBcrypt.js'), 'compare').and.callFake(compareMock);
        spyOn(require('dotenv'), 'config');
        spyOn(console, 'error');
        await login(req, res);
        expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
            where:{
                nombre_usuario: 'valid_username',
            },
        });
        expect(prismaMock.usuarios.findFirst).toHaveBeenCalledWith({
            where:{
                credenciales_id_crdencial: 1,
            },
            include:{
                credenciales:{
                    select: {
                        nombre_usuario: true
                    }
                }
            }
        });
        expect(compareMock).toHaveBeenCalledWith('valid_password', undefined);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            "nombre_user": 'valid_username',
            "id_usuario": 1,
            "nombre_usuario": 'John',
            "apellido_usuario": 'Doe',
            "tipo_documento": 'ID',
            "documento_usuario": '123456789',
            "numero_celu_usuario": '1234567890',
            "correo_usuario": 'john.doe@example.com',
            "tipo_usuario": 'admin',
            "imagen": 'profile.jpg'
        });
    });

    const Login = require('../src/controllers/login');
    it('debe retornar un mensaje de error cuando se hace login con credenciales invalidas', async function() {
        const req = {
            body: {
                nombre_user: 'invalid_username',
                contrasena_usuario: 'invalid_password'
            }
        };
        const res = {
            status: jasmine.createSpy().and.returnValue(res),
            json: jasmine.createSpy()
        };
        const prismaMock = {
            credenciales: {
                findUnique: jasmine.createSpy().and.returnValue(null)
            }
        };
        const compareMock = jasmine.createSpy().and.returnValue(false);
        spyOn(require('../hendleB/handleBcrypt.js'), 'compare').and.callFake(compareMock);
        spyOn(require('dotenv'), 'config');
        spyOn(console, 'error');

        await login(req, res);

        expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
            where:{
                nombre_usuario: 'invalid_username',
            },
        });
        expect(compareMock).toHaveBeenCalledWith('invalid_password', undefined);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid credentials'
        });
    });
    it('debe retornar un mensaje de error cuando se ingresa con un usuario vacio', async function() {
        const req = {
            body: {
                nombre_user: '',
                contrasena_usuario: 'valid_password'
            }
        };
        const res = {
            status: jasmine.createSpy().and.returnValue(res),
            json: jasmine.createSpy()
        };
        spyOn(require('dotenv'), 'config');
        spyOn(console, 'error');

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Username is required'
        });
    });

    it('debe mostrar un mensaje de error cuando se ingresa con contraseña vacia', async function() {
        const req = {
            body: {
                nombre_user: 'valid_username',
                contrasena_usuario: ''
            }
        };
        const res = {
            status: jasmine.createSpy().and.returnValue(res),
            json: jasmine.createSpy()
        };
        spyOn(require('dotenv'), 'config');
        spyOn(console, 'error');
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password is required'
        });
    });

    it('debe mostrar un mensaje de error cuando no existe el usuario', async function() {
        const req = {
            body: {
                nombre_user: 'non_existing_username',
                contrasena_usuario: 'valid_password'
            }
        };
        const res = {
            status: jasmine.createSpy().and.returnValue(res),
            json: jasmine.createSpy()
        };
        const prismaMock = {
            credenciales: {
                findUnique: jasmine.createSpy().and.returnValue(null)
            }
        };
        spyOn(require('dotenv'), 'config');
        spyOn(console, 'error');
        await login(req, res);
        expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
            where:{
                nombre_usuario: 'non_existing_username',
            },
        });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid credentials'
        });
    });

})

describe('recoverPassword', function() {
    it('recupera la contraseña del usuario con el nombre de usuario', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue({}),
          update: jest.fn().mockResolvedValue({})
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue({}),
          findFirst: jest.fn().mockResolvedValue({})
        }
      };
  
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
            callback(null, {});
          })
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
      const { recoverPassword } = require('../src/controllers/login');
  
      const req = {
        body: {
          nombre_user: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
  
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'username'
        }
      });
      expect(prismaMock.usuarios.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).toHaveBeenCalled();
      expect(nodemailerMock.createTransport().sendMail).toHaveBeenCalled();
      expect(prismaMock.credenciales.update).toHaveBeenCalledWith({
        where: {
          id_crdencial: undefined
        },
        data: {
          contrasena_usuario: 'hashedPassword'
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Correo enviado' });
    });

    it('recupera la contraseña del usuario con email', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue({}),
          update: jest.fn().mockResolvedValue({})
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue({}),
          findFirst: jest.fn().mockResolvedValue({})
        }
      };
  
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
            callback(null, {});
          })
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
      const { recoverPassword } = require('../src/controllers/login');
  
      const req = {
        body: {
          nombre_user: 'email@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
  
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'email@example.com'
        }
      });
      expect(prismaMock.usuarios.findFirst).toHaveBeenCalledWith({
        where: {
          correo_usuario: 'email@example.com'
        }
      });
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).toHaveBeenCalled();
      expect(nodemailerMock.createTransport().sendMail).toHaveBeenCalled();
      expect(prismaMock.credenciales.update).toHaveBeenCalledWith({
        where: {
          id_crdencial: undefined
        },
        data: {
          contrasena_usuario: 'hashedPassword'
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Correo enviado' });
    });

    it('debe enviar un email con la nueva contraseña de usuario', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue({}),
          update: jest.fn().mockResolvedValue({})
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue({}),
          findFirst: jest.fn().mockResolvedValue({})
        }
      };
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
            callback(null, {});
          })
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
      const { recoverPassword } = require('../src/controllers/login');
      const req = {
        body: {
          nombre_user: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'username'
        }
      });
      expect(prismaMock.usuarios.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).toHaveBeenCalled();
      expect(nodemailerMock.createTransport().sendMail).toHaveBeenCalledWith({
        from: undefined,
        to: undefined,
        subject: 'Recuperacion de contraseña',
        html: expect.stringContaining('<b>Tus credenciales son </b> <br> <b>Email: '),
        text: undefined
      }, expect.any(Function));
      expect(prismaMock.credenciales.update).toHaveBeenCalledWith({
        where: {
          id_crdencial: undefined
        },
        data: {
          contrasena_usuario: 'hashedPassword'
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Correo enviado' });
    });

    it('error cuando el nombre de ususario dado no existe', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue(null)
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue(null)
        }
      };
  
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn()
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
      const { recoverPassword } = require('../src/controllers/login');
  
      const req = {
        body: {
          nombre_user: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'username'
        }
      });
      expect(prismaMock.usuarios.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario o correo invalidos' });
    });

    it('maneja el ususario cuando el correo no existe', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue(null)
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue(null),
          findFirst: jest.fn().mockResolvedValue(null)
        }
      };
  
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn()
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
  
      const { recoverPassword } = require('../src/controllers/login');
  
      const req = {
        body: {
          nombre_user: 'email@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'email@example.com'
        }
      });
      expect(prismaMock.usuarios.findFirst).toHaveBeenCalledWith({
        where: {
          correo_usuario: 'email@example.com'
        }
      });
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario o correo invalidos' });
    });

    it('debería manejar el error al enviar el correo electrónico al usuario', function() {
      const prismaMock = {
        credenciales: {
          findUnique: jest.fn().mockResolvedValue({}),
          update: jest.fn().mockResolvedValue({})
        },
        usuarios: {
          findUnique: jest.fn().mockResolvedValue({}),
          findFirst: jest.fn().mockResolvedValue({})
        }
      };
  
      const nodemailerMock = {
        createTransport: jest.fn().mockReturnValue({
          sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
            callback(new Error('Failed to send email'), null);
          })
        })
      };
  
      const encryptMock = jest.fn().mockResolvedValue('hashedPassword');
      const { recoverPassword } = require('../src/controllers/login');
  
      const req = {
        body: {
          nombre_user: 'username'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      recoverPassword(req, res);
      expect(prismaMock.credenciales.findUnique).toHaveBeenCalledWith({
        where: {
          nombre_usuario: 'username'
        }
      });
      expect(prismaMock.usuarios.findFirst).not.toHaveBeenCalled();
      expect(prismaMock.usuarios.findUnique).not.toHaveBeenCalled();
      expect(nodemailerMock.createTransport).toHaveBeenCalled();
      expect(nodemailerMock.createTransport().sendMail).toHaveBeenCalled();
      expect(prismaMock.credenciales.update).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'correo no existente' });
    });
});
