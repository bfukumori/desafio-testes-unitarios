import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const {user_id: receiver_id} = request.params;
    const { amount, description } = request.body;

    const type = request.originalUrl.split('statements/').pop()?.split('/')[0] as OperationType; 
  
    const createStatement = container.resolve(CreateStatementUseCase);

    if (type === 'transfer') {
      const statement = await createStatement.execute({
        user_id,
        sender_id:user_id,
        receiver_id,
        type,
        amount,
        description
      });
  
      return response.status(201).json(statement);
    }
  
    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
