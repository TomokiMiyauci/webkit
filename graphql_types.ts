import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ClassNode = Node & {
  __typename?: 'ClassNode';
  description: Scalars['String'];
  id: Scalars['String'];
  isPending: Scalars['Boolean'];
  name: Scalars['String'];
  properties: Array<PropertyNode>;
  types: Array<Scalars['String']>;
};


export type ClassNodePropertiesArgs = {
  orderBy?: InputMaybe<NodeOrderByInput>;
};

export type DataTypeNode = Node & {
  __typename?: 'DataTypeNode';
  description: Scalars['String'];
  field: FieldValue;
  id: Scalars['String'];
  isPending: Scalars['Boolean'];
  name: Scalars['String'];
  types: Array<Scalars['String']>;
};

export type FieldValue =
  | 'Date'
  | 'DateTime'
  | 'Number'
  | 'Text'
  | 'URL'
  | 'Unknown';

export type Node = {
  description: Scalars['String'];
  id: Scalars['String'];
  isPending: Scalars['Boolean'];
  name: Scalars['String'];
  types: Array<Scalars['String']>;
};

export type NodeOrderByInput = {
  isPending?: InputMaybe<Sort>;
};

export type PropertyNode = Node & {
  __typename?: 'PropertyNode';
  description: Scalars['String'];
  id: Scalars['String'];
  isPending: Scalars['Boolean'];
  name: Scalars['String'];
  schemas: Array<DataTypeNode>;
  types: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  schemaOrg: SchemaOrg;
};

export type SchemaOrg = {
  __typename?: 'SchemaOrg';
  classNode?: Maybe<ClassNode>;
  nodeCount: Scalars['Int'];
  nodes: Array<PropertyNode>;
};


export type SchemaOrgClassNodeArgs = {
  absoluteIRI?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type SchemaOrgNodesArgs = {
  absoluteIRI?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Type>;
};

export type Sort =
  | 'ASC'
  | 'DESC';

export type Type =
  | 'ALL'
  | 'CLASS';



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ClassNode: ResolverTypeWrapper<ClassNode>;
  DataTypeNode: ResolverTypeWrapper<DataTypeNode>;
  FieldValue: FieldValue;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Node: ResolversTypes['ClassNode'] | ResolversTypes['DataTypeNode'] | ResolversTypes['PropertyNode'];
  NodeOrderByInput: NodeOrderByInput;
  PropertyNode: ResolverTypeWrapper<PropertyNode>;
  Query: ResolverTypeWrapper<{}>;
  SchemaOrg: ResolverTypeWrapper<SchemaOrg>;
  Sort: Sort;
  String: ResolverTypeWrapper<Scalars['String']>;
  Type: Type;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  ClassNode: ClassNode;
  DataTypeNode: DataTypeNode;
  Int: Scalars['Int'];
  Node: ResolversParentTypes['ClassNode'] | ResolversParentTypes['DataTypeNode'] | ResolversParentTypes['PropertyNode'];
  NodeOrderByInput: NodeOrderByInput;
  PropertyNode: PropertyNode;
  Query: {};
  SchemaOrg: SchemaOrg;
  String: Scalars['String'];
};

export type ClassNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassNode'] = ResolversParentTypes['ClassNode']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  properties?: Resolver<Array<ResolversTypes['PropertyNode']>, ParentType, ContextType, Partial<ClassNodePropertiesArgs>>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DataTypeNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataTypeNode'] = ResolversParentTypes['DataTypeNode']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  field?: Resolver<ResolversTypes['FieldValue'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'ClassNode' | 'DataTypeNode' | 'PropertyNode', ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PropertyNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PropertyNode'] = ResolversParentTypes['PropertyNode']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isPending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemas?: Resolver<Array<ResolversTypes['DataTypeNode']>, ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  schemaOrg?: Resolver<ResolversTypes['SchemaOrg'], ParentType, ContextType>;
};

export type SchemaOrgResolvers<ContextType = any, ParentType extends ResolversParentTypes['SchemaOrg'] = ResolversParentTypes['SchemaOrg']> = {
  classNode?: Resolver<Maybe<ResolversTypes['ClassNode']>, ParentType, ContextType, RequireFields<SchemaOrgClassNodeArgs, 'absoluteIRI' | 'id'>>;
  nodeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['PropertyNode']>, ParentType, ContextType, RequireFields<SchemaOrgNodesArgs, 'absoluteIRI' | 'type'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ClassNode?: ClassNodeResolvers<ContextType>;
  DataTypeNode?: DataTypeNodeResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PropertyNode?: PropertyNodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SchemaOrg?: SchemaOrgResolvers<ContextType>;
};


export type ClassNodeQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ClassNodeQuery = { __typename?: 'Query', schemaOrg: { __typename?: 'SchemaOrg', classNode?: { __typename?: 'ClassNode', name: string, description: string, properties: Array<{ __typename?: 'PropertyNode', name: string, description: string, isPending: boolean, schemas: Array<{ __typename?: 'DataTypeNode', name: string, field: FieldValue }> }> } | null } };

export type NodesAndClassNodeQueryVariables = Exact<{
  id: Scalars['String'];
  hasType: Scalars['Boolean'];
}>;


export type NodesAndClassNodeQuery = { __typename?: 'Query', schemaOrg: { __typename?: 'SchemaOrg', nodes: Array<{ __typename?: 'PropertyNode', id: string, name: string }>, classNode?: { __typename?: 'ClassNode', name: string, description: string, properties: Array<{ __typename?: 'PropertyNode', name: string, description: string, isPending: boolean, schemas: Array<{ __typename?: 'DataTypeNode', name: string, field: FieldValue }> }> } | null } };
