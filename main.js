import { createElement } from 'react';

export default function Page(props) {
  return createElement('div', { lang: 'en', ...props });
}