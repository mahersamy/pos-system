export interface Adaptor<T = any, K = any> {
  adapt(data: K): T;
}