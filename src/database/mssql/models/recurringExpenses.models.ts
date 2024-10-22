import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Expense } from './expenses.models';

export enum Interval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  HOURLY = 'hour',
  MINUTE = 'minute',
}

@Table({ tableName: 'recurring_tasks' })
export class RecurringTask extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string; // Unique identifier for the task

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique:true
  })
  name: string; // Name of the task

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string; // Optional description of the task

  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date; // The date when the recurring task should start

  @Column({ type: DataType.DATE, allowNull: true })
  end_date: Date; // Optional end date for the task

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [[
          Interval.DAILY,
          Interval.WEEKLY,
          Interval.MONTHLY,
          Interval.YEARLY,
          Interval.HOURLY,
          Interval.MINUTE,
        ]],
        msg: "Interval must be one of the following values: daily, weekly, monthly, yearly, hour, minute.",
      },
    },
  })
  interval: Interval; // Interval type (e.g., 'Daily', 'Weekly', 'Monthly', or cron expression)

  @Column({ type: DataType.TIME, allowNull: false })
  time: string; // Specific time of day for execution (HH:MM:SS)

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean; // Whether the task is active or not

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',  
    onUpdate: 'CASCADE', 
  })
  user_id: string; 

  @ForeignKey(()=>Expense)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',  
    onUpdate: 'CASCADE', 
  })
  expense_id:string;
}
