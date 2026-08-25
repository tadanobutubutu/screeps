// Assuming you have a dynamically updated list of items
const itemsList = document.querySelector('ul#dynamicList');

// Add a ref to the items for easier manipulation
const items = Array.from(itemsList.children);

items.forEach((item, index) => {
  // Add an ARIA label and hide the original label
  item.setAttribute('aria-label', item.textContent);
  item.style.display = 'none';

  // Add a visible label to the item
  const visibleLabel = document.createElement('span');
  visibleLabel.classList.add('visibleLabel');
  visibleLabel.textContent = 'Dynamic List Item';
  item.appendChild(visibleLabel);
});

// Function to update the items dynamically
function updateItems(newItems) {
  items.forEach((item, index) => {
    item.textContent = newItems[index];
  });
}

// Example of updating the items list
// updateItems(['New Item 1', 'New Item 2', 'New Item 3']);