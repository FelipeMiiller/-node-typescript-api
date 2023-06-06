import { AuthMethods } from "../../util/authMethods"
import { authMiddleware } from "../auth"

describe("Auth Middleware", () => {

    it("should verify a jwt and call the next middleware", async () => {


        const data = { data: 'fake' }

        const jwtToken = AuthMethods.generateToken(data)

        const reqFake = {
            headers: { 'x-access-token': jwtToken }
        }

        const resFake = {}
        const nextFake = jest.fn();

        authMiddleware(reqFake, resFake, nextFake)
        console.log(resFake)
        expect(nextFake).toHaveBeenCalled()
    })


    it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
        const reqFake = {
          headers: {
            'x-access-token': 'invalid token',
          },
        };
        const sendMock = jest.fn();
        const resFake = {
          status: jest.fn(() => ({
            send: sendMock,
          })),
        };
        const nextFake = jest.fn();
        authMiddleware(reqFake, resFake as object, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
          code: 401,
          error: 'jwt malformed',
        });
      });

      it('should return ANAUTHORIZED middleware if theres no token', () => {
        const reqFake = {
          headers: {},
        };
        const sendMock = jest.fn();
        const resFake = {
          status: jest.fn(() => ({
            send: sendMock,
          })),
        };
        const nextFake = jest.fn();
        authMiddleware(reqFake, resFake as object, nextFake);
        expect(resFake.status).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledWith({
          code: 401,
          error: 'jwt must be provided',
        });
      });

})