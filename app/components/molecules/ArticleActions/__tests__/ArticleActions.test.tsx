import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ArticleActions } from '../ArticleActions';
import type { Article } from '../../../../types/article';

// Mock Linking
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Linking: {
      openURL: jest.fn(() => Promise.resolve()),
    },
  };
});

const createMockArticle = (overrides?: Partial<Article>): Article => ({
  id: 1,
  title: 'Test Article',
  url: 'https://example.com',
  by: 'testuser',
  time: 1234567890,
  score: 100,
  descendants: 50,
  type: 'story',
  isRead: false,
  isSaved: false,
  isFavorite: false,
  fetchedAt: Date.now(),
  feeds: ['top'],
  ...overrides,
});

describe('ArticleActions', () => {
  it('should render save button when onSave is provided', () => {
    const article = createMockArticle();
    const onSave = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onSave={onSave} />
    );
    
    expect(getByLabelText('Bookmark article')).toBeTruthy();
  });

  it('should render favorite button when onFavorite is provided', () => {
    const article = createMockArticle();
    const onFavorite = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onFavorite={onFavorite} />
    );
    
    expect(getByLabelText('Add to favorites')).toBeTruthy();
  });

  it('should render external link button when article has url', () => {
    const article = createMockArticle({ url: 'https://example.com' });
    const { getByLabelText } = render(<ArticleActions article={article} />);
    
    expect(getByLabelText('Open article in browser')).toBeTruthy();
  });

  it('should call onSave when save button is pressed', () => {
    const article = createMockArticle();
    const onSave = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onSave={onSave} />
    );
    
    fireEvent.press(getByLabelText('Bookmark article'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onFavorite when favorite button is pressed', () => {
    const article = createMockArticle();
    const onFavorite = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onFavorite={onFavorite} />
    );
    
    fireEvent.press(getByLabelText('Add to favorites'));
    expect(onFavorite).toHaveBeenCalledTimes(1);
  });

  it('should show saved icon when article is saved', () => {
    const article = createMockArticle({ isSaved: true });
    const onSave = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onSave={onSave} />
    );
    
    expect(getByLabelText('Remove bookmark')).toBeTruthy();
  });

  it('should show favorite icon when article is favorited', () => {
    const article = createMockArticle({ isFavorite: true });
    const onFavorite = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onFavorite={onFavorite} />
    );
    
    expect(getByLabelText('Remove from favorites')).toBeTruthy();
  });

  it('should call onExternal when provided and external link is pressed', () => {
    const article = createMockArticle({ url: 'https://example.com' });
    const onExternal = jest.fn();
    const { getByLabelText } = render(
      <ArticleActions article={article} onExternal={onExternal} />
    );
    
    fireEvent.press(getByLabelText('Open article in browser'));
    expect(onExternal).toHaveBeenCalledTimes(1);
  });

  it('should not render external link button when article has no url', () => {
    const article = createMockArticle({ url: undefined });
    const { queryByLabelText } = render(<ArticleActions article={article} />);
    
    expect(queryByLabelText('Open article in browser')).toBeNull();
  });
});
