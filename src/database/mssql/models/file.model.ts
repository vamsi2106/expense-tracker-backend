import { Column, Model, Table, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class File extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @Column({ type: DataType.STRING, unique : true, allowNull: false })
  originalFileName: string; // Stores the original name of the uploaded file

  @Column({ type: DataType.STRING, allowNull: false })
  mimeType: string; // File type (e.g., 'text/csv')

  @Column({ type: DataType.STRING, allowNull: false })
  fileUrl: string; // Stores the URL to download the file (stored in Azure Blob Storage)

  @Column({ type: DataType.INTEGER, allowNull: false })
  size: number; // The file size in bytes
}
