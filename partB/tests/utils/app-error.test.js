import { AppError } from '../../src/utils/app-error.js';

describe('AppError', () => {
  it('message, statusCode-ыг хадгална', () => {
    const err = new AppError('something broke', 418);
    expect(err.message).toBe('something broke');
    expect(err.statusCode).toBe(418);
  });

  it('code өгөөгүй үед default-аар APP_ERROR утга ашиглана', () => {
    const err = new AppError('boom', 500);
    expect(err.code).toBe('APP_ERROR');
  });

  it('тусгайлсан code-ыг хүлээж авна', () => {
    const err = new AppError('not found', 404, 'LINK_NOT_FOUND');
    expect(err.code).toBe('LINK_NOT_FOUND');
  });

  it('Error class-ын instance байх ёстой', () => {
    const err = new AppError('x', 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.name).toBe('AppError');
  });

  it('isOperational нь true байна (programmer error биш)', () => {
    const err = new AppError('x', 400);
    expect(err.isOperational).toBe(true);
  });
});
