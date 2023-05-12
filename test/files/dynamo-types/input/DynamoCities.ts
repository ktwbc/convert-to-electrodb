// @ts-nocheck because we want to ignore test files
import { Decorator, Query, Table } from 'dynamo-types';

@Decorator.Table({ name: `${env}-${process.env.DYNAMODB_TABLE_CITIES}` })
export class DynamoCities extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<DynamoCities, string>;

  @Decorator.LocalSecondaryIndex('state', { name: 'customer-created' })
  public static readonly customers: Query.LocalSecondaryIndex<DynamoCities, string>;

  @Decorator.FullGlobalSecondaryIndex('idx-latest_census_zone', 'state', {
    name: 'census_zone-index'
  })
  public static readonly censusZone: Query.FullGlobalSecondaryIndex<DynamoCities, string, string>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<DynamoCities>;

  @Decorator.Attribute({ name: 'name' })
  name: string;

  @Decorator.Attribute()
  state: string;

  @Decorator.Attribute()
  latest_census_zone: number;
}
