function ensureElement(input) {  
  if (typeof input === "string") {  
    return document.querySelector(input);  
  }  
  return input;  
}