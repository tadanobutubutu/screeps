import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enforceAccessibilityForAddBook } from './bookFunctions';
import UserSafety from './UserSafety';
import { addLangAttribute, setLanguageAttribute, fixTableStructureIssues, landmarkStructureCheck, addMainLandmark, addProperLandmarkRegions, addLandmarkRoles, addSvgAccessibleNames, validateSvgAccessibility, ensureUniqueLandmarks, ensureLandmarkUniqueness, processUniqueElements } from './accessibilityFunctions';
import { createInPageButtons, addressAccessibilityIssues, getInsightReport, calculateSum, addProperLandmarkRegions as accessibilityAddProperLandmarkRegions, countDependencies } from './accessibilityFunctions-merged';
import { checkLandmarkElement } from './accessibilityFunctions-merged';

export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixTableStructureIssues,
  isSecureContext,
  initApp,
  landmarks,
  appState,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies
};

export default function Main({ checkAllowed }) {
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.bookList);

  const AuthorizedAddBookForm = (props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    useEffect(() => {
      authorizeUser(() => setIsAuthorized(true));
    }, []);
    return isAuthorized ? <AddBookForm {...props} checkAllowed={checkAllowed} /> : <div>Access denied - please login to add books.</div>;
  };

  const booksListWithLandmarks = booksList.map((book) => {
    const landmarks = addProperLandmarkRegions(book.container);
    book.landmarks = landmarkStructureCheck(landmarks.landmarks);
    return book;
  });

  const [insightReport, setInsightReport] = useState([]);

  useEffect(() => {
    const newReport = getInsightReport();
    setInsightReport(newReport);
    if (newReport.length > 0) {
      addressAccessibilityIssues(newReport);
    }
  }, []);

  // ... previous code for state, dispatch, booksList, bookItems, handleSort, and handleAddBook

  return (
    <main {...getLandmarkProps('main', 'Main content')}>
      {landmarkStructureCheck(booksListWithLandmarks.map(book => book.landmarks)).valid ? (
        <>
          <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
          <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
          <List
            itemLayout="vertical"
            dataSource={booksListWithLandmarks}
            renderItem={book => (
              <List.Item key={generateKey(book)}>
                <BookItem book={book} />
              </List.Item>
            )}
          />
          {fixTableStructureIssues(book.container)}
          {booksListWithLandmarks[0].landmarks.errors.length > 0 && (
            <div>Error(s) encountered initializing landmarks: {booksListWithLandmarks[0].landmarks.errors.join(', ')}</div>
          )}
          <AuthorizedAddBookForm onAdd={handleAddBook} />
          {createInPageButtons(inPageButtonsData)}
          {insightReport.map((issue, index) => (
            <div key={index}>
              <strong>{issue.type}:</strong> {issue.description}
            </div>
          ))}
        </>
      ) : (
        <div>There was an issue initializing the main landmarks. Please review the attached error codes.</div>
      )}
    </main>
  );
}