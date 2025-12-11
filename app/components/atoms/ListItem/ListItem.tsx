import React from 'react';
import { List } from 'react-native-paper';
import type { ListItemProps as PaperListItemProps } from 'react-native-paper';

export interface ListItemProps extends PaperListItemProps {

}

export function ListItem({ ...props }: ListItemProps) {
  return <List.Item {...props} />;
}
