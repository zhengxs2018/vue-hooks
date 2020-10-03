import type { Ref, UnwrapRef } from '@vue/composition-api'

export type BaseTypes =  string | number | boolean | Node | Window

export type WeakCollections = WeakMap<any, any> | WeakSet<any>

export type IterableCollections = Map<any, any> | Set<any>

export type CollectionTypes = IterableCollections | WeakCollections

export type SymbolExtract<T> = (T extends {
  [Symbol.asyncIterator]: infer V;
} ? {
  [Symbol.asyncIterator]: V;
} : {}) & (T extends {
  [Symbol.hasInstance]: infer V;
} ? {
  [Symbol.hasInstance]: V;
} : {}) & (T extends {
  [Symbol.isConcatSpreadable]: infer V;
} ? {
  [Symbol.isConcatSpreadable]: V;
} : {}) & (T extends {
  [Symbol.iterator]: infer V;
} ? {
  [Symbol.iterator]: V;
} : {}) & (T extends {
  [Symbol.match]: infer V;
} ? {
  [Symbol.match]: V;
} : {}) & (T extends {
  [Symbol.replace]: infer V;
} ? {
  [Symbol.replace]: V;
} : {}) & (T extends {
  [Symbol.search]: infer V;
} ? {
  [Symbol.search]: V;
} : {}) & (T extends {
  [Symbol.species]: infer V;
} ? {
  [Symbol.species]: V;
} : {}) & (T extends {
  [Symbol.split]: infer V;
} ? {
  [Symbol.split]: V;
} : {}) & (T extends {
  [Symbol.toPrimitive]: infer V;
} ? {
  [Symbol.toPrimitive]: V;
} : {}) & (T extends {
  [Symbol.toStringTag]: infer V;
} ? {
  [Symbol.toStringTag]: V;
} : {}) & (T extends {
  [Symbol.unscopables]: infer V;
} ? {
  [Symbol.unscopables]: V;
} : {})

export type UnwrappedObject<T> = {
    [P in keyof T]: UnwrapRef<T[P]>;
  } & SymbolExtract<T>

export type UnwrapRefSimple<T> = T extends Function | CollectionTypes | BaseTypes | Ref ? T : T extends Array<any> ? {
    [K in keyof T]: UnwrapRefSimple<T[K]>;
} : T extends object ? UnwrappedObject<T> : T;
