// before
function heal(unit) {
    if (myHealthPoints >= this.maxHealthPoints * 0.5) {
        // rest of the code...
    }
}

// after
function heal(unit) {
    if (myHealthPoints >= this.maxHealthPoints * 0.5) {
        // rest of the code...
    }
}

// to replace:
function heal(unit) {
    if (myHealthPoints >= (this.maxHealthPoints * 0.5)) {
        // rest of the code...
    }
}