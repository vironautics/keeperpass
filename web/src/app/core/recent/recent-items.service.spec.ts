import { TestBed } from '@angular/core/testing';
import {
  MAX_RECENT_ITEMS,
  RECENT_ITEMS_STORAGE_KEY,
  RecentItemsService,
} from './recent-items.service';

describe('RecentItemsService', () => {
  let service: RecentItemsService;

  beforeEach(() => {
    service = TestBed.inject(RecentItemsService);
  });

  it('starts empty when nothing was left over from a previous session', () => {
    expect(service.ids()).toEqual([]);
  });

  it('records a visit at the front of the list', () => {
    service.recordVisit('a');
    service.recordVisit('b');

    expect(service.ids()).toEqual(['b', 'a']);
  });

  it('moves a re-visited id back to the front instead of duplicating it', () => {
    service.recordVisit('a');
    service.recordVisit('b');
    service.recordVisit('c');

    service.recordVisit('a');

    expect(service.ids()).toEqual(['a', 'c', 'b']);
  });

  it('caps the list at MAX_RECENT_ITEMS, dropping the oldest', () => {
    for (let i = 0; i < MAX_RECENT_ITEMS + 5; i++) {
      service.recordVisit(`item-${i}`);
    }

    const ids = service.ids();
    expect(ids).toHaveLength(MAX_RECENT_ITEMS);
    expect(ids[0]).toBe(`item-${MAX_RECENT_ITEMS + 4}`);
    expect(ids).not.toContain('item-0');
    expect(ids).not.toContain('item-4');
  });

  it('forgets an id, closing the gap', () => {
    service.recordVisit('a');
    service.recordVisit('b');
    service.recordVisit('c');

    service.forget('b');

    expect(service.ids()).toEqual(['c', 'a']);
  });

  it('is a no-op to forget an id that was never recorded', () => {
    service.recordVisit('a');

    service.forget('does-not-exist');

    expect(service.ids()).toEqual(['a']);
  });

  it('persists to localStorage on every visit and forget', () => {
    service.recordVisit('a');
    service.recordVisit('b');

    expect(JSON.parse(localStorage.getItem(RECENT_ITEMS_STORAGE_KEY)!)).toEqual(['b', 'a']);

    service.forget('a');

    expect(JSON.parse(localStorage.getItem(RECENT_ITEMS_STORAGE_KEY)!)).toEqual(['b']);
  });
});

describe('RecentItemsService — restoring from localStorage on startup', () => {
  it('restores its list from localStorage', () => {
    localStorage.setItem(RECENT_ITEMS_STORAGE_KEY, JSON.stringify(['x', 'y']));

    const restored = TestBed.inject(RecentItemsService);

    expect(restored.ids()).toEqual(['x', 'y']);
  });

  it('ignores corrupt (non-JSON) localStorage content and starts empty', () => {
    localStorage.setItem(RECENT_ITEMS_STORAGE_KEY, 'not json');

    const restored = TestBed.inject(RecentItemsService);

    expect(restored.ids()).toEqual([]);
  });

  it('ignores non-array or non-string-element localStorage content', () => {
    localStorage.setItem(RECENT_ITEMS_STORAGE_KEY, JSON.stringify({ not: 'an array' }));

    const restored = TestBed.inject(RecentItemsService);

    expect(restored.ids()).toEqual([]);
  });
});
