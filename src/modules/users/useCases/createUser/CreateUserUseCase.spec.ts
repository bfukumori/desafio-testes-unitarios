import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create user", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })
  test("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute(
      {
        name: "User Name",
        email: "User Email",
        password: "User Password"
      }
    )
    expect(user).toHaveProperty("id");
  })
  test("should not be able to create a new user with an already existing email", async () => {
    await expect(async () => {
      const userOne: ICreateUserDTO = {
        name: "John",
        email: "john@gmail.com",
        password: "123"
      }
      const userTwo: ICreateUserDTO = {
        name: "Wick",
        email: "john@gmail.com",
        password: "321"
      }
      await createUserUseCase.execute(
        userOne
      )
      await createUserUseCase.execute(
        userTwo
      )
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})