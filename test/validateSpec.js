// =============================================================================
// required
// 
// describe('required', function(){
//     describe('expect TRUE', function(){
//         it('boolean', function(){
//             expect(Kensho.validate('required', true)).toBeTruthy();
//         });
//         it('string', function(){
//             expect(Kensho.validate('required', 'aaa')).toBeTruthy();
//         });
//     });
//     describe('expect FALSE', function(){
//         it('boolean', function(){
//             expect(Kensho.validate('required', false)).toBeFalsy();
//         });
//         it('null', function(){
//             expect(Kensho.validate('required', null)).toBeFalsy();
//         });
//         it('undefined', function(){
//             expect(Kensho.validate('required')).toBeFalsy();
//         });
//     });
// });
// =============================================================================
// number
// 
// describe('number', function(){
//     describe('expect TRUE', function(){
//         it('integer', function(){
//             expect(Kensho.validate('number', '0')).toBeTruthy();
//             expect(Kensho.validate('number', '111')).toBeTruthy();
//         });
//         it('signed', function(){
//             expect(Kensho.validate('number', '-1', {signed : true})).toBeTruthy();
//             expect(Kensho.validate('number', '+20', {signed : true})).toBeTruthy();
//         });
//         it('decimal point', function(){
//             expect(Kensho.validate('number', '1.0', {point : true})).toBeTruthy();
//             expect(Kensho.validate('number', '0.1111', {point : true})).toBeTruthy();
//         });
//         it('2byte number', function(){
//             expect(Kensho.validate('number', '２', {allow2byte : true})).toBeTruthy();
//         });
//     });
//     describe('expect FALSE', function(){
//         it('invalid type', function(){
//             expect(Kensho.validate('number', true)).toBeFalsy();
//         });
//         it('signed', function(){
//             expect(Kensho.validate('number', '-11')).toBeFalsy();
//             expect(Kensho.validate('number', '=11', {signed : true})).toBeFalsy();
//             expect(Kensho.validate('number', '++++11', {signed : true})).toBeFalsy();
//             expect(Kensho.validate('number', '11+', {signed : true})).toBeFalsy();
//         });
//         it('decimal point', function(){
//             expect(Kensho.validate('number', '1.1')).toBeFalsy();
//             expect(Kensho.validate('number', '.11', {point : true})).toBeFalsy();
//             expect(Kensho.validate('number', '1....1', {point : true})).toBeFalsy();
//             expect(Kensho.validate('number', '1.', {point : true})).toBeFalsy();
//             expect(Kensho.validate('number', '1.1.1.1', {point : true})).toBeFalsy();
//         });
//     });
// });
// =============================================================================
// age
// 
// describe('age', function(){
//     describe('expect TRUE', function(){
//         it('valid value', function(){
//             expect(Kensho.validate('age', '0')).toBeTruthy();
//             expect(Kensho.validate('age', '100')).toBeTruthy();
//             expect(Kensho.validate('age', '400', {maxAge : 500})).toBeTruthy();
//         });
//     });
//     describe('expect FALSE', function(){
//         it('invalid value', function(){
//             expect(Kensho.validate('age', '-10')).toBeFalsy();
//             expect(Kensho.validate('age', '1000')).toBeFalsy();
//         });
//     });
// });
// 
// =============================================================================
// halfsize
// 
// describe('halfsize', function(){
//     it('valid value', function(){
//         expect(Kensho.validate('halfsize', '1234abasf34-%')).toBeTruthy();
//     });
//     it('invalid value', function(){
//         expect(Kensho.validate('halfsize', '１２３')).toBeFalsy();
//     });
// });
// =============================================================================
// fullsize
// 
// describe('fullsize', function(){
//     it('valid value', function(){
//         expect(Kensho.validate('fullsize', '１２３')).toBeTruthy();
//     });
//     it('invalid value', function(){
//         expect(Kensho.validate('fullsize', '1234abasf34-%')).toBeFalsy();
//     });
// });
// =============================================================================
// email
// 
// describe('email', function(){
//     it('valid value', function(){
//         expect(Kensho.validate('email', 'a@a.com')).toBeTruthy();
//     });
//     it('invalid value', function(){
//         expect(Kensho.validate('email', 'aaa')).toBeFalsy();
//         expect(Kensho.validate('email', 'a.a@a.c')).toBeFalsy();
//         expect(Kensho.validate('email', 'a.a@a..com')).toBeFalsy();
//     });
// });

describe('range', function(){
});
