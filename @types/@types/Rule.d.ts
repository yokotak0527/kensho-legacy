namespace Kensho { // eslint-disable-line
  namespace Rule {
    type Type1Arg<V=any>                                                     = (value : V) => boolean
    type Type2Arg<V, O extends Kensho.AnyObject>                             = (value : V, option : O) => boolean
    type Type3Arg<V, O extends Kensho.AnyObject, K extends Kensho.AnyObject> = (value : V, option : O, Kensho : K) => boolean

    type GetType<N extends string, S extends Store = Store> = N extends keyof S ? S[N] : (...args:any)=>any

    interface Methods {
      add : <
              V                                      = any,
              O extends Kensho.AnyObject | undefined = undefined,
              K extends Kensho.Class     | undefined = undefined
            >(
              name     : string,
              callback : K extends Kensho.Class ? Type3Arg<V, O, K> : O extends Kensho.AnyObject ? Type2Arg<V, O> : Type1Arg<V>
            ) => void
      get : <
              N extends string,
              S extends Store = Store
            >(name : N) => GetType<N, S>
      delete : (name : string) => void
    }

    interface Store {
      'required'       : Kensho.Rule.Type1Arg<any>
      'empty'          : Kensho.Rule.Type1Arg<any>
      'regexp'         : Kensho.Rule.Type2Arg<string, { regexp : RegExp }>
      'email'          : Kensho.Rule.Type3Arg<string, Kensho.AnyObject, Kensho.Class>
      'list'           : Kensho.Rule.Type3Arg<string | RegExp, { list : string[] }, Kensho.Class>
      'number'         : Kensho.Rule.Type1Arg<string | number>
      'integer'        : Kensho.Rule.Type3Arg<string | number, Kensho.AnyObject, Kensho.Class>
      'naturalNumber'  : Kensho.Rule.Type3Arg<string | number, { zero : boolean }, Kensho.Class>
      'positiveNumber' : Kensho.Rule.Type3Arg<string | number, Kensho.AnyObject, Kensho.Class>
      'negativeNumber' : Kensho.Rule.Type3Arg<string | number, Kensho.AnyObject, Kensho.Class>
      'zero'           : Kensho.Rule.Type3Arg<string | number, Kensho.AnyObject, Kensho.Class>
      'age'            : Kensho.Rule.Type3Arg<string | number, { max : number }, Kensho.Class>
      'equal'          : Kensho.Rule.Type2Arg<string, { others : string | string[], isInput? : boolean }>
      'letters'        : Kensho.Rule.Type2Arg<string, { range : { min? : string | number, max? : string | number } }>
    }
  }
}