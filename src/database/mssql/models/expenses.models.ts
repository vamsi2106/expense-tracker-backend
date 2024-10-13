import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'expenses' })
export class Expense extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  category: string;
}
