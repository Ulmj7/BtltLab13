import { createLinkService } from '../../src/services/link-service.js';
import { AppError } from '../../src/utils/app-error.js';

function makeFakeRepo(overrides = {}) {
  return {
    insertLink: jest.fn(async ({ code, url }) => ({
      id: '1',
      code,
      url,
      createdAt: new Date('2026-05-13T00:00:00Z'),
    })),
    findByCode: jest.fn(async () => null),
    incrementClicks: jest.fn(async () => 1),
    ...overrides,
  };
}

describe('linkService.createShortLink', () => {
  it('зөв https URL дээр шинэ link буцаана', async () => {
    const repo = makeFakeRepo();
    const service = createLinkService({ repository: repo, codeGenerator: () => 'abc1234' });

    const link = await service.createShortLink({ url: 'https://example.com/path' });

    expect(link.code).toBe('abc1234');
    expect(link.url).toBe('https://example.com/path');
    expect(repo.insertLink).toHaveBeenCalledWith({ code: 'abc1234', url: 'https://example.com/path' });
  });

  it('http URL мөн зөвшөөрнө', async () => {
    const repo = makeFakeRepo();
    const service = createLinkService({ repository: repo, codeGenerator: () => 'http001' });
    const link = await service.createShortLink({ url: 'http://example.com' });
    expect(link.url).toBe('http://example.com');
  });

  it('хоосон URL дээр 422 AppError шиднэ', async () => {
    const service = createLinkService({ repository: makeFakeRepo(), codeGenerator: () => 'x' });
    await expect(service.createShortLink({ url: '' })).rejects.toMatchObject({
      statusCode: 422,
      code: 'URL_INVALID',
    });
  });

  it('javascript: scheme зөвшөөрөхгүй (XSS-аас хамгаалалт)', async () => {
    const service = createLinkService({ repository: makeFakeRepo(), codeGenerator: () => 'x' });
    await expect(
      service.createShortLink({ url: 'javascript:alert(1)' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('2048 тэмдэгтээс урт URL-ийг татгалзана', async () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2100);
    const service = createLinkService({ repository: makeFakeRepo(), codeGenerator: () => 'x' });
    await expect(service.createShortLink({ url: longUrl })).rejects.toMatchObject({
      statusCode: 422,
    });
  });

  it('collision гарвал шинэ код үүсгэж дахин оролдоно', async () => {
    let calls = 0;
    const repo = makeFakeRepo({
      insertLink: jest.fn(async ({ code, url }) => {
        calls += 1;
        if (calls < 3) return null; // эхний 2 удаа collision
        return { id: '1', code, url, createdAt: new Date() };
      }),
    });
    const codes = ['a', 'b', 'c'];
    const service = createLinkService({ repository: repo, codeGenerator: () => codes.shift() });

    const link = await service.createShortLink({ url: 'https://example.com' });
    expect(link.code).toBe('c');
    expect(repo.insertLink).toHaveBeenCalledTimes(3);
  });

  it('5 collision дараа АppError шиднэ', async () => {
    const repo = makeFakeRepo({ insertLink: jest.fn(async () => null) });
    const service = createLinkService({ repository: repo, codeGenerator: () => 'x' });

    await expect(service.createShortLink({ url: 'https://example.com' })).rejects.toMatchObject({
      statusCode: 500,
      code: 'CODE_COLLISION_EXHAUSTED',
    });
    expect(repo.insertLink).toHaveBeenCalledTimes(5);
  });
});

describe('linkService.resolveAndTrackClick', () => {
  it('код олдвол url буцаана, click++', async () => {
    const repo = makeFakeRepo({
      findByCode: jest.fn(async () => ({
        id: '1',
        code: 'abc1234',
        url: 'https://example.com',
        clickCount: 5,
        createdAt: new Date(),
      })),
      incrementClicks: jest.fn(async () => 6),
    });
    const service = createLinkService({ repository: repo });

    const result = await service.resolveAndTrackClick('abc1234');
    expect(result).toEqual({ url: 'https://example.com', clickCount: 6 });
    expect(repo.incrementClicks).toHaveBeenCalledWith('abc1234');
  });

  it('олдоогүй кодод 404 AppError шиднэ', async () => {
    const repo = makeFakeRepo({ findByCode: jest.fn(async () => null) });
    const service = createLinkService({ repository: repo });

    await expect(service.resolveAndTrackClick('missing')).rejects.toMatchObject({
      statusCode: 404,
      code: 'LINK_NOT_FOUND',
    });
    expect(repo.incrementClicks).not.toHaveBeenCalled();
  });

  it('хоосон / буруу код дээр 400 AppError шиднэ', async () => {
    const service = createLinkService({ repository: makeFakeRepo() });
    await expect(service.resolveAndTrackClick('')).rejects.toMatchObject({ statusCode: 400 });
    await expect(service.resolveAndTrackClick(undefined)).rejects.toMatchObject({ statusCode: 400 });
  });
});
