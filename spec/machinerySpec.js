describe('createMachinery', function() {

    it('crea una nueva maquinaria con todos los campos requeridos', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          nombre_maquina: 'Excavator',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'Construction',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "maquinaria creada" });
    });

    
    it('crea una nueva maquinaria con todos los campos, incluidos los campos opcionales', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          nombre_maquina: 'Excavator',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'Construction',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100,
          path: ['image1.jpg', 'image2.jpg']
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "maquinaria creada" });
    });

    it('crear una nueva maquinaria con múltiples imágenes', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          nombre_maquina: 'Excavator',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'Construction',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100,
          path: ['image1.jpg', 'image2.jpg']
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      spyOn(prisma.usuarios, 'findUnique').and.returnValue(Promise.resolve({ id_usuario: 1 }));
      spyOn(prisma.maquinarias, 'create').and.returnValue(Promise.resolve({ id_maquinaria: 1 }));
      spyOn(prisma.imagenes, 'create').and.returnValue(Promise.resolve());
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "maquinaria creada" });
    });

    // Fail to create a new machinery with a missing required field
    it('no debería poder crear una nueva maquinaria a la que le falta un campo obligatorio', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'Construction',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "error al agregar la maquinaria" });
    });

    it('no debería poder crear una nueva maquinaria con un usuario no válido', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          nombre_maquina: 'Excavator',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'Construction',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      spyOn(prisma.usuarios, 'findUnique').and.returnValue(Promise.resolve(null));
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "usuario no encontrado" });
    });

    it('no debería poder crear una nueva maquinaria con una categoría no válida', async function() {
      const req = {
        body: {
          documento_usuario: '1234567890',
          nombre_maquina: 'Excavator',
          descripcion_maquina: 'Heavy-duty excavator',
          categoria: 'InvalidCategory',
          placa_maquina: 'ABC123',
          modelo_maquina: '2021',
          precio_hora: 100
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      spyOn(prisma.usuarios, 'findUnique').and.returnValue(Promise.resolve({ id_usuario: 1 }));
      await createMachinery(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: "error al agregar la maquinaria" });
    });
});


describe('getMachinery', function() {

    it('debería devolver una lista de maquinarias con sus respectivas rutas', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, id_usuario: 1, nombre_maquina: 'Maquina 1', descripcion_maquina: 'Descripcion 1', categoria: 'Categoria 1', placa_maquina: 'Placa 1', modelo_maquina: 'Modelo 1', estado_maquina: 'Estado 1', precio_hora: 10 }]));
        spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, path: 'path1' }, { id_maquinaria: 2, path: 'path2' }]));

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.status().json).toHaveBeenCalledWith([{ id_maquinaria: 1, id_usuario: 1, nombre_maquina: 'Maquina 1', descripcion_maquina: 'Descripcion 1', categoria: 'Categoria 1', placa_maquina: 'Placa 1', modelo_maquina: 'Modelo 1', estado_maquina: 'Estado 1', precio_hora: 10, path: ['path1'] }]);
    });

    it('debería devolver un código de estado: 200', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([]));
        spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('maneja listas vacías de maquinarias y rutas', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([]));
        spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.status().json).toHaveBeenCalledWith([]);
    });

    it('arroja un error si hay un error al recuperar maquinarias de la base de datos', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.throwError('Error retrieving maquinarias');
        spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().json).toHaveBeenCalledWith({ mesanje: 'error al mostar las maquinaria' });
    });

    it('arroja un error si hay un error al recuperar rutas de la base de datos', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([]));
        spyOn(prisma.imagenes, 'findMany').and.throwError('Error retrieving paths');

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().json).toHaveBeenCalledWith({ mesanje: 'error al mostar las maquinaria' });
    });

    it('debe manejar valores nulos para maquinarias y rutas', async function() {
        const req = {};
        const res = {
            status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() })
        };
        spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve(null));
        spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve(null));

        await getMachinery(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.status().json).toHaveBeenCalledWith([]);
    });
});

describe('filterCategory', function() {

    it('devuelve una lista de maquinaria filtrada por categoría', async function() {
      const req = { query: { category: 'excavator' } };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, categoria: 'excavator' }, { id_maquinaria: 2, categoria: 'excavator' }]));
      spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith([{ id_maquinaria: 1, categoria: 'excavator' }, { id_maquinaria: 2, categoria: 'excavator' }]);
    });

    it('debería devolver una lista de maquinaria filtrada por id', async function() {
      const req = { query: { id: '1' } };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, categoria: 'excavator' }]));
      spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith([{ id_maquinaria: 1, categoria: 'excavator' }]);
    });

    it('debe devolver una lista vacía cuando no hay maquinaria que coincida con el filtro', async function() {
      const req = { query: { category: 'excavator' } };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([]));
      spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith([]);
    });

    it('debería devolver un mensaje de error cuando haya un error al recuperar la maquinaria de la base de datos', async function() {
      const req = { query: { category: 'excavator' } };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.throwError('Error retrieving machinery');
      spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ mesanje: 'error al mostar las maquinaria' });
    });

    it('debería devolver un mensaje de error cuando haya un error al recuperar imágenes de la base de datos', async function() {
      const req = { query: { category: 'excavator' } };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, categoria: 'excavator' }]));
      spyOn(prisma.imagenes, 'findMany').and.throwError('Error retrieving images');
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({ mesanje: 'error al mostar las maquinaria' });
    });

    it('debería devolver un mensaje de error cuando falta el argumento id_maquinaria', async function() {
      const req = { query: {} };
      const res = {
        status: jasmine.createSpy().and.returnValue({ json: jasmine.createSpy() }),
      };
      spyOn(prisma.maquinarias, 'findMany').and.returnValue(Promise.resolve([{ id_maquinaria: 1, categoria: 'excavator' }]));
      spyOn(prisma.imagenes, 'findMany').and.returnValue(Promise.resolve([]));
  
      await filterCategory(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({ mesanje: 'El valor ingresado es incorrecto' });
    });
});
