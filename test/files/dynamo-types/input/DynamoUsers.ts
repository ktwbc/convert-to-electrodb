// @ts-nocheck because we want to ignore test files
import { Decorator, Query, Table } from 'dynamo-types';

@Decorator.Table({ name: process.env.DYNAMODB_TABLE_USERS })
export class DynamoUsers extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<DynamoUsers, string>;

  @Decorator.Attribute({ name: 'id' })
  id: string;

  @Decorator.Attribute({ name: 'first_name' })
  first_name: string;

  @Decorator.Attribute({ name: 'last_name' })
  last_name: string;

  @Decorator.Attribute({ name: 'phone_number' })
  phoneNumber: number;

  @Decorator.Attribute()
  city: string;

  @Decorator.Attribute()
  state: string;

  @Decorator.Attribute({ name: 'zip_code' })
  zip: number;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<DynamoUsers>;
}
