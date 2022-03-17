import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })
  test("should be able to create a statement", async () => {
    const user: ICreateUserDTO = {
      name: "Goku",
      email: "goku@gmail.com",
      password: "123",
    }
    await inMemoryUsersRepository.create(user);
    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }
    const statement: ICreateStatementDTO = {
      user_id: createdUser?.id as string,
      description: "Statement description",
      amount: 500,
      type: OperationType.DEPOSIT
    }
    const createdStatement = await createStatementUseCase.execute(statement)
    expect(createdStatement).toHaveProperty("id")
  })
  test("should not be able to create a statement if nonexisting user", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "Gohan",
        email: "gohan@gmail.com",
        password: "123",
      }
      await inMemoryUsersRepository.create(user);
      const createdUser = await inMemoryUsersRepository.findByEmail("Nonexisting email");
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }
      await createStatementUseCase.execute({
        user_id: createdUser?.id as string,
        description: "Statement description",
        amount: 500,
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
  test("should not be able to create a withdraw statement with insufficient funds", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "Vegeta",
        email: "vegeta@gmail.com",
        password: "123",
      }
      await inMemoryUsersRepository.create(user);
      const createdUser = await inMemoryUsersRepository.findByEmail(user.email);
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }
      await createStatementUseCase.execute({
        user_id: createdUser?.id as string,
        description: "Statement description",
        amount: 501,
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})