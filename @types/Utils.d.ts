declare namespace Kensho {
  type AnyObject                 = Record<[string], unknown>
  type AnyFunction<A=any, R=any> = (...args:A)=>R
}