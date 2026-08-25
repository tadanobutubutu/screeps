// TODO: Add any required exports that might have been removed

// Function to calculate the index of an item in an array based on its id ([NEW])
export const findIndex = (array, id) => {
  return array.findIndex((item) => item.id === id);
};

// Function to filter landmarks based on the specified query ([NEW])
export const filterLandmarks = (query) => {
  return landmarkList.filter((landmark) =>
    landmark.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Function to sort landmarks alphabetically by name ([NEW])
export const sortLandmarksByName = () => {
  return landmarkList.sort((a, b) => a.name.localeCompare(b.name));
};

// Your updated main.js file
const MainComponent = () => {
  // ... existing code

  // ... (some code has been reformatted for readability)

  const handleSearch = (event) => {
    const query = event.target.value;
    const filteredLandmarks = filterLandmarks(query);
    sortLandmarksByName();
    setLandmarks(filteredLandmarks);
  };

  return (
    // ... existing code
    <Searchbar placeholder="Search landmarks" onChange={handleSearch} />
    // ... existing code
  );
};

export default MainComponent;