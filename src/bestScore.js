import axios from 'axios';

const fetchBestScore = async () => {
  try {
    const response = await axios.get('http://localhost:8000/bestScores');
    console.log('3');
    return response.data;
  } catch (error) {
    console.error('Error fetching best score:', error);
    return null;
  }
};

const updateBestScore = async (newBestScore) => {
  try {
   
   
   console.log(newBestScore);
    const existingBestScore = await fetchBestScore();
    console.log(existingBestScore);
    if(existingBestScore === null) {
        await axios.post('http://localhost:8000/bestScores', {bestScore: newBestScore})
    }
    else if (newBestScore > existingBestScore.bestScore) {
      await axios.post('http://localhost:8000/bestScores', { bestScore: newBestScore });
    }
  


} catch (error) {
    console.error('Error updating best score:', error);
  }
};

export { fetchBestScore, updateBestScore };