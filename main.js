// TODO: This is the existing code that needs to be preserve - Address new accessibility issues from insight report:
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function detectAndSetLang(content) {
  let lang = 'en';
  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh';
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja';
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru';
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar';
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr';
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de';
    }
  }
  return setHtmlLangAttribute(lang);
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function personName(name) {
  if (!name) return '';
  return name.trim();
}

function validateTableAccessibility(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function validateLandmark(element) {
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  const errors = [];
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }
  return { valid: errors.length === 0, errors };
}

function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }
  return '';
}

function ensureUniqueLandmarks() {
  const errors = [];
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];
  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;
    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });
  return { valid: errors.length === 0, errors };
}

function createAccessibleLink(href, text, options = {}) {
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;
  if (!href && !onClick) {
    return null;
  }
  const link = document.createElement('a');
  link.textContent = text;
  if (href) {
    link.href = href;
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }
  if (target) {
    link.target = target;
  }
  if (className) {
    link.className = className;
  }
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }
  return link;
}

function isLinkAccessible(link) {
  const errors = [];
  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;
  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }
  if (href && href !== '#') {
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }
  return { valid: errors.length === 0, errors };
}

function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

function buildDependencyGraph(node, options = {}) {
  const { dependencyAttribute = 'data-dependency', idAttribute = 'id' } = options;
  
  if (!node) {
    return { success: false, errors: ['Node is required'] };
  }

  function processNode(domNode) {
    if (!domNode) return null;
    
    const nodeData = {
      id: domNode.getAttribute ? domNode.getAttribute(idAttribute) || domNode.id || 'anonymous' : 'anonymous',
      tagName: domNode.tagName ? domNode.tagName.toLowerCase() : 'unknown',
      dependencies: [],
      children: []
    };

    const depElements = domNode.querySelectorAll ? domNode.querySelectorAll(`[${dependencyAttribute}]`) : [];
    depElements.forEach(dep => {
      const depId = dep.getAttribute(dependencyAttribute);
      nodeData.dependencies.push({
        id: depId,
        name: dep.getAttribute(idAttribute) || depId,
        element: dep
      });
    });

    if (domNode.children) {
      Array.from(domNode.children).forEach(child => {
        const childData = processNode(child);
        if (childData) {
          nodeData.children.push(childData);
        }
      });
    }

    return nodeData;
  }

  return {
    success: true,
    root: processNode(node)
  };
}

function renderDependencyGraph(rootNode, container, options = {}) {
  try {
    if (!rootNode) {
      return { success: false, errors: ['Root node is required'] };
    }

    const graphData = buildDependencyGraph(rootNode, options);

    console.log('Rendering dependency graph starting from:', rootNode);
    console.log('Graph data:', JSON.stringify(graphData, null, 2));

    if (container && typeof document !== 'undefined') {
      const graphContainer = document.createElement('div');
      graphContainer.setAttribute('role', 'img');
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
      graphContainer.className = options.className || 'dependency-graph';
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', options.width || '100%');
      svg.setAttribute('height', options.height || '400');
      svg.setAttribute('aria-hidden', 'true');
      
      const description = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      description.textContent = 'Dependency Graph';
      description.setAttribute('id', 'graph-title');
      svg.appendChild(description);
      
      graphContainer.appendChild(svg);
      container.appendChild(graphContainer);
      
      return {
        success: true,
        message: 'Dependency graph rendered successfully',
        container: graphContainer,
        svg: svg,
        data: graphData
      };
    }

    return {
      success: true,
      message: 'Dependency graph data built successfully',
      data: graphData
    };
  } catch (error) {
    console.error('Error rendering dependency graph:', error);
    return { success: false, errors: [error.message] };
  }
}

function buildBreadcrumbData(indexPath, options = {}) {
  const { baseUrl = '', separator = '/' } = options;
  
  if (!indexPath) {
    return { success: false, errors: ['Index path is required'] };
  }

  const segments = indexPath.split(separator).filter(s => s.trim());
  
  const breadcrumbs = segments.map((segment, index) => {
    const url = baseUrl + separator + segments.slice(0, index + 1).join(separator);
    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      original: segment,
      url: url,
      position: index + 1,
      isLast: index === segments.length - 1
    };
  });

  return {
    success: true,
    breadcrumbs: breadcrumbs,
    totalSegments: breadcrumbs.length
  };
}

function renderIndexView(indexPath, container, options = {}) {
  try {
    if (!indexPath) {
      return { success: false, errors: ['Index path is required'] };
    }

    const breadcrumbData = buildBreadcrumbData(indexPath, {
      baseUrl: options.baseUrl || '',
      separator: options.separator || '/'
    });

    console.log('Rendering index view at path:', indexPath);
    console.log('Breadcrumb data:', JSON.stringify(breadcrumbData, null, 2));

    if (container && typeof document !== 'undefined') {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', options.ariaLabel || 'Breadcrumb');
      
      const ol = document.createElement('ol');
      ol.className = options.listClassName || 'breadcrumb';
      
      breadcrumbData.breadcrumbs.forEach((crumb, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        li.setAttribute('aria-current', crumb.isLast ? 'page' : undefined);
        
        if (crumb.isLast) {
          const span = document.createElement('span');
          span.textContent = crumb.label;
          li.appendChild(span);
        } else {
          const link = document.createElement('a');
          link.href = crumb.url;
          link.textContent = crumb.label;
          li.appendChild(link);
        }
        
        ol.appendChild(li);
      });
      
      nav.appendChild(ol);
      container.appendChild(nav);
      
      return {
        success: true,
        message: 'Index view rendered successfully',
        nav: nav,
        breadcrumbs: breadcrumbData.breadcrumbs,
        data: breadcrumbData
      };
    }

    return {
      success: true,
      message: 'Index view data built successfully',
      breadcrumbs: breadcrumbData.breadcrumbs,
      data: breadcrumbData
    };
  } catch (error) {
    console.error('Error rendering index view:', error);
    return { success: false, errors: [error.message] };
  }
}

function towerDefense() {
  const towers = [];
  const enemies = [];
  let wave = 1;
  let gameRunning = false;
  let lastEnemySpawnTime = 0;
  const spawnInterval = 3000;
  const pathPoints = [
    { x: 0, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 400, y: 50 },
    { x: 600, y: 50 }
  ];

  function Tower(x, y, range, damage, rate) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.rate = rate;
    this.lastShot = 0;
  }

  function Enemy(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.pathIndex = 0;
  }

  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  function spawnEnemy() {
    const startPoint = pathPoints[0];
    addEnemy(startPoint.x, startPoint.y, 100, 2);
  }

  function update(currentTime) {
    if (!gameRunning) return;

    if (currentTime - lastEnemySpawnTime > spawnInterval) {
      spawnEnemy();
      lastEnemySpawnTime = currentTime;
    }

    enemies.forEach((enemy, index) => {
      if (enemy.pathIndex < pathPoints.length - 1) {
        const target = pathPoints[enemy.pathIndex + 1];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > enemy.speed) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        } else {
          enemy.pathIndex++;
        }
      } else {
        enemies.splice(index, 1);
      }
    });

    towers.forEach(tower => {
      if (currentTime - tower.lastShot > tower.rate) {
        let closestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
          const dx = enemy.x - tower.x;
          const dy = enemy.y - tower.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < tower.range && distance < minDistance) {
            minDistance = distance;
            closestEnemy = enemy;
          }
        });

        if (closestEnemy) {
          closestEnemy.health -= tower.damage;
          tower.lastShot = currentTime;

          if (closestEnemy.health <= 0) {
            const index = enemies.indexOf(closestEnemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      }
    });

    console.log(`Wave ${wave} - updating game state`);
  }

  function start() {
    gameRunning = true;
    lastEnemySpawnTime = Date.now();
    console.log('Tower defense game started');
    addTower(100, 100, 200, 10, 1000);
    addTower(300, 150, 200, 15, 800);
    addTower(500, 100, 200, 12, 900);
  }

  function stop() {
    gameRunning = false;
    console.log('Tower defense game stopped');
  }

  return {
    start,
    stop,
    addTower,
    addEnemy,
    update,
    getWave: () => wave,
    getEnemies: () => enemies,
    getTowers: () => towers,
    isRunning: () => gameRunning
  };
}

module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  towerDefense
};