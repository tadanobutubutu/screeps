import React from 'react';
import { Component, ReactDOMServer } from 'react';
import { HTMLAttributes, ReactElement } from 'react';

class Main extends Component {
  render() {
    const htmlAttributes: HTMLAttributes<HTMLDivElement> = {
      lang: 'en',
    };

    const Table = ({ children }) => {
      return (
        <table aria-label="Accessible Table">
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      );
    };

    const Landmarks = () => (
      <>
        <header id="banner">Header</header>
        <main id="mainContent">{this.props.children}</main>
        <footer>Footer</footer>
      </>
    );

    const Logo = () => <img src="/logo.svg" alt="Accessible Name for Logo" />;
    const MenuIcon = () => <img src="/menu.svg" alt="Accessible Name for Menu Icon" />;

    const uniqueMainContent = {
      ...htmlAttributes,
      id: `${htmlAttributes.id}-unique`,
    };

    const fixedLink = (
      <a href="#" onClick={() => console.warn('Fake Link clicked')}>
        Fake Link
      </a>
    );

    return (
      <div {...htmlAttributes}>
        <Landmarks>
          <Table id="existingTable">...</Table>
          <Table id="updatedTable">...</Table>
          {Logo()}
          {MenuIcon()}
          {fixedLink}
          <main id="mainContent" {...uniqueMainContent}>
            {this.props.children}
          </main>
        </Landmarks>
      </div>
    );
  }
}

export default React.memo(Main);