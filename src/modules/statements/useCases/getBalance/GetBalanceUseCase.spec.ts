import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })
  test("should be able to get balance", async () => {
    const user: ICreateUserDTO = {
      name: "Goku",
      email: "goku@gmail.com",
      password: "123",
    }
    await inMemoryUsersRepository.create(user);
    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);
    const userBalance = await getBalanceUseCase.execute({ user_id: createdUser?.id as string });
    expect(userBalance).toHaveProperty("balance");
  })
  test("should not be able to get balance if nonexisting user", async () => {
    await expect(async () => {
      await getBalanceUseCase.execute({ user_id: "Nonexisting user" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})