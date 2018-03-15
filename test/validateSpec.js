// =============================================================================
// required

describe('required', function(){
    it('valid values', function(){
        expect( Kensho.validate( 'required', true  ) ).toBeTruthy();
        expect( Kensho.validate( 'required', 'aaa' ) ).toBeTruthy();
    });
    it('invalid values', function(){
        expect( Kensho.validate( 'required'        ) ).toBeFalsy();
        expect( Kensho.validate( 'required', false ) ).toBeFalsy();
        expect( Kensho.validate( 'required', null  ) ).toBeFalsy();
    });
});
// =============================================================================
// number

describe('number', function(){
    it('valid values', function(){
        expect( Kensho.validate( 'number', '0'                            ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '111'                          ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '-1'                           ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '+20'                          ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '1.0'                          ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '.1'                           ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '1.'                           ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '0.1111'                       ) ).toBeTruthy();
        expect( Kensho.validate( 'number', ''                             ) ).toBeTruthy();
        expect( Kensho.validate( 'number', '２',    { allow2byte : true } ) ).toBeTruthy();
    });
    it('invalid values', function(){
        expect( Kensho.validate( 'number', true                        ) ).toBeFalsy();
        expect( Kensho.validate( 'number', null                        ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '=11'                       ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '++++11'                    ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '11+'                       ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '1....1'                    ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '1.1.1.1'                   ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '２'                        ) ).toBeFalsy();
        expect( Kensho.validate( 'number', '',       { empty : false } ) ).toBeFalsy();
    });
});
// =============================================================================
// age

describe('age', function(){
    it('valid values', function(){
        expect( Kensho.validate( 'age', '0'                           ) ).toBeTruthy();
        expect( Kensho.validate( 'age', '100'                         ) ).toBeTruthy();
        expect( Kensho.validate( 'age', '400',  { maxAge : 500 }      ) ).toBeTruthy();
        expect( Kensho.validate( 'age', '５６', { allow2byte : true } ) ).toBeTruthy();
    });
    it('invalid values', function(){
        expect( Kensho.validate( 'age', '-10'  ) ).toBeFalsy();
        expect( Kensho.validate( 'age', '1.1'  ) ).toBeFalsy();
        expect( Kensho.validate( 'age', '1,1'  ) ).toBeFalsy();
        expect( Kensho.validate( 'age', '1000' ) ).toBeFalsy();
        expect( Kensho.validate( 'age', '0123' ) ).toBeFalsy();
        expect( Kensho.validate( 'age', '５６' ) ).toBeFalsy();
    });
});
// =============================================================================
// halfsize

describe('halfsize', function(){
    it('valid values', function(){
        expect( Kensho.validate( 'halfsize', '1234abasf34-%' ) ).toBeTruthy();
        expect( Kensho.validate( 'halfsize', ''              ) ).toBeTruthy();
    });
    it('invalid values', function(){
        expect( Kensho.validate( 'halfsize', '１２３'                   ) ).toBeFalsy();
        expect( Kensho.validate( 'halfsize', '',      { empty : false } ) ).toBeFalsy();
    });
});
// =============================================================================
// fullsize

describe('fullsize', function(){
    it('valid value', function(){
        expect( Kensho.validate( 'fullsize', '１２３' ) ).toBeTruthy();
        expect( Kensho.validate( 'fullsize', ''       ) ).toBeTruthy();
    });
    it('invalid value', function(){
        expect( Kensho.validate( 'fullsize', '1234abasf34-%'                   ) ).toBeFalsy();
        expect( Kensho.validate( 'fullsize', '',             { empty : false } ) ).toBeFalsy();
    });
});
// =============================================================================
// email

describe('email', function(){
    it('valid value', function(){
        expect( Kensho.validate( 'email', 'a@a.com' ) ).toBeTruthy();
    });
    it('invalid value', function(){
        expect( Kensho.validate( 'email', 'aaa'        ) ).toBeFalsy();
        expect( Kensho.validate( 'email', 'a.a@a.c'    ) ).toBeFalsy();
        expect( Kensho.validate( 'email', 'a.a@a..com' ) ).toBeFalsy();
        expect( Kensho.validate( 'email', 'あ@c.com'   ) ).toBeFalsy();
    });
});

// =============================================================================
// range

describe('range', function(){
    it('valid value', function(){
        expect( Kensho.validate( 'range', 'あいう'                       ) ).toBeTruthy(); // do nothing
        expect( Kensho.validate( 'range', 'あいう', { min : 1 }          ) ).toBeTruthy();
        expect( Kensho.validate( 'range', 'あいう', { min : 0, max : 5 } ) ).toBeTruthy();
        expect( Kensho.validate( 'range', 'あいう', { max : 5          } ) ).toBeTruthy();
    });
    it('invalid value', function(){
        expect( Kensho.validate( 'range', '',        { empty : false } ) ).toBeFalsy();
        expect( Kensho.validate( 'range', 'あいう',  { min   : 10    } ) ).toBeFalsy();
        expect( Kensho.validate( 'range', 'あいう',  { max   : 1     } ) ).toBeFalsy();
    });
});

// =============================================================================
// blacklist

describe('blacklost', function(){
    it('valid value', function(){
        expect( Kensho.validate('blacklist', 'abc' )).toBeTruthy(); // do nothing
        expect( Kensho.validate('blacklist', 'abc', {
            list : /^[0-9]/
        } )).toBeTruthy();
        expect( Kensho.validate('blacklist', 'abc', {
            list : [
                /^[0-9]/,
                'abd'
            ]
        } )).toBeTruthy();
    });
    it('invalid value', function(){
        expect( Kensho.validate( 'blacklist', '', { empty : false })).toBeFalsy();
        expect( Kensho.validate( 'blacklist', 'abc', {
            list : 'abc'
        })).toBeFalsy();
    });
});

// =============================================================================
// whitelist

describe('whitelist', function(){
    it('valid value', function(){
        expect( Kensho.validate('whitelist', 'abc' )).toBeTruthy(); // do nothing
        expect( Kensho.validate('whitelist', 'abc', {
            list : /^[a-z]/
        } )).toBeTruthy();
        expect( Kensho.validate('whitelist', 'abc', {
            list : [
                /^[0-9]$/,
                'abc'
            ]
        } )).toBeTruthy();
    });
    it('invalid value', function(){
        expect( Kensho.validate( 'whitelist', '', { empty : false })).toBeFalsy();
        expect( Kensho.validate( 'whitelist', 'abc', {
            list : 'abd'
        })).toBeFalsy();
    });
});
