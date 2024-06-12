import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { FormCashTransactionDTO } from './dto/form-cash-transaction.dto';
import { DataSource, Repository } from 'typeorm';
import { CashTransaction } from './entities/cash-transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CashTransactionService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CashTransaction)
    private cashRepo: Repository<CashTransaction>,
  ) {}

  create(user: User, formData: FormCashTransactionDTO) {
    return this.dataSource.transaction(async (manager) => {
      const cashRepo = manager.getRepository(CashTransaction);
      // const coinRepo = manager.getRepository(CoinTransaction);

      const cashTx = new CashTransaction();
      cashTx.createdBy = user;

      const cashTxData = cashRepo.merge(cashTx, formData);

      return cashRepo.save(cashTxData);
    });
  }

  findAll() {
    return `This action returns all cashTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashTransaction`;
  }
}
