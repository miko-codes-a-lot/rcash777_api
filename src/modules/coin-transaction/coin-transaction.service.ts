import { Injectable } from '@nestjs/common';
import { CreateCoinTransactionDto } from './dto/create-coin-transaction.dto';

@Injectable()
export class CoinTransactionService {
  create(createCoinTransactionDto: CreateCoinTransactionDto) {
    return 'This action adds a new coinTransaction';
  }

  findAll() {
    return `This action returns all coinTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coinTransaction`;
  }
}
