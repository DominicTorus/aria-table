import { IsNotEmpty } from 'class-validator';

export class DFGenDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  dataBase: dataBaseType;

  @IsNotEmpty()
  gitRepo:string;
}

enum dataBaseType{
  mongoDb = "MongoDB" ,
  sqlServer = "SQL Server",
  oracle = "Oracle",
  postgres = "Postgres"
}
