// @ts-nocheck because we want to ignore test files
import { Decorator, Query, Table } from 'dynamo-types';

@Decorator.Table({ name: `${env}-${process.env.DYNAMODB_TABLE_USERS}` })
export class DynamoCities extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<DynamoCities, string>;

  @Decorator.LocalSecondaryIndex('state', { name: 'customer-created' })
  public static readonly lsi: Query.LocalSecondaryIndex<DynamoCities, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<DynamoCities>;

  @Decorator.Attribute({ name: 'name' })
  name: string;

  @Decorator.Attribute()
  state: string;
}
