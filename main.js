// Constants and utilities
const TITLE_DEBOUNCE_DELAY = 300;
const PROMPT_SUGGESTION_LIMIT = 3;
const FETCH_TIMEOUT_MS = 30000;

// DOM element references (set by init)
let titleInput, subtitleInput, bodyInput, langSelect;
let toastContainer, modalOverlay, modalContent, closeModalBtn;
let characterCount, wordCount, progressBar;
let suggestionsContainer, applyAllBtn;
let pageStatus, contentStatus;
let submitBtn, resetBtn;
let htmlElement;

// Feature flags
const FEATURE_FLAG_SIMPLIFIED_UI = true;
const FEATURE_FLAG_ADVANCED_ANALYSIS = true;
const FEATURE_FLAG_DARK_MODE = false;

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
  }
  
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// Core functionality
const textProcessor = {
  calculateStats(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const charsWithSpaces = text.length;
    
    return {
      words: words.length,
      charsNoSpaces,
      charsWithSpaces,
      readingTime: Math.ceil(words / 200)
    };
  },
  
  async suggestImprovements(text, context = '') {
    // Mock suggestions based on text content
    const suggestions = [];
    if (text.includes('example')) suggestions.push('Consider using more specific terms');
    if (text.includes('important')) suggestions.push('Use stronger, more precise language');
    if (text.includes('maybe')) suggestions.push('Replace with more definite terms');
    
    return suggestions.slice(0, PROMPT_SUGGESTION_LIMIT);
  },
  
  getDifficultyLevel(text) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    if (avgWordLength > 6) return 'Advanced';
    if (avgWordLength > 4.5) return 'Intermediate';
    return 'Beginner';
  }
};

// TODO: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
function getLangAttribute() {
  // Get the language from the language select element
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    return langSelect.value;
  }
  // Default to English if no language select is found
  return 'en';
}

function createInPageButton() {
  // Create an in-page button for language selection
  const button = document.createElement('button');
  button.className = 'lang-button';
  button.textContent = 'Switch Language';
  button.onclick = () => {
    const currentLang = getLangAttribute();
    const newLang = currentLang === 'en' ? 'es' : 'en';
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = newLang;
      // Update HTML lang attribute
      if (htmlElement) {
        htmlElement.setAttribute('lang', newLang);
      }
      showToast(`Language changed to ${newLang}`);
    }
  };
  
  return button;
}

// Modal functionality
const modalManager = {
  init() {
    modalOverlay = document.getElementById('modal-overlay');
    modalContent = document.getElementById('modal-content');
    closeModalBtn = document.getElementById('close-modal');
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.close());
    }
    
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          this.close();
        }
      });
    }
  },
  
  open(content) {
    if (!modalContent) return;
    
    modalContent.innerHTML = content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  
  close() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// UI state management
const uiState = {
  currentStats: { words: 0, charsNoSpaces: 0, charsWithSpaces: 0, readingTime: 0 },
  currentSuggestions: [],
  isDirty: false,
  originalContent: '',
  
  setStats(newStats) {
    this.currentStats = newStats;
    this.updateDisplay();
  },
  
  setSuggestions(suggestions) {
    this.currentSuggestions = suggestions;
    this.updateSuggestionsDisplay();
  },
  
  setDirty(dirty = true) {
    this.isDirty = dirty;
    submitBtn.disabled = !dirty;
  },
  
  updateDisplay() {
    if (characterCount) characterCount.textContent = this.currentStats.charsWithSpaces;
    if (wordCount) wordCount.textContent = this.currentStats.words;
    if (progressBar) {
      const percentage = Math.min((this.currentStats.words / 1000) * 100, 100);
      progressBar.style.width = `${percentage}%`;
    }
  },
  
  updateSuggestionsDisplay() {
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    this.currentSuggestions.forEach((suggestion, index) => {
      const suggestionEl = document.createElement('div');
      suggestionEl.className = 'suggestion';
      suggestionEl.innerHTML = `
        <span class="suggestion-text">${suggestion}</span>
        <button class="apply-suggestion" data-index="${index}">Apply</button>
      `;
      suggestionsContainer.appendChild(suggestionEl);
    });
  }
};

// Event handlers
const eventHandlers = {
  init() {
    // Input handling with debouncing
    if (titleInput) {
      titleInput.addEventListener('input', debounce(() => {
        this.updateContent();
      }, TITLE_DEBOUNCE_DELAY));
    }
    
    if (subtitleInput) {
      subtitleInput.addEventListener('input', debounce(() => {
        this.updateContent();
      }, TITLE_DEBOUNCE_DELAY));
    }
    
    if (bodyInput) {
      bodyInput.addEventListener('input', debounce(() => {
        this.updateContent();
      }, TITLE_DEBOUNCE_DELAY));
    }
    
    // Language select handling
    if (langSelect) {
      langSelect.addEventListener('change', () => {
        this.updateContent();
        // Update HTML lang attribute when language changes
        if (htmlElement) {
          htmlElement.setAttribute('lang', getLangAttribute());
        }
      });
    }
    
    // Suggestions application
    if (suggestionsContainer) {
      suggestionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('apply-suggestion')) {
          const index = parseInt(e.target.dataset.index);
          this.applySuggestion(index);
        }
      });
    }
    
    // Apply all button
    if (applyAllBtn) {
      applyAllBtn.addEventListener('click', () => {
        this.applyAllSuggestions();
      });
    }
  },
  
  updateContent() {
    const title = titleInput ? titleInput.value : '';
    const subtitle = subtitleInput ? subtitleInput.value : '';
    const body = bodyInput ? bodyInput.value : '';
    const lang = getLangAttribute();
    
    const fullText = `${title} ${subtitle} ${body}`.trim();
    const stats = textProcessor.calculateStats(fullText);
    uiState.setStats(stats);
    
    // Simulate AI suggestions
    textProcessor.suggestImprovements(fullText).then(suggestions => {
      uiState.setSuggestions(suggestions);
    });
    
    uiState.setDirty(true);
    pageStatus.textContent = 'Draft saved automatically';
  },
  
  applySuggestion(index) {
    if (index < 0 || index >= uiState.currentSuggestions.length) return;
    
    const suggestion = uiState.currentSuggestions[index];
    const currentBody = bodyInput ? bodyInput.value : '';
    
    // Simple application - in reality would be more sophisticated
    const newBody = currentBody + ' ' + suggestion;
    if (bodyInput) {
      bodyInput.value = newBody;
    }
    
    this.updateContent();
    showToast('Suggestion applied', 'success');
  },
  
  applyAllSuggestions() {
    const currentBody = bodyInput ? bodyInput.value : '';
    let newBody = currentBody;
    
    uiState.currentSuggestions.forEach(suggestion => {
      newBody += ' ' + suggestion;
    });
    
    if (bodyInput) {
      bodyInput.value = newBody;
    }
    
    this.updateContent();
    showToast('All suggestions applied', 'success');
  }
};

// Initialization
function init() {
  // DOM element references
  titleInput = document.getElementById('title-input');
  subtitleInput = document.getElementById('subtitle-input');
  bodyInput = document.getElementById('body-input');
  langSelect = document.getElementById('language-select');
  toastContainer = document.getElementById('toast-container');
  modalOverlay = document.getElementById('modal-overlay');
  modalContent = document.getElementById('modal-content');
  closeModalBtn = document.getElementById('close-modal');
  characterCount = document.getElementById('character-count');
  wordCount = document.getElementById('word-count');
  progressBar = document.getElementById('progress-bar');
  suggestionsContainer = document.getElementById('suggestions-container');
  pageStatus = document.getElementById('page-status');
  contentStatus = document.getElementById('content-status');
  submitBtn = document.getElementById('submit-btn');
  resetBtn = document.getElementById('reset-btn');
  htmlElement = document.documentElement; // Reference to HTML element
  
  // Create in-page button
  const langButton = createInPageButton();
  if (langButton) {
    // Add the button to the page (assuming there's a container for it)
    const buttonContainer = document.getElementById('lang-button-container');
    if (buttonContainer) {
      buttonContainer.appendChild(langButton);
    } else {
      document.body.appendChild(langButton);
    }
  }
  
  // Initialize modal manager
  modalManager.init();
  
  // Initialize event handlers
  eventHandlers.init();
  
  // Set initial HTML lang attribute
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
  
  // Initial content update
  eventHandlers.updateContent();
  
  // Set up periodic save indicator
  setInterval(() => {
    pageStatus.textContent = 'Last saved: Just now';
  }, 60000);
}

// Export public API
export { init, showToast, modalManager, uiState };

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);