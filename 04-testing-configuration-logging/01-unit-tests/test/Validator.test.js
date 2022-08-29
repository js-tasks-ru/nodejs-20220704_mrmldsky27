const Validator = require('../Validator');
const expect = require('chai').expect;

const nameValidator = new Validator({
  name: {
    type: 'string',
    min: 10,
    max: 20,
  },
});

const ageValidator = new Validator({
  age: {
    type: 'number',
    min: 10,
    max: 145,
  },
});

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const errors = nameValidator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
  });

  it('валидатор проверяет числовые поля', () => {
    const errors = ageValidator.validate({age: 1});

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('age');
    expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 1');
  });

  it('валидатор возвращает ошибку, если тип - число, но была передана строка', () => {
    const errors = nameValidator.validate({name: 5});

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
  });
  it('валидатор возвращает ошибку, если тип - строка, но было передано число', () => {
    const errors = ageValidator.validate({age: 'Hello'});

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('age');
    expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
  });
  it('выбрасывает ошибку, если поле не было передано', () => {
    const errors = nameValidator.validate({});

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0]).to.have.property('error').and.to.be.equal('the value was not provided');
  });
});
