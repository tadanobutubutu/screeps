// tutorial.auto.js - Auto-generated tutorial configuration

const tutorial = {
  steps: [],
  currentStep: 0,
  
  init: function() {
    this.currentStep = 0;
    return this;
  },
  
  next: function() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return true;
    }
    return false;
  },
  
  prev: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  },
  
  getCurrentStep: function() {
    return this.steps[this.currentStep];
  },
  
  reset: function() {
    this.currentStep = 0;
    return this;
  }
};

module.exports = tutorial;