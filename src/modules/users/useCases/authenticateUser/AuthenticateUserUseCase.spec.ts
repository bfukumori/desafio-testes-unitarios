import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate user", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })
  test("should be able to authenticate user", async () => {
    const user: ICreateUserDTO = {
      name: "John",
      email: "john@gmail.com",
      password: "123"
    };
    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({ email: user.email, password: user.password });
    expect(authenticatedUser).toHaveProperty("token");
  })
  test("should not be able to authenticate a nonexistent user", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({ email: "Nonexisting email", password: "Nonexisting password" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
  test("should not be able to authenticate with wrong password", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "Goku",
        email: "goku@gmail.com",
        password: "123"
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({ email: user.email, password: "Wrong Password" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})