import { Statement } from "../entities/Statement";

export class StatementMap {
  static toDTO({id, sender_id, description, amount, type,created_at, updated_at}: Statement) {
    
    const parsedStatement = () =>{
      if (type === 'transfer') {
        return {
          id,
          sender_id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        }
      }

      return {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    }
      return parsedStatement();
  }
}