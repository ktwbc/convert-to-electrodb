// @ts-nocheck because we want to ignore test files
import { Decorator, Query, Table } from 'dynamo-types';

@Decorator.Table({ name: 'blog-posts' })
export class BlogPosts extends Table {
  @Decorator.HashPrimaryKey('id')
  public static readonly primaryKey: Query.HashPrimaryKey<BlogPosts, string>;

  @Decorator.FullPrimaryKey('id', 'publish_date')
  public static readonly keyPlusDate: Query.FullPrimaryKey<BlogPosts, string, string>;

  @Decorator.FullGlobalSecondaryIndex('code', 'code_type', { name: 'code-code_type' })
  public static readonly code: Query.FullGlobalSecondaryIndex<BlogPosts, string, string>;

  @Decorator.FullGlobalSecondaryIndex('author_id', 'id', { name: 'idx_author_id' })
  public static readonly managerId: Query.FullGlobalSecondaryIndex<BlogPosts, string, string>;


  @Decorator.Writer()
  public static readonly writer: Query.Writer<BlogPosts>;

  @Decorator.Attribute({ name: 'id' })
  id: string;

  @Decorator.Attribute()
  title: string;

  @Decorator.Attribute({ name: 'publish_date' })
  publish_date: object | Date;

  @Decorator.Attribute({ name: 'body' })
  contents: string;


  @Decorator.Attribute()
  code: string;


  @Decorator.Attribute({ name: 'code_type' })
  codeType: string;


}
