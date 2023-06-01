import { User } from "@src/models/user";
import { SetupServer } from "@src/server";
import supertest from "supertest";




describe('Users functional tests', () => {



  beforeAll(async () => {
    await User.deleteMany({});
  });



  describe('When creating a user', () => {
    it('should successfuly create a user', async () => {

      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' };
      console.log("201 ");
      const { body, status } = await global.testRequest.post('/users').send(newUser)
      console.log(body);
      console.log(status);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newUser));

    })
    it('Should return 422 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };

      const { body, status } = await global.testRequest.post('/users').send(newUser)
      console.log("422");
      console.log(body);
      console.log(status);
      expect(status).toBe(400
        );
      expect(body).toEqual({
        code: 400,
        error: [
          { king: 'required', path: 'name', message: 'Path `name` is required.' },
         { king: 'DUPLICATED', path: 'email', message: 'already exists in the database.' },
        ]

      });
    });
    it('Should return 409 when the email already exists', async () => {
      const newUser = { name: 'John Doe', email: 'john@mail.com', password: '1234' }

      const { body, status } = await global.testRequest.post('/users').send(newUser);

      console.log(body);
      console.log(status);
      expect(status).toBe(400);
      expect(body).toEqual({
        code: 400,
        error: [{
           king: 'DUPLICATED', path: 'email',
          message: 'already exists in the database.'
        }]
      });
    })






  })
})
