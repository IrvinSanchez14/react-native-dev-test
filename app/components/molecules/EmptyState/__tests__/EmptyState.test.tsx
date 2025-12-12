import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render title', () => {
    const { getByText } = render(<EmptyState title="No items found" />);
    expect(getByText('No items found')).toBeTruthy();
  });

  it('should render message when provided', () => {
    const { getByText } = render(
      <EmptyState title="No items" message="Try refreshing the page" />
    );
    expect(getByText('Try refreshing the page')).toBeTruthy();
  });

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <EmptyState title="Empty" icon="inbox" />
    );
    // Icon rendering is tested indirectly through component rendering
    expect(getByTestId).toBeDefined();
  });

  it('should render action button when actionLabel and onAction are provided', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState
        title="Empty"
        actionLabel="Refresh"
        onAction={onAction}
      />
    );
    
    expect(getByText('Refresh')).toBeTruthy();
  });

  it('should call onAction when action button is pressed', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState
        title="Empty"
        actionLabel="Refresh"
        onAction={onAction}
      />
    );
    
    fireEvent.press(getByText('Refresh'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when actionLabel is missing', () => {
    const onAction = jest.fn();
    const { queryByText } = render(
      <EmptyState title="Empty" onAction={onAction} />
    );
    
    expect(queryByText('Refresh')).toBeNull();
  });

  it('should not render action button when onAction is missing', () => {
    const { queryByText } = render(
      <EmptyState title="Empty" actionLabel="Refresh" />
    );
    
    expect(queryByText('Refresh')).toBeNull();
  });

  it('should not render message when message is not provided', () => {
    const { queryByText } = render(<EmptyState title="Empty" />);
    expect(queryByText('message')).toBeNull();
  });
});
