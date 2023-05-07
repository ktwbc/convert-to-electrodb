// Search for a model line with its pair that includes the search string
export const getPairedLines = (lines: string[], searchString: string) =>
  lines
    .map((line, index) => {
      if (line.includes(searchString)) {
        if (!line.includes('})')) {
          // appears that Decorator uses three lines instead of 1, so we have to grab them
          return [line + lines[index + 1] + lines[index + 2], lines[index + 3]];
        } else {
          return [line, lines[index + 1]];
        }
      }
      return null;
    })
    .filter((line) => line !== null);

/**
 *   @Decorator.FullGlobalSecondaryIndex('invite_email', 'course', { name: 'invited-index' })
 *   public static readonly invited: Query.FullGlobalSecondaryIndex<DynamoTokens, string, string>;
 *
 *   @Decorator.FullGlobalSecondaryIndex('purchased_by_subscriber_id', 'id', {
 *     name: 'purchased_by_subscriber_id-index'
 *   })
 *   public static readonly purchasedBySubscriber: Query.FullGlobalSecondaryIndex<DynamoTokens, string, string>;
 */
