declare namespace Kensho { // eslint-disable-line
  namespace Plugin {
    interface Methods {
      add    : <F extends Kensho.AnyFunction>(name: string, method: F) => void
      get    : <N extends string, S extends Store = Store>(name: N) => N extends keyof S ? S[N] : Kensho.AnyFunction
      delete : (name: string) => void
    }
    interface Store {
      'charWidthMapAssign' : (map  : {[x:string]:string}) => void
      'half2full'          : (str  : string) => string
      'full2half'          : (str  : string) => string
      'is1byte'            : (char : string) => boolean
      'is2byte'            : (char : string) => boolean
      'squash'             : (str  : string, linebreak? : boolean) => string
    }
  }
}