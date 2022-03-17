import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })
  test("should be able to get a specific statement operation", async () => {
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
    const statement1: ICreateStatementDTO = {
      user_id: createdUser?.id as string,
      description: "Statement description",
      amount: 500,
      type: OperationType.DEPOSIT
    }
    const statement2: ICreateStatementDTO = {
      user_id: createdUser?.id as string,
      description: "Statement description",
      amount: 100,
      type: OperationType.WITHDRAW
    }
    const statement3: ICreateStatementDTO = {
      user_id: createdUser?.id as string,
      description: "Statement description",
      amount: 150,
      type: OperationType.WITHDRAW
    }
    const createdStatement1 = await inMemoryStatementsRepository.create(statement1);
    const createdStatement2 = await inMemoryStatementsRepository.create(statement2);
    const createdStatement3 = await inMemoryStatementsRepository.create(statement3);

    const result1 = await getStatementOperationUseCase.execute({ user_id: createdUser?.id as string, statement_id: createdStatement1.id as string })
    expect(result1.id).toMatch(createdStatement1.id as string);
    const result2 = await getStatementOperationUseCase.execute({ user_id: createdUser?.id as string, statement_id: createdStatement2.id as string })
    expect(result2.id).toMatch(createdStatement2.id as string);
    const result3 = await getStatementOperationUseCase.execute({ user_id: createdUser?.id as string, statement_id: createdStatement3.id as string })
    expect(result3.id).toMatch(createdStatement3.id as string);
  })
  test("should not be able to get statement operation if nonexisting user", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "Goku",
        email: "goku@gmail.com",
        password: "123",
      }
      await inMemoryUsersRepository.create(user);
      const createdUser = await inMemoryUsersRepository.findByEmail("nonexisting user");

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
      const createdStatement = await inMemoryStatementsRepository.create(statement);
      const result = await getStatementOperationUseCase.execute({ user_id: createdStatement.user_id, statement_id: createdStatement.id as string })
      expect(result.id).toMatch(createdStatement.id as string);

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })
  test("should not be able to get statement operation if nonexisting statement", async () => {
    await expect(async () => {
      const user: ICreateUserDTO = {
        name: "Goku",
        email: "goku@gmail.com",
        password: "123",
      }
      await inMemoryUsersRepository.create(user);
      const createdUser = await inMemoryUsersRepository.findByEmail(user.email);
      console.log(createdUser)
      await getStatementOperationUseCase.execute({ user_id: createdUser?.id as string, statement_id: "nonexisting statement" })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})