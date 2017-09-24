describe('required', function(){
  it('false', function(){
    expect(Kensho.validate('required', '1')).toBeTruthy();
    expect(Kensho.validate('required', ' ')).toBeTruthy();
  });
  it('true', function(){
    expect(Kensho.validate('required')).toBeFalsy();
    expect(Kensho.validate('required', '')).toBeFalsy();
    expect(Kensho.validate('required', ' ', {trim : true})).toBeFalsy();
  });
});
describe('number', function(){
  it('true', function(){
    expect(Kensho.validate('number', '1')).toBeTruthy();
    expect(Kensho.validate('number', '１', {allow2byte : true})).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('number', 'あ')).toBeFalsy();
  });
});
describe('age', function(){
  it('true', function(){
    expect(Kensho.validate('age', '0')).toBeTruthy();
    expect(Kensho.validate('age', '１２', {allow2byte : true})).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('age', '-1')).toBeFalsy();
    expect(Kensho.validate('age', '200')).toBeFalsy();
    expect(Kensho.validate('age', 'あ')).toBeFalsy();
    expect(Kensho.validate('age', 'い', {allow2byte : true})).toBeFalsy();
  });
});
describe('fullsize', function(){
  it('true', function(){
    expect(Kensho.validate('fullsize', 'あいうえお')).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('fullsize', 'abc')).toBeFalsy();
  });
});
describe('halfsize', function(){
  it('true', function(){
    expect(Kensho.validate('halfsize', 'abc')).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('halfsize', 'あいう')).toBeFalsy();
  });
});
describe('range', function(){
  it('true', function(){
    expect(Kensho.validate('range', 'abc', {min : 3})).toBeTruthy();
    expect(Kensho.validate('range', 'abc', {max : 3})).toBeTruthy();
    expect(Kensho.validate('range', 'abc', {min : 1, max : 3})).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('range', 'abc', {min : 5})).toBeFalsy();
    expect(Kensho.validate('range', 'abc', {max : 2})).toBeFalsy();
    expect(Kensho.validate('range', 'a', {min : 2, max : 5})).toBeFalsy();
  });
});
describe('email', function(){
  it('true', function(){
    expect(Kensho.validate('email', 'a@a.com')).toBeTruthy();
    expect(Kensho.validate('email', 'a.a@a.com')).toBeTruthy();
    expect(Kensho.validate('email', 'a-a@a.co.jp')).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('email', 'a-a@a.co.jp.a')).toBeFalsy();
    expect(Kensho.validate('email', '.a-a@a.co.jp')).toBeFalsy();
  });
});
describe('whilelist', function(){
  it('true', function(){
    expect(Kensho.validate('whitelist', 'abc', {
      list : ['abc']
    })).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('whitelist', 'abc', {
      list : ['abd']
    })).toBeFalsy();
  });
});
describe('blacklist', function(){
  it('true', function(){
    expect(Kensho.validate('blacklist', 'abc', {
      list : ['abd']
    })).toBeTruthy();
  });
  it('false', function(){
    expect(Kensho.validate('blacklist', 'abc', {
      list : ['abc']
    })).toBeFalsy();
  });
});
