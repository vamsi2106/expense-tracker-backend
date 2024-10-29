import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Expense } from './expenses.models';

@Table({ tableName: 'files' })
export class File extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @Column({ type: DataType.STRING, unique : true, allowNull: false })
  originalFileName: string; // Stores the original name of the uploaded file

  @Column({ type: DataType.STRING, allowNull: false })
  mimeType: string; // File type (e.g., 'text/csv')

  @Column({ type: DataType.STRING, allowNull: false })
  fileUrl: string; // Stores the URL to download the file (stored in Azure Blob Storage)

  @Column({ type: DataType.INTEGER, allowNull: false })
  size: number; // The file size in bytes

  @HasMany(()=>Expense, {foreignKey: 'file_id'})
  expense: Expense[]
}
