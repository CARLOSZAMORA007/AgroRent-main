describe('createReserve', function() {

    it('debe crear una reserva exitosamente cuando se proporcionen datos válidos', async function() {
      const req = {
        body: {
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createReserve(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'reserva creada' });
    });

    it('debe devolver un mensaje de éxito con un código de estado 200 cuando una reserva se crea correctamente', async function() {
      const req = {
        body: {
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createReserve(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'reserva creada' });
    });

    it('devolver un mensaje de error apropiado con el código de estado correcto', async function() {
      const req = {
        body: {
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await createReserve(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear la reserva' });
    });

    it('devolver un código de estado 500 con un mensaje de error cuando ocurre un error inesperado durante la creación de una reserva', async function() {
      const req = {
        body: {
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      spyOn(prisma.reservas, 'create').and.throwError('Unexpected error');
      await createReserve(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al crear la reserva' });
    });

    it('debería arrojar un error cuando al cuerpo de la solicitud le faltan datos requeridos', async function() {
      const req = {
        body: {}
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await expectAsync(createReserve(req, res)).toBeRejected();
    });

    it('debería arrojar un error cuando el cuerpo de la solicitud contiene datos no válidos', async function() {
      const req = {
        body: {
        }
      };
      const res = {
        status: jasmine.createSpy().and.returnValue(res),
        json: jasmine.createSpy()
      };
      await expectAsync(createReserve(req, res)).toBeRejected();
    });
});
