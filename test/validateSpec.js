describe('required test', function(){
    it('it is true', function(){
      expect(Kensho.validate('required', '1')).toBeTruthy(true);
    });
});
