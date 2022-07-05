// deno-lint-ignore-file no-explicit-any
import { GraphQLResolveInfo } from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> =
  & Omit<T, K>
  & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Class = Node & {
  __typename?: "Class";
  description: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  properties: Array<Property>;
  type: Array<Scalars["String"]>;
};

export type Node = {
  description: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  type: Array<Scalars["String"]>;
};

export type Property = Node & {
  __typename?: "Property";
  description: Scalars["String"];
  id: Scalars["String"];
  name: Scalars["String"];
  type: Array<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  schemaOrg: SchemaOrg;
};

export type SchemaOrg = {
  __typename?: "SchemaOrg";
  class?: Maybe<Class>;
  nodeCount: Scalars["Int"];
  nodes: Array<Property>;
};

export type SchemaOrgClassArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type SchemaOrgNodesArgs = {
  type?: InputMaybe<Type>;
};

export enum Type {
  All = "ALL",
  Class = "CLASS",
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
    ...args: any[]
  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Class: ResolverTypeWrapper<Class>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Node: ResolversTypes["Class"] | ResolversTypes["Property"];
  Property: ResolverTypeWrapper<Property>;
  Query: ResolverTypeWrapper<{}>;
  SchemaOrg: ResolverTypeWrapper<SchemaOrg>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Type: Type;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"];
  Class: Class;
  Int: Scalars["Int"];
  Node: ResolversParentTypes["Class"] | ResolversParentTypes["Property"];
  Property: Property;
  Query: {};
  SchemaOrg: SchemaOrg;
  String: Scalars["String"];
};

export type ClassResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Class"] =
    ResolversParentTypes["Class"],
> = {
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  properties?: Resolver<
    Array<ResolversTypes["Property"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Node"] =
    ResolversParentTypes["Node"],
> = {
  __resolveType: TypeResolveFn<"Class" | "Property", ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type PropertyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Property"] =
    ResolversParentTypes["Property"],
> = {
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] =
    ResolversParentTypes["Query"],
> = {
  schemaOrg?: Resolver<ResolversTypes["SchemaOrg"], ParentType, ContextType>;
};

export type SchemaOrgResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["SchemaOrg"] =
    ResolversParentTypes["SchemaOrg"],
> = {
  class?: Resolver<
    Maybe<ResolversTypes["Class"]>,
    ParentType,
    ContextType,
    Partial<SchemaOrgClassArgs>
  >;
  nodeCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  nodes?: Resolver<
    Array<ResolversTypes["Property"]>,
    ParentType,
    ContextType,
    RequireFields<SchemaOrgNodesArgs, "type">
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Class?: ClassResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Property?: PropertyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SchemaOrg?: SchemaOrgResolvers<ContextType>;
};