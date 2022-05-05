import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map((
      {
        id,
        user_id,
        sender_id,
        description,
        amount,
        type,
        created_at,
        updated_at
      }
    ) => {
      if (type === 'transfer') {
        return {
          id,
          sender_id,
          description,
          amount: Number(amount),
          type,
          created_at,
          updated_at
        }
      } else {
        return {
          id,
          user_id,
          description,
          amount: Number(amount),
          type,
          created_at,
          updated_at
        }
      }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
