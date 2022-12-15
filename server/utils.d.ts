/**
 * Helper type to remove the first input argument of the given function type
 */
type RemoveFirstArg<F> = F extends (
  first: infer Arg1,
  ...args: infer Args
) => infer R
  ? (...args: Args) => R
  : never;

/**
 * Helper type to transform all value types from resolver types (from
 * `graphql-codegen`) to something that can be used in the `rootValue` passed
 * into `express-graphql`
 *
 * @remarks
 * This is used in the generated resolvers type file.
 * @see {@link ./graphql/resolvers.gen}
 */
declare type ResolverToRootValues<T extends Record<string, any>> = {
  [P in keyof T]: RemoveFirstArg<T[P]>;
};

type DropNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Helper type to drop some fields from GraphQL schema types
 */
declare type WithoutGraphQL<T extends Record<string, any>> = DropNever<{
  [K in keyof Required<T>]: K extends "__typename" | "id"
    ? never
    : Required<T>[K] extends { __typename?: string } | null
    ? never
    : Required<T>[K];
}>;
