import { generateCode } from '../../src/utils/code-generator.js';

describe('generateCode', () => {
  it('default урт нь 7 тэмдэгт байна', () => {
    const code = generateCode();
    expect(code).toHaveLength(7);
  });

  it('зөвхөн base62 alphabet (a-z, A-Z, 0-9) тэмдэгт ашиглана', () => {
    const code = generateCode(16);
    expect(code).toMatch(/^[A-Za-z0-9]{16}$/);
  });

  it('хүссэн уртаар код буцаана', () => {
    expect(generateCode(4)).toHaveLength(4);
    expect(generateCode(12)).toHaveLength(12);
    expect(generateCode(32)).toHaveLength(32);
  });

  it('хоёр дараалсан дуудалт ялгаатай үр дүн буцаах магадлал маш өндөр', () => {
    const a = generateCode(12);
    const b = generateCode(12);
    expect(a).not.toBe(b);
  });

  it('хэт богино урт дээр RangeError шиднэ', () => {
    expect(() => generateCode(3)).toThrow(RangeError);
    expect(() => generateCode(0)).toThrow(RangeError);
  });

  it('хэт урт буюу бүхэл бус утга дээр RangeError шиднэ', () => {
    expect(() => generateCode(33)).toThrow(RangeError);
    expect(() => generateCode(1.5)).toThrow(RangeError);
    expect(() => generateCode('7')).toThrow(RangeError);
  });
});
