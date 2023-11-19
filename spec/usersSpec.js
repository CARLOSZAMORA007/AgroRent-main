describe('createUsers', function() {

    it('crea un usuario correctamente con los datos proporcionados', async function() {
      const req = {
        body: {
          nombre_user: 'John',
          contrasena_usuario: 'password',
          documento_usuario: '123456789',
          correo_usuario: 'john@example.com'
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };

      await createUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "usuario creado" });
    });

    it('debe actualizar el estado de un usuario inactivo a activo cuando se proporcionan datos de entrada válidos', async function() {
      const req = {
        body: {
          documento_usuario: '123456789'
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };

      const prismaMock = {
        usuarios: {
          updateMany: jasmine.createSpy().and.returnValue(Promise.resolve(1))
        }
      };
      spyOn(prisma, 'usuarios').and.returnValue(prismaMock.usuarios);

      await createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "usuario creado" });
    });

    it('manda mensaje de error por estar registrado con el mismo nombre de usuario', async function() {
      const req = {
        body: {
          nombre_user: 'John',
          contrasena_usuario: 'password',
          documento_usuario: '123456789',
          correo_usuario: 'john@example.com'
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };

      const prismaMock = {
        usuarios: {
          updateMany: jasmine.createSpy().and.returnValue(Promise.resolve(0)),
          findFirst: jasmine.createSpy().and.returnValue(Promise.resolve({ documento_usuario: '123456789' }))
        }
      };
      spyOn(prisma, 'usuarios').and.returnValue(prismaMock.usuarios);

      await createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Ya hay alguien registrado con ese numero de documento' });
    });

    it('muestra errror cuando hay entradas en blanco', async function() {
      const req = {
        body: {}
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };

      await createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear el usuario' });
    });

    it('muestra mensaje de error cuando el contenido de entrada tiene caracteres o tipos de datosinvalidos', async function() {
      const req = {
        body: {
          nombre_user: 'John',
          contrasena_usuario: 'password',
          documento_usuario: '123456789',
          correo_usuario: 'john@example.com',
          tipo_documento: 123,
          numero_celu_usuario: '1234567890',
          tipo_usuario: 'admin',
          imagen: null
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear el usuario' });
    });

    it('debe responder con un mensaje de error cuando los datos de entrada exceden la longitud máxima permitida', async function() {
      const req = {
        body: {
          nombre_user: 'John'.repeat(100),
          contrasena_usuario: 'password',
          documento_usuario: '123456789',
          correo_usuario: 'john@example.com',
          tipo_documento: 'DNI',
          numero_celu_usuario: '1234567890',
          tipo_usuario: 'admin',
          imagen: null
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };

      await createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear el usuario' });
    });
});

describe('getUsers', function() {

    it('debería devolver una lista de usuarios activos con su información básica', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
            json: jasmine.createSpy()
        };
        spyOn(prisma.usuarios, 'findMany').and.returnValue(Promise.resolve([
            {
                credenciales: { nombre_usuario: 'user1' },
                nombre_usuario: 'John',
                apellido_usuario: 'Doe',
                tipo_documento: 'ID',
                documento_usuario: '123456789',
                numero_celu_usuario: '1234567890',
                correo_usuario: 'john.doe@example.com',
                tipo_usuario: 'admin',
                estado_usuario: 'A',
                imagen: '/path/to/image1'
            },
            {
                credenciales: { nombre_usuario: 'user2' },
                nombre_usuario: 'Jane',
                apellido_usuario: 'Smith',
                tipo_documento: 'ID',
                documento_usuario: '987654321',
                numero_celu_usuario: '0987654321',
                correo_usuario: 'jane.smith@example.com',
                tipo_usuario: 'user',
                estado_usuario: 'A',
                imagen: '/path/to/image2'
            }
        ]));

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            {
                nombre_user: 'user1',
                nombre_usuario: 'John',
                apellido_usuario: 'Doe',
                tipo_documento: 'ID',
                documento_usuario: '123456789',
                numero_celu_usuario: '1234567890',
                correo_usuario: 'john.doe@example.com',
                tipo_usuario: 'admin',
                estado_usuario: 'A',
                path: '/path/to/image1'
            },
            {
                nombre_user: 'user2',
                nombre_usuario: 'Jane',
                apellido_usuario: 'Smith',
                tipo_documento: 'ID',
                documento_usuario: '987654321',
                numero_celu_usuario: '0987654321',
                correo_usuario: 'jane.smith@example.com',
                tipo_usuario: 'user',
                estado_usuario: 'A',
                path: '/path/to/image2'
            }
        ]);
    });

    it('debería devolver una lista vacía cuando no hay usuarios activos', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
            json: jasmine.createSpy()
        };
        spyOn(prisma.usuarios, 'findMany').and.returnValue(Promise.resolve([]));

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });
});

describe('pacthUser', function() {

    it('debe devolver una respuesta JSON con un mensaje de éxito y la información del usuario actualizada', async function() {
      const req = {
        body: {
          documento: '1234567890',
          nombre_usuario: 'John',
          apellido_usuario: 'Doe',
          tipo_documento: 'ID',
          documento_usuario: '1234567890',
          numero_celu_usuario: '1234567890',
          correo_usuario: 'john.doe@example.com'
        }
      };
      const res = {
        json: jasmine.createSpy('json')
      };
      await pacthUser(req, res);
      expect(res.json).toHaveBeenCalledWith({ msg: "estudiante actualizado", upadateUser });
    });

    it('debe manejar y registrar los errores apropiadamente', async function() {
      const req = {
        body: {
          documento: '1234567890',
          nombre_usuario: 'John',
          apellido_usuario: 'Doe',
          tipo_documento: 'ID',
          documento_usuario: '1234567890',
          numero_celu_usuario: '1234567890',
          correo_usuario: 'john.doe@example.com'
        }
      };
      const res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status')
      };
      spyOn(console, 'error');
      await pacthUser(req, res);
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al actualizar estudiante" });
    });

    it('devuelve un error 500 si el cliente Prisma no se inicializa', async function() {
      const req = {
        body: {
          documento: '1234567890',
          nombre_usuario: 'John',
          apellido_usuario: 'Doe',
          tipo_documento: 'ID',
          documento_usuario: '1234567890',
          numero_celu_usuario: '1234567890',
          correo_usuario: 'john.doe@example.com'
        }
      };
      const res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status')
      };
      spyOn(console, 'error');
      spyOn(prisma, 'usuarios').and.throwError('Prisma client initialization failed');
      await pacthUser(req, res);
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al actualizar estudiante" });
    });

    it('devuelve un error 500 si el cliente Prisma no puede conectarse a la base de datos', async function() {
      const req = {
        body: {
          documento: '1234567890',
          nombre_usuario: 'John',
          apellido_usuario: 'Doe',
          tipo_documento: 'ID',
          documento_usuario: '1234567890',
          numero_celu_usuario: '1234567890',
          correo_usuario: 'john.doe@example.com'
        }
      };
      const res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status')
      };
      spyOn(console, 'error');
      spyOn(prisma, 'usuarios').and.throwError('Prisma client failed to connect to the database');
      await pacthUser(req, res);
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al actualizar estudiante" });
    });

    it('debería devolver un error 500 si falla la consulta del cliente Prisma', async function() {
      const req = {
        body: {
          documento: '1234567890',
          nombre_usuario: 'John',
          apellido_usuario: 'Doe',
          tipo_documento: 'ID',
          documento_usuario: '1234567890',
          numero_celu_usuario: '1234567890',
          correo_usuario: 'john.doe@example.com'
        }
      };
      const res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status')
      };
      spyOn(console, 'error');
      spyOn(prisma.usuarios, 'update').and.throwError('Prisma client query failed');
      await pacthUser(req, res);
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "Error al actualizar estudiante" });
    });
});


