import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })
  test("should be able to show user profile by id", async () => {
    const user: ICreateUserDTO = {
      name: "Goku",
      email: "goku@gmail.com",
      password: "123"
    };
    const createdUser = await createUserUseCase.execute(user);
    const userProfile = await showUserProfileUseCase.execute(createdUser.id as string);
    expect(userProfile).toBe(createdUser);
  })
  test("should not be able to show a nonexistent user profile", async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute("Nonexistent id");
    }).rejects.toBeInstanceOf(ShowUserProfileError)

  })
})