// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Function to get the language attribute value for accessibility
function getLangAttribute() {
  // Return the language code from the document's HTML element
  // This helps screen readers pronounce content correctly
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

// Function to ensure ARIA attributes are properly set for the dependency graph
function ensureAriaAttributes() {
  // Ensure the document has proper lang attribute for accessibility
  const lang = getLangAttribute();
  
  // Set lang attribute on document root if not already set
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
  
  return {
    lang: lang,
    accessible: true
  };
}

// Function to handle sorting books by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id || `${book.title.substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
}

// TODO: Implement tower defense
function createTowerDefenseSystem() {
  const towers = [];
  const enemies = [];
  let score = 0;
  let lives = 10;
  const gridSize = 8;
  
  function createTower(x, y, type = 'basic') {
    const tower = {
      id: `tower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      type,
      damage: type === 'basic' ? 10 : type === 'sniper' ? 25 : 5,
      range: type === 'basic' ? 2 : type === 'sniper' ? 5 : 1,
      fireRate: type === 'basic' ? 1000 : type === 'sniper' ? 2000 : 500,
      lastFired: 0
    };
    towers.push(tower);
    return tower;
  }
  
  function createEnemy(pathIndex = 0, health = 100) {
    const enemy = {
      id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pathIndex,
      health,
      maxHealth: health,
      speed: 1,
      x: pathIndex,
      y: 0,
      reward: 10
    };
    enemies.push(enemy);
    return enemy;
  }
  
  function getTowersInRange(x, y) {
    return towers.filter(tower => {
      const distance = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      return distance <= tower.range;
    });
  }
  
  function damageEnemy(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0) {
      score += enemy.reward;
      return true;
    }
    return false;
  }
  
  function moveEnemies() {
    enemies.forEach(enemy => {
      if (enemy.pathIndex < gridSize - 1) {
        enemy.pathIndex += enemy.speed;
      } else {
        lives -= 1;
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }
    });
  }
  
  function updateTowers(currentTime) {
    enemies.forEach(enemy => {
      const inRangeTowers = getTowersInRange(enemy.pathIndex, enemy.y);
      inRangeTowers.forEach(tower => {
        if (currentTime - tower.lastFired >= tower.fireRate) {
          const destroyed = damageEnemy(enemy, tower.damage);
          tower.lastFired = currentTime;
          if (destroyed) {
            const index = enemies.indexOf(enemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      });
    });
  }
  
  function getScore() {
    return score;
  }
  
  function getLives() {
    return lives;
  }
  
  function getAllTowers() {
    return [...towers];
  }
  
  function getAllEnemies() {
    return [...enemies];
  }
  
  function isGameOver() {
    return lives <= 0;
  }
  
  return {
    createTower,
    createEnemy,
    getTowersInRange,
    damageEnemy,
    moveEnemies,
    updateTowers,
    getScore,
    getLives,
    getAllTowers,
    getAllEnemies,
    isGameOver,
    gridSize
  };
}

// Function to count dependencies
function countDependencies() {
  const dependencies = ['react', 'react-redux', 'antd'];
  return dependencies.length;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
export function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Ensure accessibility attributes are set when adding a book
ensureAriaAttributes();

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Export utility functions
export { sortByTitle, sortByAuthor, generateKey, BookItem, defaultSorting, onTitleSort, onAuthorSort, countDependencies, createTowerDefenseSystem };

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();
  const [towerDefense, setTowerDefense] = useState(null);
  const [gameState, setGameState] = useState({ score: 0, lives: 10, gameOver: false });
  const [selectedTowerType, setSelectedTowerType] = useState('basic');

  useEffect(() => {
    if (!towerDefense) {
      setTowerDefense(createTowerDefenseSystem());
    }
  }, [towerDefense]);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Tower defense game loop
  useEffect(() => {
    if (!towerDefense || gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      const currentTime = Date.now();
      towerDefense.updateTowers(currentTime);
      towerDefense.moveEnemies();

      setGameState({
        score: towerDefense.getScore(),
        lives: towerDefense.getLives(),
        gameOver: towerDefense.isGameOver()
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [towerDefense, gameState.gameOver]);

  function handlePlaceTower(x, y) {
    if (towerDefense && !gameState.gameOver) {
      towerDefense.createTower(x, y, selectedTowerType);
      setGameState({
        ...gameState,
        score: towerDefense.getScore()
      });
    }
  }

  function handleStartWave() {
    if (towerDefense && !gameState.gameOver) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          towerDefense.createEnemy(0, 100 + i * 20);
        }, i * 1000);
      }
    }
  }

  function handleRestartGame() {
    setTowerDefense(createTowerDefenseSystem());
    setGameState({ score: 0, lives: 10, gameOver: false });
  }

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List itemLayout="vertical" dataSource={bookItems} renderItem={book => BookItem(book)} />
      
      {/* Tower Defense Section */}
      <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #333', borderRadius: '8px' }}>
        <h2>Tower Defense Game</h2>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ marginRight: '20px' }}>Score: {gameState.score}</span>
          <span style={{ marginRight: '20px' }}>Lives: {gameState.lives}</span>
          {gameState.gameOver && <span style={{ color: 'red', fontWeight: 'bold' }}>GAME OVER</span>}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Tower Type:</label>
          <select 
            value={selectedTowerType} 
            onChange={(e) => setSelectedTowerType(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            <option value="basic">Basic Tower (Damage: 10, Range: 2)</option>
            <option value="sniper">Sniper Tower (Damage: 25, Range: 5)</option>
            <option